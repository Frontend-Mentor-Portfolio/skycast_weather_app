import React, { useState, useEffect } from 'react';
import type { Location, WeatherData } from '../types/weather';
import { getWeatherData } from '../services/weather';
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherMapping';
import AnimatedBackground from './AnimatedBackground';

interface ComparisonCardProps {
  location: Location;
  unit: 'metric' | 'imperial';
  onRemove: (loc: Location) => void;
  onSelect: (loc: Location) => void;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  location, 
  unit, 
  onRemove,
  onSelect
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const data = await getWeatherData(location.latitude, location.longitude, unit);
      setWeather(data);
      setLoading(false);
    };
    fetchWeather();
  }, [location, unit]);

  if (loading) {
    return (
      <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="w-12 h-12 bg-neutral-700 rounded-full mb-4"></div>
        <div className="h-4 w-24 bg-neutral-700 rounded mb-2"></div>
        <div className="h-3 w-16 bg-neutral-700 rounded"></div>
      </div>
    );
  }

  if (!weather) return null;

  const { current, current_units } = weather;

  return (
    <div className="bg-neutral-800/60 border border-neutral-600/60 rounded-[32px] p-8 flex flex-col items-center text-center shadow-xl transition-all hover:border-blue-500/30 group relative overflow-hidden">
      <AnimatedBackground weatherCode={current.weatherCode} />
      
      <button 
        onClick={() => onRemove(location)}
        className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-400 transition-colors z-10"
        aria-label="Remove"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>

      <div className="cursor-pointer relative z-10" onClick={() => onSelect(location)}>
        <h3 className="text-xl font-bold font-heading text-neutral-0 mb-1">{location.name}</h3>
        <p className="text-sm text-neutral-400 mb-6">{location.country}</p>

        <img 
          src={getWeatherIcon(current.weatherCode)} 
          alt={getWeatherDescription(current.weatherCode)}
          className="w-24 h-24 object-contain mb-4 mx-auto"
        />

        <div className="text-6xl font-bold font-heading text-neutral-0 mb-2">
          {Math.round(current.temperature)}°
        </div>
        <p className="text-lg font-medium text-neutral-200 mb-8">
          {getWeatherDescription(current.weatherCode)}
        </p>

        <div className="grid grid-cols-1 w-full gap-4 pt-6 border-t border-neutral-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Feels Like</span>
            <span className="text-neutral-0 font-bold">{Math.round(current.apparentTemperature)}°</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Humidity</span>
            <span className="text-neutral-0 font-bold">{current.humidity}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Wind</span>
            <span className="text-neutral-0 font-bold">{current.windSpeed} {current_units.wind_speed_10m}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
