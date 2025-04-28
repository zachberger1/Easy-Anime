/**
 * Search module for handling search-related functionality
 */

const Search = (function() {
  // DOM Elements
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const suggestionsContainer = document.getElementById('search-suggestions');
  
  // Variables
  let searchTimeout;
  const DEBOUNCE_DELAY = 300; // ms
  let currentSuggestions = [];
  let selectedSuggestionIndex = -1;
  
  /**
   * Initialize search functionality
   */
  function init() {
    // Event listeners
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleSearchFocus);
    searchInput.addEventListener('keydown', handleSearchKeyDown);
    searchBtn.addEventListener('click', handleSearchSubmit);
    searchClearBtn.addEventListener('click', clearSearch);
    
    // Close suggestions on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        hideSuggestions();
      }
    });
  }
  
  /**
   * Handle input in search field
   */
  function handleSearchInput() {
    const query = searchInput.value.trim();
    
    // Show/hide clear button
    if (query) {
      searchClearBtn.classList.add('visible');
    } else {
      searchClearBtn.classList.remove('visible');
      hideSuggestions();
    }
    
    // Debounce search
    clearTimeout(searchTimeout);
    if (query) {
      searchTimeout = setTimeout(() => {
        fetchSuggestions(query);
      }, DEBOUNCE_DELAY);
    }
  }
  
  /**
   * Handle search field focus
   */
  function handleSearchFocus() {
    const query = searchInput.value.trim();
    if (query && currentSuggestions.length) {
      showSuggestions();
    }
  }
  
  /**
   * Handle keyboard navigation in search suggestions
   * @param {KeyboardEvent} e - Keyboard event
   */
  function handleSearchKeyDown(e) {
    // Only process if suggestions are visible
    if (!suggestionsContainer.classList.contains('visible')) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedSuggestionIndex = Math.min(
          selectedSuggestionIndex + 1, 
          currentSuggestions.length - 1
        );
        highlightSelectedSuggestion();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
        highlightSelectedSuggestion();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(currentSuggestions[selectedSuggestionIndex]);
        } else {
          handleSearchSubmit();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        hideSuggestions();
        break;
    }
  }
  
  /**
   * Fetch and display search suggestions
   * @param {string} query - Search query
   */
  async function fetchSuggestions(query) {
    try {
      const response = await API.searchAnime(query, 8);
      
      // Save current suggestions
      currentSuggestions = response.data || [];
      
      // Reset selected suggestion
      selectedSuggestionIndex = -1;
      
      // Display suggestions
      if (currentSuggestions.length > 0) {
        renderSuggestions(currentSuggestions);
        showSuggestions();
      } else {
        hideSuggestions();
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      hideSuggestions();
    }
  }
  
  /**
   * Render suggestions in the suggestions container
   * @param {Array} suggestions - Array of suggestion objects
   */
  function renderSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach((anime, index) => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.setAttribute('data-index', index);
      
      const imgSrc = anime.images?.jpg?.image_url || 'assets/placeholder.jpg';
      const year = anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'Unknown';
      
      item.innerHTML = `
        <img class="suggestion-img" src="${imgSrc}" alt="${anime.title}" loading="lazy">
        <div class="suggestion-info">
          <div class="suggestion-title">${anime.title}</div>
          <div class="suggestion-year">${year}</div>
        </div>
      `;
      
      // Click event for the suggestion
      item.addEventListener('click', () => {
        selectSuggestion(anime);
      });
      
      // Mouse events for highlighting
      item.addEventListener('mouseenter', () => {
        selectedSuggestionIndex = index;
        highlightSelectedSuggestion();
      });
      
      suggestionsContainer.appendChild(item);
    });
  }
  
  /**
   * Show the suggestions container
   */
  function showSuggestions() {
    suggestionsContainer.classList.add('visible');
  }
  
  /**
   * Hide the suggestions container
   */
  function hideSuggestions() {
    suggestionsContainer.classList.remove('visible');
  }
  
  /**
   * Highlight the currently selected suggestion
   */
  function highlightSelectedSuggestion() {
    // Remove highlight from all suggestions
    const items = suggestionsContainer.querySelectorAll('.suggestion-item');
    items.forEach(item => {
      item.style.backgroundColor = '';
    });
    
    // Highlight selected suggestion
    if (selectedSuggestionIndex >= 0) {
      const selectedItem = suggestionsContainer.querySelector(
        `.suggestion-item[data-index="${selectedSuggestionIndex}"]`
      );
      if (selectedItem) {
        selectedItem.style.backgroundColor = 'var(--color-bg-offset)';
        // Ensure the selected item is visible
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }
  
  /**
   * Select a suggestion and show anime details
   * @param {Object} anime - Selected anime object
   */
  function selectSuggestion(anime) {
    searchInput.value = anime.title;
    hideSuggestions();
    searchClearBtn.classList.add('visible');
    
    // Show anime details
    Anime.showAnimeDetails(anime.mal_id);
    
    // Add to recently viewed
    Anime.addToRecentlyViewed(anime);
  }
  
  /**
   * Handle search submission
   */
  function handleSearchSubmit() {
    const query = searchInput.value.trim();
    if (query) {
      // Hide suggestions
      hideSuggestions();
      
      // TODO: Implement full search results page
      // For now, just search and show the first result
      API.searchAnime(query, 1).then(response => {
        if (response.data && response.data.length > 0) {
          Anime.showAnimeDetails(response.data[0].mal_id);
        } else {
          UI.showToast('No results found');
        }
      });
    }
  }
  
  /**
   * Clear the search input
   */
  function clearSearch() {
    searchInput.value = '';
    searchClearBtn.classList.remove('visible');
    hideSuggestions();
    searchInput.focus();
  }
  
  // Public API
  return {
    init
  };
})();