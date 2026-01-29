import React from 'react';
import type { WeatherData } from '../types/weather';
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherMapping';
import { format, parseISO } from 'date-fns';

interface Forecast7DaysProps {
  weather: WeatherData;
}

const Forecast7Days: React.FC<Forecast7DaysProps> = ({ weather }) => {
  const { daily } = weather;
  
  // Create an array of daily forecast objects
  const forecastDays = daily.time.map((time, index) => {
    return {
      date: time,
      weatherCode: daily.weather_code[index],
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
    };
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-xl font-bold font-heading text-neutral-200">Daily forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {forecastDays.map((day, index) => (
          <div key={day.date} className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 flex flex-col items-center justify-center gap-2 shadow-md min-h-[112px]">
            <span className="text-neutral-300 font-medium text-sm">
              {index === 0 ? 'Today' : format(parseISO(day.date), 'EEE')}
            </span>
            
            <img 
                src={getWeatherIcon(day.weatherCode)} 
                alt={getWeatherDescription(day.weatherCode)}
                className="w-8 h-8 object-contain my-0.5"
            />

            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-0 text-base">{Math.round(day.maxTemp)}°</span>
              <span className="text-neutral-400 text-xs">{Math.round(day.minTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast7Days;
