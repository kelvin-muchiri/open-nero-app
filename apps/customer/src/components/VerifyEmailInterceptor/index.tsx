import { Button, notification, Result, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_PROFILE,
  ENDPOINT_RESEND_EMAIL_VERIFICATION,
  URL_CHANGE_UNVERIFIED_EMAIL,
} from '../../configs/constants';
import {
  CHANGE_EMAIL_ADDRESS,
  EMAIL_VERIFICATION_SENT,
  ERROR_GENERIC,
  RESEND_LINK,
  TRY_AGAIN_LATER,
  VERIFY_EMAIL,
  VERIFY_EMAIL_INTERCEPTOR_DESCRIPTION,
} from '../../configs/lang';
import { apiService, useGetProfileQuery } from '../../services/api';

const { Text } = Typography;

const VerifyEmailInterceptor = () => {
  const { data: profile } = useGetProfileQuery(ENDPOINT_PROFILE);
  const navigate = useNavigate();

  return (
    <Result
      title={VERIFY_EMAIL}
      subTitle={
        <Text>
          {VERIFY_EMAIL_INTERCEPTOR_DESCRIPTION} <Text strong>{profile?.email}</Text>
        </Text>
      }
      extra={
        <Space direction="vertical">
          <Button
            type="primary"
            onClick={() => {
              apiService
                .getAxiosInstance()
                .get(ENDPOINT_RESEND_EMAIL_VERIFICATION)
                .then(() => {
                  notification.success({ message: EMAIL_VERIFICATION_SENT, duration: 0 });
                })
                .catch(() => {
                  notification.error({ message: ERROR_GENERIC, description: TRY_AGAIN_LATER });
                });
            }}
          >
            {RESEND_LINK}
          </Button>
          <Button
            type="link"
            onClick={() => {
              navigate(URL_CHANGE_UNVERIFIED_EMAIL);
            }}
          >
            {CHANGE_EMAIL_ADDRESS}
          </Button>
        </Space>
      }
    />
  );
};

export { VerifyEmailInterceptor };
