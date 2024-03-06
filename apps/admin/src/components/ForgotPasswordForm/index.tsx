import { ForgotPasswordForm as NeroForgotPasswordForm } from '@nero/components';
import { ProfileType } from '@nero/query-api-service';
import { apiService } from '../../services/api';

const ForgotPasswordForm = () => {
  const neroForgotPasswordForm = {
    profileType: 'STAFF' as ProfileType,
    neroAPIService: apiService,
  };

  return <NeroForgotPasswordForm {...neroForgotPasswordForm} />;
};

export { ForgotPasswordForm };
