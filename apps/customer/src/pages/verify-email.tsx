import { Alert, Button, notification, Result, Spin } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ENDPOINT_RESEND_EMAIL_VERIFICATION,
  PARAM_TOKEN,
  PARAM_UIDB64,
} from '../configs/constants';
import {
  BUTTON_EMAIL_VERIFY_LINK_INVALID,
  EMAIL_VERIFICATION_SENT,
  ERROR_EMAIL_VERIFY_LINK_INVALID,
  ERROR_GENERIC,
  HOME,
  SUCCESS_EMAIL_VERIFIED,
  SUCCESS_GENERIC,
  TRY_AGAIN_LATER,
  VERIFY_EMAIL,
} from '../configs/lang';
import { useVerifyEmail } from '../helpers/hooks';
import { apiService } from '../services/api';

const VerifyEmailPage = () => {
  const { uidb64 } = useParams<typeof PARAM_UIDB64>();
  const { token } = useParams<typeof PARAM_TOKEN>();
  const [isVerificationLoading, isVerificationSuccess, isLinkInvalid, isVerificationError] =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    useVerifyEmail(uidb64 as string, token as string);
  const [linkResent, setLinkResent] = useState<boolean>(false);
  const [linkResendLoading, setLinkResendLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{VERIFY_EMAIL}</title>
      </Helmet>
      <div className="nero-content-bg full-height ptb-30 pl-30 pr-30">
        {(isVerificationLoading || linkResendLoading) && (
          <div className="loader-wrapper">
            <Spin />
          </div>
        )}
        {isVerificationError && (
          <Result status="error" title={ERROR_GENERIC} subTitle={TRY_AGAIN_LATER} />
        )}
        {linkResent && (
          <Alert message={SUCCESS_GENERIC} type="success" description={EMAIL_VERIFICATION_SENT} />
        )}
        {isLinkInvalid && !linkResent && !linkResendLoading && (
          <Result
            status="error"
            title={ERROR_EMAIL_VERIFY_LINK_INVALID}
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  setLinkResendLoading(true);

                  apiService
                    .getAxiosInstance()
                    .get(ENDPOINT_RESEND_EMAIL_VERIFICATION)
                    .then(() => {
                      setLinkResent(true);
                    })
                    .catch(() => {
                      notification.error({ message: ERROR_GENERIC, description: TRY_AGAIN_LATER });
                    })
                    .finally(() => {
                      setLinkResendLoading(false);
                    });
                }}
              >
                {BUTTON_EMAIL_VERIFY_LINK_INVALID}
              </Button>,
            ]}
          />
        )}
        {isVerificationSuccess && (
          <Result
            status="success"
            title={SUCCESS_GENERIC}
            subTitle={SUCCESS_EMAIL_VERIFIED}
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  navigate('/');
                }}
              >
                {HOME}
              </Button>,
            ]}
          />
        )}
      </div>
    </>
  );
};

export { VerifyEmailPage as default };
