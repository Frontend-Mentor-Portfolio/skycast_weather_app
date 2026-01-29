import React from 'react';
import type { Location } from '../types/weather';

interface FavoritesListProps {
  favorites: Location[];
  currentLocation: Location;
  onSelect: (loc: Location) => void;
  onRemove: (loc: Location) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ 
  favorites, 
  currentLocation, 
  onSelect, 
  onRemove 
}) => {
  if (favorites.length === 0) return null;

  return (
    <div className="bg-neutral-800/60 border border-neutral-600/60 rounded-[32px] p-6 w-full shadow-md flex flex-col">
      <h3 className="text-md font-bold font-heading text-neutral-200 mb-4">Saved Locations</h3>
      <div className="flex flex-col gap-3">
        {favorites.map((loc) => {
          const isSelected = loc.id === currentLocation.id || (loc.latitude === currentLocation.latitude && loc.longitude === currentLocation.longitude);
          const key = loc.id ? `id-${loc.id}` : `coords-${loc.latitude}-${loc.longitude}`;
          return (
            <div 
              key={key}
              className={`flex items-center justify-between p-4 rounded-2xl transition-colors cursor-pointer ${isSelected ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-neutral-700/20 hover:bg-neutral-700/30'}`}
              onClick={() => onSelect(loc)}
            >
              <div className="flex flex-col overflow-hidden">
                <span className="text-neutral-0 font-medium text-sm truncate">{loc.name}</span>
                <span className="text-neutral-400 text-xs truncate">{loc.country}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(loc);
                }}
                className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                aria-label="Remove favorite"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesList;
