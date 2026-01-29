import React from 'react';
import type { WeatherData, Location } from '../types/weather';
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherMapping';
import { format } from 'date-fns';
import bgLarge from '../assets/images/bg-today-large.svg';
import bgSmall from '../assets/images/bg-today-small.svg';
import AnimatedBackground from './AnimatedBackground';

interface CurrentWeatherProps {
  weather: WeatherData;
  location: Location;
  isFavorite: boolean;
  onToggleFavorite: (loc: Location) => void;
  isCompared: boolean;
  onToggleCompare: (loc: Location) => void;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  weather, 
  location, 
  isFavorite, 
  onToggleFavorite,
  isCompared,
  onToggleCompare
}) => {
  const { current, daily } = weather;
  const todayMax = Math.round(daily.temperature_2m_max[0]);
  const todayMin = Math.round(daily.temperature_2m_min[0]);
  const currentTemp = Math.round(current.temperature);
  
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md w-full border border-neutral-700">
      {/* Animated Background */}
      <AnimatedBackground weatherCode={current.weatherCode} />
      
      {/* Fallback/Base Background Image (subdued) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <picture>
            <source media="(min-width: 768px)" srcSet={bgLarge} />
            <img src={bgSmall} alt="" className="w-full h-full object-cover" />
         </picture>
      </div>

      <div className="relative z-10 p-5 md:p-8 lg:p-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-neutral-0 min-h-[280px]">
        {/* Left Side: Location & Date */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left mb-auto md:mb-0">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-4xl font-bold font-heading tracking-tight">{location.name}</h2>
                <button 
                  onClick={() => onToggleFavorite(location)}
                  className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => onToggleCompare(location)}
                  className={`p-2 rounded-full transition-colors ${isCompared ? 'text-blue-400 bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                  aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 16v5h-5"/><path d="M3 21h5v-5"/><path d="m21 3-7.5 7.5"/><path d="m15 15 6 6"/><path d="m3 3 6 6"/><path d="m3 21 7.5-7.5"/>
                  </svg>
                </button>
            </div>
            <span className="text-base md:text-xl font-medium opacity-90">{location.country}</span>
            <p className="text-sm md:text-base font-medium opacity-90 mt-1.5">
                {format(new Date(), 'EEEE, d MMM, yyyy')}
            </p>
        </div>
        
        {/* Right Side: Temp & Icon */}
        <div className="flex flex-col items-center md:items-end gap-2">
             <div className="flex items-center gap-5">
                <img 
                    src={getWeatherIcon(current.weatherCode)} 
                    alt={getWeatherDescription(current.weatherCode)}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
                <div className="text-7xl md:text-[8rem] lg:text-[8.5rem] xl:text-[9rem] font-bold font-heading tracking-tighter leading-none">
                  {currentTemp}°
                </div>
             </div>
             <p className="text-xl md:text-2xl font-medium font-heading">
                {getWeatherDescription(current.weatherCode)}
            </p>
             <div className="flex gap-5 mt-1.5 text-lg font-medium opacity-90">
               <span>H: {todayMax}°</span>
               <span>L: {todayMin}°</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
