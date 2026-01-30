import React, { useState, useRef, useEffect } from 'react';
import type { UnitSystem, NotificationSettings } from '../types/weather';
import iconUnits from '../assets/images/icon-units.svg';

interface UnitToggleProps {
  unit: UnitSystem;
  onToggle: (unit: UnitSystem) => void;
  notificationSettings?: NotificationSettings;
  onToggleNotification?: (key: keyof NotificationSettings) => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onToggle, notificationSettings, onToggleNotification }) => {
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
    // setIsOpen(false); // Keep open to allow multiple changes
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    if (onToggleNotification) {
      onToggleNotification(key);
    }
  };

  // Request permission helper
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert("Permission needed to show notifications");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-3 sm:px-3.5 py-2 rounded-lg shadow-md transition-colors flex items-center gap-1.5 sm:gap-2 text-neutral-0 text-xs sm:text-sm font-medium"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open settings menu"
      >
        <img src={iconUnits} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-90" />
        <span className="hidden sm:inline">Settings</span>
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" /></svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-[-8px] sm:right-0 mt-2 bg-neutral-800 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] z-50 w-64 sm:w-72 border border-neutral-700 py-2 origin-top-right transition-all scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800" role="menu" aria-label="Settings">

          {/* Section: Units */}
          <div className="px-4 py-2 text-neutral-300 text-xs uppercase tracking-wide font-bold border-b border-neutral-700 mb-1">Units</div>

          {/* Temperature */}
          <div className="px-2 py-1">
            <div className="px-2 py-1 text-neutral-400 text-xs">Temperature</div>
            <button
              role="menuitemradio"
              aria-checked={unit === 'metric'}
              onClick={() => handleSelect('metric')}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between ${unit === 'metric' ? 'text-neutral-0' : 'text-neutral-300'
                }`}
            >
              Celsius (°C)
              {unit === 'metric' && (
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.85a1 1 0 011.414-1.415l3.093 3.093 6.364-6.364a1 1 0 011.537.126z" clipRule="evenodd" /></svg>
              )}
            </button>
            <button
              role="menuitemradio"
              aria-checked={unit === 'imperial'}
              onClick={() => handleSelect('imperial')}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between ${unit === 'imperial' ? 'text-neutral-0' : 'text-neutral-300'
                }`}
            >
              Fahrenheit (°F)
              {unit === 'imperial' && (
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.85a1 1 0 011.414-1.415l3.093 3.093 6.364-6.364a1 1 0 011.537.126z" clipRule="evenodd" /></svg>
              )}
            </button>
          </div>

          <div className="mx-2 my-1 h-px bg-neutral-700" />

          {/* Wind Speed & Precipitation omitted for brevity if needed? No, let's keep them compact or just list triggers */}
          {/* Wind Speed */}
          <div className="px-2 py-1">
            <div className="px-2 py-1 text-neutral-400 text-xs">Wind Speed</div>
            <div className="flex bg-neutral-900/50 rounded-lg p-1 mx-2">
              <button
                onClick={() => handleSelect('metric')}
                className={`flex-1 py-1 text-xs rounded-md transition-colors ${unit === 'metric' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
              >km/h</button>
              <button
                onClick={() => handleSelect('imperial')}
                className={`flex-1 py-1 text-xs rounded-md transition-colors ${unit === 'imperial' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
              >mph</button>
            </div>
          </div>

          {/* Precipitation */}
          <div className="px-2 py-1">
            <div className="px-2 py-1 text-neutral-400 text-xs">Precipitation</div>
            <div className="flex bg-neutral-900/50 rounded-lg p-1 mx-2">
              <button
                onClick={() => handleSelect('metric')}
                className={`flex-1 py-1 text-xs rounded-md transition-colors ${unit === 'metric' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
              >mm</button>
              <button
                onClick={() => handleSelect('imperial')}
                className={`flex-1 py-1 text-xs rounded-md transition-colors ${unit === 'imperial' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
              >in</button>
            </div>
          </div>

          <div className="mx-2 my-2 h-px bg-neutral-700" />

          {/* Section: Notifications */}
          {notificationSettings && onToggleNotification && (
            <>
              <div className="px-4 py-2 text-neutral-300 text-xs uppercase tracking-wide font-bold border-b border-neutral-700 mb-1 flex justify-between items-center">
                <span>Notifications</span>
                <button className="text-[10px] text-blue-400 hover:text-blue-300 underline" onClick={requestPermission}>
                  Check Permission
                </button>
              </div>

              <div className="px-2 py-1 space-y-1">
                {/* Master Toggle */}
                <button
                  onClick={() => handleNotificationToggle('enabled')}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between group"
                >
                  <span className={notificationSettings.enabled ? 'text-white' : 'text-neutral-400'}>Enable Notifications</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${notificationSettings.enabled ? 'bg-blue-500' : 'bg-neutral-600'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${notificationSettings.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>

                {notificationSettings.enabled && (
                  <div className="pl-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[
                      { key: 'precipitation', label: 'Rain Alerts' },
                      { key: 'tempShifts', label: 'Temp Shifts' },
                      { key: 'morningBriefing', label: 'Morning Briefing' },
                      { key: 'severeWeather', label: 'Severe Weather' },
                      { key: 'outfitAdvisor', label: 'Outfit Advisor' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleNotificationToggle(item.key as keyof NotificationSettings)}
                        className="w-full text-left px-3 py-1.5 rounded-md hover:bg-neutral-700/60 transition-colors flex items-center justify-between"
                      >
                        <span className={`text-sm ${notificationSettings[item.key as keyof NotificationSettings] ? 'text-neutral-200' : 'text-neutral-500'}`}>{item.label}</span>
                        <div className={`w-2.5 h-2.5 rounded-sm border ${notificationSettings[item.key as keyof NotificationSettings] ? 'bg-blue-500 border-blue-500' : 'border-neutral-500'}`}>
                          {notificationSettings[item.key as keyof NotificationSettings] && (
                            <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default UnitToggle;
