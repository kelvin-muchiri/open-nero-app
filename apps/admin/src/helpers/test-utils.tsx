import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  HelmetProvider.canUseDOM = false;

  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
};
