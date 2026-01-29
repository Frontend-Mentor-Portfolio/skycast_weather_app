import React, { useState, useEffect, useRef } from 'react';
import { searchLocation } from '../services/weather';
import type { Location } from '../types/weather';
import iconSearch from '../assets/images/icon-search.svg';
import iconLoading from '../assets/images/icon-loading.svg';

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
  onToggleCompare: (location: Location) => void;
  comparedLocations: Location[];
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onLocationSelect, 
  onToggleCompare,
  comparedLocations
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Option B: Publish button's left offset relative to the main container as a CSS variable
  useEffect(() => {
    const updateButtonLeft = () => {
      const container = document.getElementById('app-container');
      if (!container || !wrapperRef.current || !buttonRef.current) return;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const left = Math.max(0, Math.round(buttonRect.left - containerRect.left));
      document.documentElement.style.setProperty('--button-left', `${left}px`);
    };

    updateButtonLeft();
    window.addEventListener('resize', updateButtonLeft);
    return () => window.removeEventListener('resize', updateButtonLeft);
  }, []);

  

  // Live suggestions with debounce while typing
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setError(false);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    setError(false);
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const locations = await searchLocation(q);
        setResults(locations);
        if (locations.length === 0) setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(id);
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setShowResults(true);
    setError(false);
    
    try {
      const locations = await searchLocation(query);
      setResults(locations);
      if (locations.length === 0) {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (location: Location) => {
    onLocationSelect(location);
    setQuery(`${location.name}, ${location.country}`);
    setShowResults(false);
  };

  return (
    <div className="relative w-full md:w-[560px]" ref={wrapperRef}>
      <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative w-full sm:flex-1">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            {loading ? (
              <img src={iconLoading} alt="Loading" className="w-5 h-5 animate-spin" />
            ) : (
              <img src={iconSearch} alt="Search" className="w-5 h-5 opacity-50" />
            )}
          </div>
          <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a place..."
          className="w-full bg-neutral-700/60 text-neutral-0 rounded-lg h-12 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500/60 transition-all font-body text-lg placeholder-neutral-300 border border-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          aria-label="Search for a place"
        />
        <button
          type="button"
          onClick={startVoiceSearch}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-neutral-400 hover:text-white hover:bg-white/10'}`}
          title="Voice Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
        </button>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 h-12 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          ref={buttonRef}
          disabled={loading}
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {showResults && (results.length > 0 || error) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-neutral-800/95 backdrop-blur-sm rounded-lg shadow-xl z-50 overflow-hidden border border-neutral-700/50">
          {error ? (
            <div className="p-4 text-center text-neutral-300">
              No results found.
            </div>
          ) : (
            <ul>
              {results.map((location) => (
                <li
                  key={location.id}
                  className="px-4 py-3 hover:bg-neutral-700 cursor-pointer transition-colors flex items-center justify-between group"
                  onClick={() => handleSelect(location)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-0">{location.name}</span>
                    <span className="text-sm text-neutral-300">
                      {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(location);
                    }}
                    className={`p-2 rounded-full transition-all ${comparedLocations.some(l => l.id === location.id) ? 'text-blue-400 bg-blue-500/10' : 'text-neutral-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100'}`}
                    title="Add to comparison"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 16v5h-5"/><path d="M3 21h5v-5"/><path d="m21 3-7.5 7.5"/><path d="m15 15 6 6"/><path d="m3 3 6 6"/><path d="m3 21 7.5-7.5"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
