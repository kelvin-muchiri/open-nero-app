import { useEffect } from 'react';
import { User } from '@nero/query-api-service';
import {
  authenticate,
  authenticationFailed,
  STORAGE_REMEMBER,
  STORAGE_USER_LOGGED_IN,
} from './authSlice';
import { NeroAPIService } from '@nero/api-service';
import { useDispatch } from 'react-redux';

/**
 * Authenticate by getting a users profile data if they
 * had logged in before
 *
 * @param profileUrl API user profile endpoint
 */
export const useAuth = (apiService: NeroAPIService, profileUrl: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let rememberMe = false;
    let isUserLoggedIn = false;

    if (localStorage.getItem(STORAGE_REMEMBER)) {
      rememberMe = true;
    }

    if (sessionStorage.getItem(STORAGE_USER_LOGGED_IN)) {
      isUserLoggedIn = true;
    }

    // we only validate auth if user had opted in to be remembered
    // or if the current login session is active
    if (rememberMe || isUserLoggedIn) {
      apiService
        .getAxiosInstance()
        .get<User>(profileUrl)
        .then((res) => {
          dispatch(authenticate({ user: res.data }));
        })
        .catch(() => {
          dispatch(authenticationFailed());
        });
    } else {
      dispatch(authenticationFailed());
    }
  }, [dispatch, profileUrl, apiService]);
};
