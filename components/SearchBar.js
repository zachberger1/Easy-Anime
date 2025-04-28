import { useState, useRef, useEffect } from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import { searchAnime } from '../lib/api';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ onAnimeSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    try {
      setLoading(true);
      const results = await searchAnime(searchQuery);
      setSuggestions(results.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Debounce search
    searchTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };
  
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current.focus();
  };
  
  const handleSuggestionClick = (animeId) => {
    if (onAnimeSelect) {
      onAnimeSelect(animeId);
    }
    setShowSuggestions(false);
  };
  
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex].mal_id);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
    }
  };
  
  return (
    <div className="search-container">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search for anime..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setSuggestions(s => s.length > 0 && setShowSuggestions(true))}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        
        <button 
          className={`search-clear-btn ${query ? 'visible' : ''}`}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <BsX size={20} />
        </button>
        
        <button
          className="search-btn"
          onClick={() => query && fetchSuggestions(query)}
          aria-label="Search"
        >
          <BsSearch size={18} />
        </button>
      </div>
      
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            className="search-suggestions visible"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((anime, index) => (
                <div
                  key={anime.mal_id}
                  className={`suggestion-item ${selectedIndex === index ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
                  onClick={() => handleSuggestionClick(anime.mal_id)}
                >
                  <div className="suggestion-img relative w-10 h-14">
                    <Image
                      src={anime.images?.jpg?.image_url || '/placeholder.jpg'}
                      alt={anime.title}
                      fill
                      className="object-cover rounded-md"
                      sizes="40px"
                    />
                  </div>
                  <div className="suggestion-info">
                    <div className="suggestion-title text-white ">{anime.title}</div>
                    <div className="suggestion-year">
                      {anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'Unknown year'}
                    </div>
                  </div>
                </div>
              ))
            ) : query ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                No results found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}