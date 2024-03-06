import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { queryService } from '../services/api';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@nero/auth';
import { footerSettingsReducer } from '../components/settings/FooterSettings/reducers/footer-settings-slice';
import { pageReducer } from '../components/page_managment/pageSlice';
import { blogReducer } from '../components/blog/blogSlice';

export const store = configureStore({
  reducer: {
    [queryService.reducerPath]: queryService.reducer,
    auth: authReducer,
    page: pageReducer,
    footerSettings: footerSettingsReducer,
    blog: blogReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`(https://redux-toolkit.js.org/tutorials/rtk-query)
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(queryService.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
