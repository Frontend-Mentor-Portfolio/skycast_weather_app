import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { WeatherData } from '../types/weather';
import { getWeatherIcon } from '../utils/weatherMapping';
import { format, parseISO, isSameDay, startOfDay } from 'date-fns';

interface HourlyForecastProps {
  weather: WeatherData;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ weather }) => {
  const { hourly } = weather;
  
  // Get unique days from hourly data
  const uniqueDays = useMemo(() => {
    const days = new Set<string>();
    hourly.time.forEach(t => days.add(startOfDay(parseISO(t)).toISOString()));
    return Array.from(days).sort(); // Sort to ensure chronological order
  }, [hourly.time]);

  const [selectedDay, setSelectedDay] = useState<string>(uniqueDays[0] || '');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Update selectedDay if uniqueDays changes (e.g. new data fetched)
  React.useEffect(() => {
    if (uniqueDays.length > 0 && !uniqueDays.includes(selectedDay)) {
        setSelectedDay(uniqueDays[0]);
    } else if (uniqueDays.length > 0 && selectedDay === '') {
        setSelectedDay(uniqueDays[0]);
    }
  }, [uniqueDays, selectedDay]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);


  const hourlyDataForDay = useMemo(() => {
    if (!selectedDay) return [];
    
    return hourly.time
      .map((t, i) => ({
        time: t,
        temp: hourly.temperature_2m[i],
        code: hourly.weather_code[i],
      }))
      .filter(item => isSameDay(parseISO(item.time), parseISO(selectedDay)));
  }, [hourly, selectedDay]);

  // We show a vertical list of hours for the selected day
  
  return (
    <div className="bg-neutral-800/60 border border-neutral-600/60 rounded-[32px] p-5 w-full shadow-md flex flex-col">
      <div className="flex items-center justify-between mb-4" ref={menuRef}>
        <h3 className="text-lg font-bold font-heading text-neutral-200">Hourly forecast</h3>

        {/* Custom Day Selector */}
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
              }
              if (e.key === 'Escape') setIsOpen(false);
            }}
            className="flex items-center gap-2 pl-3 pr-7 py-1.5 rounded-lg bg-neutral-700/40 border border-neutral-600/60 text-neutral-200 text-xs font-semibold hover:bg-neutral-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedDay ? format(parseISO(selectedDay), 'EEEE') : 'Select Day'}
            <svg className="absolute right-2.5 h-3.5 w-3.5 text-neutral-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </button>

          {isOpen && (
            <div
              role="listbox"
              tabIndex={-1}
              className="absolute right-0 mt-2 w-40 bg-neutral-800/95 backdrop-blur-md border border-neutral-600/60 rounded-lg shadow-lg overflow-hidden z-20"
            >
              {uniqueDays.map((dayIso) => {
                const isSelected = dayIso === selectedDay;
                return (
                  <div
                    role="option"
                    aria-selected={isSelected}
                    key={dayIso}
                    tabIndex={0}
                    onClick={() => { setSelectedDay(dayIso); setIsOpen(false); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedDay(dayIso);
                        setIsOpen(false);
                      }
                      if (e.key === 'Escape') setIsOpen(false);
                    }}
                    className={`px-3 py-2 flex items-center justify-between cursor-pointer text-sm hover:bg-neutral-700/50 ${isSelected ? 'bg-neutral-700/40 text-neutral-0' : 'text-neutral-200'}`}
                  >
                    <span className="font-medium">{format(parseISO(dayIso), 'EEEE')}</span>
                    {isSelected && (
                      <svg className="h-3.5 w-3.5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M7.629 13.314l-3.3-3.3 1.4-1.4 1.9 1.9 5.65-5.65 1.4 1.4z"/></svg>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Hourly List - Vertical */}
      <div 
        className="flex flex-col overflow-y-auto pr-1 custom-scrollbar flex-grow max-h-[560px] focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded-lg"
        tabIndex={0}
        role="region"
        aria-label="Hourly forecast list"
      >
        <div className="flex flex-col gap-2">
          {hourlyDataForDay.map((item) => (
            <div key={item.time} className="flex items-center px-4 py-3 rounded-2xl bg-neutral-700/20 hover:bg-neutral-700/30 transition-colors">
              <div className="flex-shrink-0 w-8 flex justify-center mr-4">
                   <img 
                      src={getWeatherIcon(item.code)} 
                      alt="" 
                      className="w-7 h-7 object-contain"
                  />
              </div>

              <span className="text-neutral-0 font-medium text-xs lg:text-sm flex-grow">
                {format(parseISO(item.time), 'h a')}
              </span>
              
              <span className="font-bold text-sm lg:text-base text-neutral-0">{Math.round(item.temp)}°</span>
            </div>
          ))}
        </div>
        {hourlyDataForDay.length === 0 && (
            <div className="text-neutral-400 p-3 text-center text-sm">No hourly data available for this day.</div>
        )}
      </div>
    </div>
  );
};

export default HourlyForecast;
