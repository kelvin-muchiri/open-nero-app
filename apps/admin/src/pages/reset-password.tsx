import { Row, Col, Card, Typography, Divider, Result, Button } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { PARAM_TOKEN, PARAM_UIDB64, URL_FORGOT_PASSWORD, URL_LOGIN } from '../configs/constants';
import {
  BUTTON_RESET_PASSWORD_TOKEN_INVALID,
  ERROR_RESET_PASSWORD_TOKEN_INVALID,
  RESET_PASSWORD,
  SIGN_IN,
  SUCCESS_GENERIC,
  SUCCESS_RESET_PASSWORD_END,
} from '../configs/lang';

const { Title } = Typography;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { uidb64 } = useParams<typeof PARAM_UIDB64>();
  const { token } = useParams<typeof PARAM_TOKEN>();
  const [success, setSuccess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  if (!uidb64 || !token) {
    navigate(URL_FORGOT_PASSWORD);
  }

  const resetPasswordEndProps = {
    uidb64: uidb64 as string,
    token: token as string,
    onSuccess: () => {
      setSuccess(true);
    },
    onInvalidCredentials: () => {
      setFailed(true);
    },
  };

  if (success) {
    return (
      <div className="site-card-border-less-wrapper">
        <Result
          status="success"
          title={SUCCESS_GENERIC}
          subTitle={SUCCESS_RESET_PASSWORD_END}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                navigate(URL_LOGIN);
              }}
            >
              {SIGN_IN}
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (failed) {
    return (
      <div className="site-card-border-less-wrapper">
        <Result
          status="error"
          title={ERROR_RESET_PASSWORD_TOKEN_INVALID}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                navigate(URL_FORGOT_PASSWORD);
              }}
            >
              {BUTTON_RESET_PASSWORD_TOKEN_INVALID}
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{RESET_PASSWORD}</title>
      </Helmet>
      <div className="site-card-border-less-wrapper">
        <Row>
          <Col md={{ span: 8, offset: 8 }} xs={24}>
            <Card bordered={false}>
              <Divider>
                <Title level={3}>{RESET_PASSWORD}</Title>
              </Divider>
              <ResetPasswordForm {...resetPasswordEndProps} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export { ResetPasswordPage };
