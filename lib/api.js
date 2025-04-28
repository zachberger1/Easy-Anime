/**
 * API module for handling API requests to fetch anime data
 */

// Jikan API base URL (v4)
const API_BASE_URL = 'https://api.jikan.moe/v4';

// Cache for API responses to reduce requests
const cache = new Map();

/**
 * Make an API request with caching
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} Promise resolving to API response
 */
async function fetchAPI(endpoint, params = {}) {
  // Convert params to query string
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  // Check cache first
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url));
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
    
    // Store in cache (only keep cache for 5 minutes)
    cache.set(url, data);
    setTimeout(() => cache.delete(url), 5 * 60 * 1000);
    
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
 * @returns {Promise} Promise resolving to search results array
 */
export async function searchAnime(query, limit = 10) {
  if (!query) return [];
  
  const response = await fetchAPI('anime', {
    q: query,
    limit,
    sfw: true
  });
  
  return response.data || [];
}

/**
 * Get anime by ID
 * @param {number} id - Anime ID
 * @returns {Promise} Promise resolving to anime details
 */
export async function fetchAnimeById(id) {
  const response = await fetchAPI(`anime/${id}`);
  return response.data;
}

/**
 * Get trending anime
 * @param {number} limit - Maximum number of results
 * @returns {Promise} Promise resolving to trending anime array
 */
export async function fetchTrendingAnime(limit = 10) {
  const response = await fetchAPI('top/anime', {
    limit,
    filter: 'airing'
  });
  
  return response.data || [];
}

/**
 * Get anime characters
 * @param {number} animeId - Anime ID
 * @returns {Promise} Promise resolving to characters list
 */
export async function fetchAnimeCharacters(animeId) {
  const response = await fetchAPI(`anime/${animeId}/characters`);
  return response.data || [];
}

/**
 * Get anime recommendations
 * @param {number} animeId - Anime ID
 * @returns {Promise} Promise resolving to recommendations
 */
export async function fetchAnimeRecommendations(animeId) {
  const response = await fetchAPI(`anime/${animeId}/recommendations`);
  return response.data || [];
}