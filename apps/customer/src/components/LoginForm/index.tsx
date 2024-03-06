import { authenticate, authenticationFailed } from '@nero/auth';
import { LoginForm as NeroLoginForm, LoginFormProps as NeroLoginProps } from '@nero/components';
import { ProfileType } from '@nero/query-api-service';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL_FORGOT_PASSWORD, URL_ORDER_HISTORY } from '../../configs/constants';
import { apiService } from '../../services/api';
import { useAppDispatch } from '../../store/hooks';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // handle forgot password
  const onForgotPassword = useCallback(() => {
    navigate(URL_FORGOT_PASSWORD);
  }, [navigate]);
  // handle login success
  const onLoginSuccess: NeroLoginProps['onLoginSuccess'] = useCallback(
    (user, rememberMe) => {
      dispatch(authenticate({ user, rememberMe }));
      navigate(URL_ORDER_HISTORY);
    },
    [navigate, dispatch]
  );
  // handle login failed
  const onLoginFailed = useCallback(() => {
    dispatch(authenticationFailed());
  }, [dispatch]);

  const neroLoginFormProps: NeroLoginProps = {
    neroApiService: apiService,
    profileType: 'CUSTOMER' as ProfileType,
    onLoginSuccess,
    onForgotPassword,
    onLoginFailed,
  };
  return <NeroLoginForm {...neroLoginFormProps} />;
};

export { LoginForm };
