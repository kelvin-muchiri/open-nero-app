import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureDefaultStore } from './store/store';
import { ScrollToTop } from '@nero/utils';
import { HelmetProvider } from 'react-helmet-async';

/* eslint-disable */

// Create Redux store with state injected by the server
const store = configureDefaultStore(window.__PRELOADED_STATE__);
// Assets from server
const assets = window.__ASSET_MANIFEST;

// Allow for garbage collection
delete window.__PRELOADED_STATE__;
delete window.__ASSET_MANIFEST;

const development = process.env.NODE_ENV == 'development' && typeof window !== 'undefined';

const app = (
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <ScrollToTop />
          <App assets={assets} development={development} />
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

if (development) {
  // app was started with yarn start, no server side rendering available
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(app);
} else {
  // we are running server side rendering
  hydrateRoot(document, app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
