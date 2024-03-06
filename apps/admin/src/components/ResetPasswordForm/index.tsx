import { ResetPasswordForm as NeroResetPasswordForm } from '@nero/components';
import { apiService } from '../../services/api';

export interface ResetPasswordFormProps {
  uidb64: string;
  token: string;
  onSuccess: () => void;
  onInvalidCredentials: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = (props: ResetPasswordFormProps) => {
  const neroResetPasswordProps = {
    ...props,
    neroAPIService: apiService,
  };

  return <NeroResetPasswordForm {...neroResetPasswordProps} />;
};

export { ResetPasswordForm };
