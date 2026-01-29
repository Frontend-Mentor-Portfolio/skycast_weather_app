import { useState, useEffect } from 'react';
import HeroTitle from './components/HeroTitle';
import { getWeatherData, reverseGeocode } from './services/weather';
import type { WeatherData, Location, UnitSystem } from './types/weather';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import Forecast7Days from './components/Forecast7Days';
import HourlyForecast from './components/HourlyForecast';
import FavoritesList from './components/FavoritesList';
import ComparisonView from './components/ComparisonView';
import UnitToggle from './components/UnitToggle';
import logo from './assets/images/logo.svg';
import iconLoading from './assets/images/icon-loading.svg';

// Default location (London)
const DEFAULT_LOCATION: Location = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  country: 'United Kingdom',
};

function App() {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [favorites, setFavorites] = useState<Location[]>(() => {
    const saved = localStorage.getItem('weather-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [comparedLocations, setComparedLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem('weather-comparison');
    return saved ? JSON.parse(saved) : [];
  });
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  useEffect(() => {
    // Dynamic Theme based on time of day
    const updateTheme = () => {
      const hour = new Date().getHours();
      const isDay = hour > 6 && hour < 18; // 7 AM to 6 PM is light mode
      if (isDay) {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('weather-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('weather-comparison', JSON.stringify(comparedLocations));
  }, [comparedLocations]);

  useEffect(() => {
    // Try to get user's location on first visit
    const getInitialLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const detectedLocation = await reverseGeocode(latitude, longitude);
            if (detectedLocation) {
              setLocation(detectedLocation);
            }
          },
          (error) => {
            console.warn("Geolocation error:", error.message);
            // Fallback to London is already set as default state
          }
        );
      }
    };

    getInitialLocation();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      const data = await getWeatherData(location.latitude, location.longitude, unit);
      if (data) {
        setWeather(data);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [location, unit]);

  const handleLocationSelect = (newLocation: Location) => {
    setLocation(newLocation);
    setIsComparisonMode(false);
  };

  const handleUnitToggle = (newUnit: UnitSystem) => {
    setUnit(newUnit);
  };

  const toggleFavorite = (loc: Location) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === loc.id || (f.latitude === loc.latitude && f.longitude === loc.longitude));
      if (isFav) {
        return prev.filter(f => !(f.id === loc.id || (f.latitude === loc.latitude && f.longitude === loc.longitude)));
      }
      return [...prev, loc];
    });
  };

  const toggleCompareLocation = (loc: Location) => {
    setComparedLocations(prev => {
      const isCompared = prev.some(f => f.id === loc.id || (f.latitude === loc.latitude && f.longitude === loc.longitude));
      if (isCompared) {
        return prev.filter(f => !(f.id === loc.id || (f.latitude === loc.latitude && f.longitude === loc.longitude)));
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 locations at a time.");
        return prev;
      }
      return [...prev, loc];
    });
  };

  const removeComparedLocation = (loc: Location) => {
    setComparedLocations(prev => prev.filter(f => !(f.id === loc.id || (f.latitude === loc.latitude && f.longitude === loc.longitude))));
  };

  const clearComparison = () => {
    setComparedLocations([]);
    setIsComparisonMode(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div id="app-container" className="w-full max-w-[1440px] px-4 sm:px-8 xl:px-16 py-8 xl:py-16">
        {/* Header */}
        <header className="flex flex-col gap-10 mb-10 lg:mb-12">
          {/* Top Row: Logo and Unit Toggle */}
          <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-6">
              <img src={logo} alt="Weather App" className="h-6 sm:h-10 cursor-pointer object-contain" onClick={() => setIsComparisonMode(false)} />
              {comparedLocations.length > 0 && (
                <button
                  onClick={() => setIsComparisonMode(!isComparisonMode)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-[10px] sm:text-sm transition-all ${isComparisonMode ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 16v5h-5"/><path d="M3 21h5v-5"/><path d="m21 3-7.5 7.5"/><path d="m15 15 6 6"/><path d="m3 3 6 6"/><path d="m3 21 7.5-7.5"/>
                  </svg>
                  <span>
                    {isComparisonMode ? 'Exit' : 'Compare'}
                    <span className="hidden sm:inline"> {isComparisonMode ? 'Comparison' : `(${comparedLocations.length})`}</span>
                    <span className="sm:hidden ml-1">({comparedLocations.length})</span>
                  </span>
                </button>
              )}
            </div>
            <div className="flex-shrink-0">
              <UnitToggle unit={unit} onToggle={handleUnitToggle} />
            </div>
          </div>
          
          {/* Bottom Row: Greeting and Search */}
          <div className="w-full flex flex-col items-center justify-center text-center">
            <div className="w-full max-w-[720px] h-28 sm:h-32 lg:h-auto flex items-center justify-center mx-auto">
              <HeroTitle
                text="How's the sky looking today?"
                className="block text-center mx-auto text-3xl sm:text-4xl md:text-5xl lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.01em] font-heading text-neutral-0 font-bold tracking-tight"
              />
            </div>
            <div className="w-full max-w-[560px] mt-3 lg:mt-8">
              <SearchBar 
                onLocationSelect={handleLocationSelect} 
                onToggleCompare={toggleCompareLocation}
                comparedLocations={comparedLocations}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        {loading && !weather ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <img src={iconLoading} alt="Loading..." className="w-12 h-12 animate-spin mb-4" />
            <p className="text-neutral-300">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h2 className="text-2xl font-bold text-neutral-200 mb-2">Oops! Something went wrong.</h2>
            <p className="text-neutral-400">Failed to load weather data. Please try again.</p>
            <button 
                onClick={() => setLocation({ ...location })} 
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                Retry
            </button>
          </div>
        ) : weather ? (
          isComparisonMode ? (
            <ComparisonView 
              locations={comparedLocations}
              unit={unit}
              onRemove={removeComparedLocation}
              onSelect={handleLocationSelect}
              onClear={clearComparison}
              onClose={() => setIsComparisonMode(false)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {/* Main Content (Left/Center) */}
              <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6 lg:gap-8">
                <CurrentWeather 
                  weather={weather} 
                  location={location} 
                  isFavorite={favorites.some(f => f.id === location.id || (f.latitude === location.latitude && f.longitude === location.longitude))}
                  onToggleFavorite={toggleFavorite}
                  isCompared={comparedLocations.some(f => f.id === location.id || (f.latitude === location.latitude && f.longitude === location.longitude))}
                  onToggleCompare={toggleCompareLocation}
                />
                <WeatherDetails weather={weather} />
                <Forecast7Days weather={weather} />
              </div>

              {/* Sidebar (Right) */}
              <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-8 self-start lg:max-w-[480px] w-full">
                <FavoritesList 
                  favorites={favorites} 
                  currentLocation={location}
                  onSelect={handleLocationSelect}
                  onRemove={toggleFavorite}
                />
                <HourlyForecast weather={weather} />
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

export default App;
