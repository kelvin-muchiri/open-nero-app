import { useRoutes } from 'react-router-dom';
import './App.css';
import { useAuth } from '@nero/auth';
import { ENDPOINT_PROFILE } from './configs/constants';
import { useAppSelector } from './store/hooks';
import { apiService } from './services/api';
import { routes } from './routes';

function App() {
  useAuth(apiService, ENDPOINT_PROFILE);
  const auth = useAppSelector((state) => state.auth);

  return useRoutes(routes(auth));
}

const AppWrapper = () => {
  return (
    <>
      <App />
    </>
  );
};

export default AppWrapper;
