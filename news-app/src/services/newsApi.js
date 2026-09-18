import axios from 'axios';

const BASE_URL = 'https://newsdata.io/api/1/';

/**
 * Axios instance configured for NewsData.io
 */
const newsApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    'Accept': 'application/json',
  }
});
/** 


 * @param {Object} params
 * @param {string} [params.category] - Category filter (e.g. 'business', 'technology', 'sports')
 * @param {string} [params.q] - Keyword search query
 * @param {string} [params.page] - NewsData.io nextPage pagination token
 * @param {string} [params.language] - Language code (defaults to 'en')
 * @returns {Promise<{articles: Array, nextPage: string|null, totalResults: number}>}
 */
export async function fetchLatestNews({ category, q, page, language = 'en' } = {}) {
  const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    const error = new Error(
      'NewsData.io API Key is missing. Please set VITE_NEWSDATA_API_KEY in your .env file.'
    );
    error.code = 'ERR_MISSING_API_KEY';
    throw error;
  }

  const queryParams = {
    apikey: apiKey.trim(),
    language: language,
  };

  // Add category if specified (NewsData.io expects lowercase: top, business, technology, etc.)
  if (category && category !== 'all' && category !== 'top') {
    queryParams.category = category.toLowerCase();
  } else if (category === 'top') {
    queryParams.category = 'top';
  }

  // Add keyword search if provided
  if (q && q.trim()) {
    queryParams.q = q.trim();
  }

  // Add pagination token if available
  if (page) {
    queryParams.page = page;
  }

  try {
    const response = await newsApiClient.get('latest', { params: queryParams });

    // NewsData.io might return status: "error" in 200 responses
    if (response.data?.status === 'error') {
      const errorMsg = response.data.results?.message || response.data.message || 'Error received from NewsData.io';
      const error = new Error(errorMsg);
      error.code = response.data.results?.code || 'ERR_API_RESPONSE';
      throw error;
    }

    const results = response.data?.results || [];
    const nextPage = response.data?.nextPage || null;
    const totalResults = response.data?.totalResults || results.length;

    return {
      articles: results,
      nextPage,
      totalResults
    };
  } catch (err) {
    // Standardize error messaging for UI
    if (err.response) {
      const status = err.response.status;
      const apiMsg = err.response.data?.results?.message || err.response.data?.message;

      if (status === 429 || err.code === 'RateLimitExceeded') {
        const error = new Error(
          apiMsg || 'NewsData.io daily or 15-minute rate limit reached for this free tier key.'
        );
        error.code = 'ERR_RATE_LIMIT';
        throw error;
      }

      if (status === 401 || status === 403) {
        const error = new Error(
          apiMsg || 'Invalid or unauthorized NewsData.io API key. Check your VITE_NEWSDATA_API_KEY.'
        );
        error.code = 'ERR_UNAUTHORIZED';
        throw error;
      }

      if (status === 422) {
        const error = new Error(
          apiMsg || 'Invalid query parameters sent to NewsData.io.'
        );
        error.code = 'ERR_UNPROCESSABLE';
        throw error;
      }

      const genericError = new Error(apiMsg || `NewsData.io error (HTTP ${status})`);
      genericError.code = `ERR_HTTP_${status}`;
      throw genericError;
    }

    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      const error = new Error('The request timed out. Please check your internet connection.');
      error.code = 'ERR_TIMEOUT';
      throw error;
    }

    if (!window.navigator.onLine) {
      const error = new Error('You appear to be offline. Please verify your internet connection.');
      error.code = 'ERR_OFFLINE';
      throw error;
    }

    throw err;
  }
}

export default newsApiClient;
