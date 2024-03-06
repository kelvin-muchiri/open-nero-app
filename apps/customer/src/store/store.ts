import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { configReducer } from '../configs/configSlice';
import { dynamicPagesReducer } from '../pages/reducer/pages';
import { queryService } from '../services/api';
import { configureStore, ConfigureStoreOptions, EnhancedStore } from '@reduxjs/toolkit';
import { authReducer } from '@nero/auth';
import { blogReducer } from '../components/Blog/reducer/blogSlice';

export const configureDefaultStore = (
  preloadedState?: ConfigureStoreOptions['preloadedState']
): EnhancedStore =>
  configureStore({
    reducer: {
      [queryService.reducerPath]: queryService.reducer,
      auth: authReducer,
      config: configReducer,
      dynamicPages: dynamicPagesReducer,
      blog: blogReducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`(https://redux-toolkit.js.org/tutorials/rtk-query)
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(queryService.middleware),
    preloadedState,
  });

export const store = configureStore({
  reducer: {
    [queryService.reducerPath]: queryService.reducer,
    auth: authReducer,
    config: configReducer,
    dynamicPages: dynamicPagesReducer,
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
