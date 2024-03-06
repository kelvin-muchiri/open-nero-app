import { logout } from '@nero/auth';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { URL_LOGIN } from '../configs/constants';
import { useAppDispatch } from '../store/hooks';

const RefreshTokenFailed = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return <Navigate to={URL_LOGIN} />;
};

export { RefreshTokenFailed };
