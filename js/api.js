/**
 * API module for handling API requests to fetch anime data
 */

const API = (function() {
  // Base URL for Jikan API v4
  const API_BASE_URL = 'https://api.jikan.moe/v4';
  
  // Cache to store API responses and reduce requests
  const cache = {};
  
  /**
   * Make an API request with caching
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} Promise resolving to API response
   */
  async function fetchAPI(endpoint, params = {}) {
    // Convert params to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    // Check cache first
    if (cache[url]) {
      return Promise.resolve(cache[url]);
    }
    
    try {
      // Add a small delay to avoid rate limiting issues
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await fetch(url);
      
      // Check if rate limited (429)
      if (response.status === 429) {
        // Wait 1 second and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchAPI(endpoint, params);
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store in cache
      cache[url] = data;
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  
  /**
   * Search for anime by keyword
   * @param {string} query - Search keyword
   * @param {number} limit - Maximum number of results
   * @returns {Promise} Promise resolving to search results
   */
  async function searchAnime(query, limit = 10) {
    if (!query) return { data: [] };
    
    return fetchAPI('anime', {
      q: query,
      limit,
      sfw: true
    });
  }
  
  /**
   * Get anime by ID
   * @param {number} id - Anime ID
   * @returns {Promise} Promise resolving to anime details
   */
  async function getAnimeById(id) {
    return fetchAPI(`anime/${id}`);
  }
  
  /**
   * Get trending anime
   * @param {number} limit - Maximum number of results
   * @returns {Promise} Promise resolving to trending anime
   */
  async function getTrendingAnime(limit = 10) {
    return fetchAPI('top/anime', {
      limit,
      filter: 'airing'
    });
  }
  
  /**
   * Get anime characters
   * @param {number} animeId - Anime ID
   * @returns {Promise} Promise resolving to characters list
   */
  async function getAnimeCharacters(animeId) {
    return fetchAPI(`anime/${animeId}/characters`);
  }
  
  /**
   * Get anime recommendations
   * @param {number} animeId - Anime ID
   * @returns {Promise} Promise resolving to recommendations
   */
  async function getAnimeRecommendations(animeId) {
    return fetchAPI(`anime/${animeId}/recommendations`);
  }
  
  // Public API
  return {
    searchAnime,
    getAnimeById,
    getTrendingAnime,
    getAnimeCharacters,
    getAnimeRecommendations
  };
})();