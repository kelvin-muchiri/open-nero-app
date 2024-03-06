import { logout } from '@nero/auth';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { useGetURLSignIn } from '../helpers/hooks';

const RefreshTokenFailed = () => {
  const dispatch = useAppDispatch();
  const urlSignIn = useGetURLSignIn();

  useEffect(() => {
    dispatch(logout());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Navigate to={urlSignIn} />;
};

export { RefreshTokenFailed as default };
