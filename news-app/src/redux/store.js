import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './slices/newsSlice';
import bookmarksReducer from './slices/bookmarksSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    bookmarks: bookmarksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
