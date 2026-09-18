import { createSlice } from '@reduxjs/toolkit';
import { getArticleId } from '../../utils/articleId';

const STORAGE_KEY = 'chronicle_bookmarks_v1';

const loadBookmarksFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn('Failed to load bookmarks from localStorage', err);
    return [];
  }
};

const saveBookmarksToStorage = (bookmarks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (err) {
    console.warn('Failed to save bookmarks to localStorage', err);
  }
};

const initialState = {
  items: loadBookmarksFromStorage(),
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (state, action) => {
      const article = action.payload;
      const targetId = getArticleId(article);

      const existingIndex = state.items.findIndex(
        (item) => getArticleId(item) === targetId
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        // Store article with saved timestamp
        state.items.unshift({
          ...article,
          savedAt: new Date().toISOString()
        });
      }

      saveBookmarksToStorage(state.items);
    },
    removeBookmarkById: (state, action) => {
      const targetId = action.payload;
      state.items = state.items.filter((item) => getArticleId(item) !== targetId);
      saveBookmarksToStorage(state.items);
    },
    clearAllBookmarks: (state) => {
      state.items = [];
      saveBookmarksToStorage([]);
    }
  }
});

export const { toggleBookmark, removeBookmarkById, clearAllBookmarks } = bookmarksSlice.actions;

// Selectors
export const selectAllBookmarks = (state) => state.bookmarks.items;
export const selectBookmarksCount = (state) => state.bookmarks.items.length;
export const selectIsArticleBookmarked = (state, article) => {
  if (!article) return false;
  const targetId = getArticleId(article);
  return state.bookmarks.items.some((item) => getArticleId(item) === targetId);
};

export default bookmarksSlice.reducer;
