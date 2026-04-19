import React from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import "./LocationRangeSlider.css";

interface LocationRangeSliderProps {
  maxDistance: number;
  onDistanceChange: (distance: number) => void;
  className?: string;
}

export default function LocationRangeSlider({ 
  maxDistance, 
  onDistanceChange, 
  className = "" 
}: LocationRangeSliderProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [currentDistance, setCurrentDistance] = React.useState(maxDistance);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = parseInt(e.target.value);
    setCurrentDistance(newDistance);
    onDistanceChange(newDistance);
  };

  const incrementDistance = () => {
    const newDistance = Math.min(currentDistance + 5, 100);
    setCurrentDistance(newDistance);
    onDistanceChange(newDistance);
  };

  const decrementDistance = () => {
    const newDistance = Math.max(currentDistance - 5, 1);
    setCurrentDistance(newDistance);
    onDistanceChange(newDistance);
  };

  return (
    <div className={`bg-[#282828] border border-[#404040] rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-[#1DB954]" />
          <div>
            <h3 className="text-sm font-semibold text-white">Distance Range</h3>
            <p className="text-xs text-[#B3B3B3]">Within {currentDistance} km</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-[#B3B3B3]" />
        ) : (
          <ChevronDown size={16} className="text-[#B3B3B3]" />
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B3B3B3]">
              <span>1 km</span>
              <span>{currentDistance} km</span>
              <span>100 km</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={currentDistance}
              onChange={handleSliderChange}
              className="w-full h-2 bg-[#404040] rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(currentDistance - 1) * 100 / 99}%, #404040 ${(currentDistance - 1) * 100 / 99}%, #404040 100%)`
              }}
            />
          </div>

          {/* Quick Select Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 25, 50].map((distance) => (
              <button
                key={distance}
                onClick={() => {
                  setCurrentDistance(distance);
                  onDistanceChange(distance);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentDistance === distance
                    ? "bg-[#1DB954] text-white"
                    : "bg-[#191414] text-[#B3B3B3] border border-[#404040] hover:border-[#1DB954]"
                }`}
              >
                {distance}km
              </button>
            ))}
          </div>

          {/* Increment/Decrement Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={decrementDistance}
              disabled={currentDistance <= 1}
              className="w-8 h-8 rounded-lg bg-[#191414] border border-[#404040] flex items-center justify-center text-[#B3B3B3] hover:border-[#1DB954] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown size={14} />
            </button>
            
            <div className="flex-1 text-center">
              <input
                type="number"
                min="1"
                max="100"
                value={currentDistance}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  const clampedValue = Math.min(Math.max(value, 1), 100);
                  setCurrentDistance(clampedValue);
                  onDistanceChange(clampedValue);
                }}
                className="w-20 px-3 py-2 bg-[#191414] border border-[#404040] rounded-lg text-white text-center focus:outline-none focus:border-[#1DB954]"
              />
              <span className="ml-2 text-sm text-[#B3B3B3]">kilometers</span>
            </div>
            
            <button
              onClick={incrementDistance}
              disabled={currentDistance >= 100}
              className="w-8 h-8 rounded-lg bg-[#191414] border border-[#404040] flex items-center justify-center text-[#B3B3B3] hover:border-[#1DB954] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronUp size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
