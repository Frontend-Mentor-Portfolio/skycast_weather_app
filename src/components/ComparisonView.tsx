import React from 'react';
import type { Location, UnitSystem } from '../types/weather';
import ComparisonCard from './ComparisonCard';

interface ComparisonViewProps {
  locations: Location[];
  unit: UnitSystem;
  onRemove: (loc: Location) => void;
  onSelect: (loc: Location) => void;
  onClear: () => void;
  onClose: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ 
  locations, 
  unit, 
  onRemove,
  onSelect,
  onClear,
  onClose 
}) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-heading text-neutral-0">Compare Locations</h2>
          <p className="text-neutral-400">View weather side-by-side for your selected places.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClear}
            className="px-6 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors text-sm font-bold"
          >
            Clear All
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-neutral-800 text-neutral-0 hover:bg-neutral-700 transition-colors text-sm font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(locations.length, 4)} xl:grid-cols-${Math.min(locations.length, 4)} gap-6 overflow-x-auto pb-4 custom-scrollbar`}>
        {locations.map((loc) => (
          <ComparisonCard 
            key={`${loc.latitude}-${loc.longitude}`}
            location={loc}
            unit={unit}
            onRemove={onRemove}
            onSelect={onSelect}
          />
        ))}
        {locations.length < 4 && (
          <div className="flex flex-col items-center justify-center p-8 rounded-[32px] border-2 border-dashed border-neutral-700/50 bg-neutral-800/20 text-neutral-500 min-h-[400px]">
            <div className="p-4 rounded-full bg-neutral-800/50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
            </div>
            <p className="font-bold">Add more locations</p>
            <p className="text-sm">Search and click the comparison icon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView;
