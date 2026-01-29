import React from 'react';
import type { WeatherData } from '../types/weather';
import { format, parseISO } from 'date-fns';

interface WeatherDetailsProps {
  weather: WeatherData;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather }) => {
  const { current, current_units } = weather;

  const details = [
    {
      label: 'Feels Like',
      value: Math.round(current.apparentTemperature),
      unit: current_units.temperature_2m,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
          <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
        </svg>
      )
    },
    {
      label: 'Humidity',
      value: current.humidity,
      unit: current_units.relative_humidity_2m || '%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
        </svg>
      )
    },
    {
      label: 'Wind Speed',
      value: current.windSpeed,
      unit: current_units.wind_speed_10m,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
          <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
        </svg>
      )
    },
    {
      label: 'Precipitation',
      value: current.precipitation,
      unit: current_units.precipitation || 'mm',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300">
          <path d="M20 17.58A5 5 0 0 1 18 20h-1.26A5 5 0 1 1 11 20H9.26a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5h.74a5 5 0 0 1 5 5v3.58z"/>
          <path d="M5 14h.01"/><path d="M19 14h.01"/>
        </svg>
      )
    },
    {
      label: 'UV Index',
      value: current.uvIndex,
      unit: '',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      )
    },
    {
      label: 'Visibility',
      value: current.visibility > 1000 ? (current.visibility / 1000).toFixed(1) : current.visibility,
      unit: current.visibility > 1000 ? 'km' : 'm',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-200">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      )
    },
    {
      label: 'Pressure',
      value: Math.round(current.pressure),
      unit: current_units.surface_pressure || 'hPa',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 w-full">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="bg-neutral-800 border border-neutral-700 p-4 sm:p-5 xl:p-3 rounded-lg flex flex-col items-start justify-center shadow-md h-full min-h-[104px]"
          >
            <div className="flex items-center gap-2 mb-2 w-full">
              {detail.icon}
              <span className="text-neutral-300 text-sm xl:text-[11px] font-medium tracking-wide truncate">{detail.label}</span>
            </div>
            <div className="text-3xl lg:text-4xl xl:text-xl font-bold font-heading text-neutral-0 leading-none flex items-baseline flex-wrap gap-1">
              {detail.value}
              <span className="text-lg lg:text-xl xl:text-xs font-medium text-neutral-400">{detail.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sunrise & Sunset */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-full text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 10 3 3 3-3"/><path d="m7 21 10-10"/><path d="M2 21h20"/>
              </svg>
            </div>
            <div>
              <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-1">Sunrise</p>
              <p className="text-2xl font-bold font-heading text-neutral-0">
                {format(parseISO(current.sunrise), 'h:mm a')}
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-neutral-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                <path d="M12 2v8"/><path d="m4.93 4.93 5.66 5.66"/><path d="M2 12h8"/><path d="m4.93 19.07 5.66-5.66"/><path d="M12 22v-8"/><path d="m19.07 19.07-5.66-5.66"/><path d="M22 12h-8"/><path d="m19.07 4.93-5.66 5.66"/>
             </svg>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 14 3-3 3 3"/><path d="m7 3 10 10"/><path d="M2 3h20"/>
              </svg>
            </div>
            <div>
              <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-1">Sunset</p>
              <p className="text-2xl font-bold font-heading text-neutral-0">
                {format(parseISO(current.sunset), 'h:mm a')}
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-neutral-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                <path d="M12 12v10"/><path d="m19.07 19.07-5.66-5.66"/><path d="M22 12h-8"/><path d="m19.07 4.93-5.66 5.66"/><path d="M12 2v8"/><path d="m4.93 4.93 5.66 5.66"/><path d="M2 12h8"/><path d="m4.93 19.07 5.66-5.66"/>
             </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
