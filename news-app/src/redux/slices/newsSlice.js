import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLatestNews } from '../../services/newsApi';
import { getArticleId } from '../../utils/articleId';

/**
 * Async thunk for initial or newly filtered news fetches
 */
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ category = 'top', q = '' } = {}, { rejectWithValue }) => {
    try {
      const data = await fetchLatestNews({ category, q });
      return {
        articles: data.articles,
        nextPage: data.nextPage,
        totalResults: data.totalResults,
        category,
        q
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch news articles.',
        code: error.code || 'ERR_UNKNOWN'
      });
    }
  }
);

/**
 * Async thunk for paginating further news using the nextPage token
 */
export const fetchMoreNews = createAsyncThunk(
  'news/fetchMoreNews',
  async (_, { getState, rejectWithValue }) => {
    const state = getState().news;
    if (!state.nextPage || state.moreStatus === 'loading') {
      return rejectWithValue({ message: 'No more pages available.' });
    }

    try {
      const data = await fetchLatestNews({
        category: state.activeCategory,
        q: state.searchQuery,
        page: state.nextPage,
      });

      return {
        articles: data.articles,
        nextPage: data.nextPage,
        totalResults: data.totalResults,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to load more news.',
        code: error.code || 'ERR_UNKNOWN'
      });
    }
  }
);

const initialState = {
  articles: [],
  nextPage: null,
  totalResults: 0,
  activeCategory: 'top',
  searchQuery: '',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  moreStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  errorCode: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.errorCode = null;
    },
    resetNews: (state) => {
      state.articles = [];
      state.nextPage = null;
      state.status = 'idle';
      state.error = null;
      state.errorCode = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initial Fetch
      .addCase(fetchNews.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.errorCode = null;
        if (action.meta.arg) {
          if (action.meta.arg.category !== undefined) {
            state.activeCategory = action.meta.arg.category;
          }
          if (action.meta.arg.q !== undefined) {
            state.searchQuery = action.meta.arg.q;
          }
        }
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.articles;
        state.nextPage = action.payload.nextPage;
        state.totalResults = action.payload.totalResults;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message || 'An unexpected error occurred.';
        state.errorCode = action.payload?.code || 'ERR_GENERAL';
      })

      // Pagination Fetch
      .addCase(fetchMoreNews.pending, (state) => {
        state.moreStatus = 'loading';
      })
      .addCase(fetchMoreNews.fulfilled, (state, action) => {
        state.moreStatus = 'succeeded';
        state.nextPage = action.payload.nextPage;
        state.totalResults = action.payload.totalResults;

        // Deduplicate incoming articles by ID/link
        const existingIds = new Set(
          state.articles.map((item) => getArticleId(item))
        );

        const newUniqueArticles = action.payload.articles.filter((item) => {
          const id = getArticleId(item);
          if (existingIds.has(id)) return false;
          existingIds.add(id);
          return true;
        });

        state.articles = [...state.articles, ...newUniqueArticles];
      })
      .addCase(fetchMoreNews.rejected, (state, action) => {
        state.moreStatus = 'failed';
        state.error = action.payload?.message || action.error.message;
        state.errorCode = action.payload?.code || 'ERR_PAGINATION';
      });
  }
});

export const { setActiveCategory, setSearchQuery, clearError, resetNews } = newsSlice.actions;

// Selectors
export const selectAllArticles = (state) => state.news.articles;
export const selectNewsStatus = (state) => state.news.status;
export const selectNewsMoreStatus = (state) => state.news.moreStatus;
export const selectNewsError = (state) => state.news.error;
export const selectNewsErrorCode = (state) => state.news.errorCode;
export const selectNextPage = (state) => state.news.nextPage;
export const selectActiveCategory = (state) => state.news.activeCategory;
export const selectSearchQuery = (state) => state.news.searchQuery;
export const selectTotalResults = (state) => state.news.totalResults;

export default newsSlice.reducer;
