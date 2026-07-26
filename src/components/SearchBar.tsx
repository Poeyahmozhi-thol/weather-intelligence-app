import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';
import { GeocodingResult } from '../types';
import { searchCities } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (cityName: string) => void;
  onSelectCoords?: (lat: number, lon: number, cityName: string, country?: string, admin1?: string) => void;
  isLoading: boolean;
}

const POPULAR_CITIES = ['Chennai', 'Tokyo', 'London', 'New York', 'Paris', 'Dubai'];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onSelectCoords,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(trimmed, 5);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);
    onSelectCity(query.trim());
  };

  const handleSelectSuggestion = (item: GeocodingResult) => {
    setQuery(`${item.name}${item.country ? `, ${item.country}` : ''}`);
    setShowSuggestions(false);
    if (onSelectCoords) {
      onSelectCoords(item.latitude, item.longitude, item.name, item.country, item.admin1);
    } else {
      onSelectCity(item.name);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          if (onSelectCoords) {
            onSelectCoords(latitude, longitude, 'My Location');
          } else {
            onSelectCity(`${latitude},${longitude}`);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setGeolocating(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setGeolocating(false);
        alert('Could not get precise location. Please search by city name.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0 || query.length >= 2) setShowSuggestions(true);
          }}
          placeholder="Search city (e.g., Chennai, London)..."
          className="w-full pl-9 pr-20 py-2 bg-orange-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-full text-xs sm:text-sm font-medium border border-orange-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-teal-500/80 placeholder:text-slate-400 transition-all"
          id="city-search-input"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              title="Clear"
              id="clear-search-btn"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleUseLocation}
            disabled={geolocating || isLoading}
            title="Use current location"
            className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-full transition-colors"
            id="geo-location-btn"
          >
            {geolocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown & Quick Cities */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {isSearching && (
            <div className="p-3 text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" />
              Searching locations...
            </div>
          )}

          {!isSearching && suggestions.length > 0 && (
            <div>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-orange-50/60 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {item.name}
                    </span>
                    {item.country && (
                      <span className="text-slate-400 dark:text-slate-500 font-normal">
                        ({item.country})
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick city presets in dropdown footer */}
          <div className="p-2.5 bg-orange-50/40 dark:bg-slate-800/50 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Popular:
            </span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setQuery(c);
                  setShowSuggestions(false);
                  onSelectCity(c);
                }}
                className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-[11px] font-medium hover:border-teal-500 hover:text-teal-600 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

