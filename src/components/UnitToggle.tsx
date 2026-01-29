import React, { useState, useRef, useEffect } from 'react';
import type { UnitSystem } from '../types/weather';
import iconUnits from '../assets/images/icon-units.svg';

interface UnitToggleProps {
  unit: UnitSystem;
  onToggle: (unit: UnitSystem) => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedUnit: UnitSystem) => {
    onToggle(selectedUnit);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-3 sm:px-3.5 py-2 rounded-lg shadow-md transition-colors flex items-center gap-1.5 sm:gap-2 text-neutral-0 text-xs sm:text-sm font-medium"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open units menu"
      >
        <img src={iconUnits} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-90" />
        <span className="hidden sm:inline">Units</span>
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"/></svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-[-8px] sm:right-0 mt-2 bg-neutral-800 rounded-lg shadow-lg overflow-hidden z-50 w-56 sm:w-64 border border-neutral-700 py-2 origin-top-right transition-all" role="menu" aria-label="Units">
          {/* Switch group header */}
          <div className="px-4 pb-2 text-neutral-300 text-xs uppercase tracking-wide">Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}</div>

          {/* Temperature */}
          <div className="px-2 py-1">
            <div className="px-2 py-1 text-neutral-400 text-xs">Temperature</div>
            <button
              role="menuitemradio"
              aria-checked={unit === 'metric'}
              onClick={() => handleSelect('metric')}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between ${
                unit === 'metric' ? 'text-neutral-0' : 'text-neutral-300'
              }`}
            >
              Celsius (°C)
              {unit === 'metric' && (
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.85a1 1 0 011.414-1.415l3.093 3.093 6.364-6.364a1 1 0 011.537.126z" clipRule="evenodd"/></svg>
              )}
            </button>
            <button
              role="menuitemradio"
              aria-checked={unit === 'imperial'}
              onClick={() => handleSelect('imperial')}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between ${
                unit === 'imperial' ? 'text-neutral-0' : 'text-neutral-300'
              }`}
            >
              Fahrenheit (°F)
              {unit === 'imperial' && (
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.85a1 1 0 011.414-1.415l3.093 3.093 6.364-6.364a1 1 0 011.537.126z" clipRule="evenodd"/></svg>
              )}
            </button>
          </div>

          <div className="mx-2 my-1 h-px bg-neutral-700" />

          {/* Wind Speed */}
          <div className="px-2 py-1">
            <div className="px-2 py-1 text-neutral-400 text-xs">Wind Speed</div>
            <button
              role="menuitemradio"
              aria-checked={unit === 'metric'}
              onClick={() => handleSelect('metric')}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between ${
                unit === 'metric' ? 'text-neutral-0' : 'text-neutral-300'
              }`}
            >
              km/h
              {unit === 'metric' && (
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.85a1 1 0 011.414-1.415l3.093 3.093 6.364-6.364a1 1 0 011.537.126z" clipRule="evenodd"/></svg>
              )}
            </button>
            <button
              role="menuitemradio"
              aria-checked={unit === 'imperial'}
              onClick={() => handleSelect('imperial')}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between ${
                unit === 'imperial' ? 'text-neutral-0' : 'text-neutral-300'
              }`}
            >
              mph
              {unit === 'imperial' && (
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.85a1 1 0 011.414-1.415l3.093 3.093 6.364-6.364a1 1 0 011.537.126z" clipRule="evenodd"/></svg>
              )}
            </button>
          </div>

          <div className="mx-2 my-1 h-px bg-neutral-700" />

          {/* Precipitation */}
          <div className="px-2 py-1">
            <div className="px-2 py-1 text-neutral-400 text-xs">Precipitation</div>
            <button
              role="menuitemradio"
              aria-checked={unit === 'metric'}
              onClick={() => handleSelect('metric')}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between ${
                unit === 'metric' ? 'text-neutral-0' : 'text-neutral-300'
              }`}
            >
              Millimeters (mm)
              {unit === 'metric' && (
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.85a1 1 0 011.414-1.415l3.093 3.093 6.364-6.364a1 1 0 011.537.126z" clipRule="evenodd"/></svg>
              )}
            </button>
            <button
              role="menuitemradio"
              aria-checked={unit === 'imperial'}
              onClick={() => handleSelect('imperial')}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between ${
                unit === 'imperial' ? 'text-neutral-0' : 'text-neutral-300'
              }`}
            >
              Inches (in)
              {unit === 'imperial' && (
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.85a1 1 0 011.414-1.415l3.093 3.093 6.364-6.364a1 1 0 011.537.126z" clipRule="evenodd"/></svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitToggle;
