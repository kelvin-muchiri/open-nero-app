import { Row, Col, Card, Typography, Divider, Button } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { BUTTON_BACK_TO_SIGN_IN, FORGOT_PASSWORD } from '../configs/lang';
import { useGetURLSignIn } from '../helpers/hooks';

const { Title } = Typography;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const urlSignIn = useGetURLSignIn();

  return (
    <>
      <Helmet>
        <title>{FORGOT_PASSWORD}</title>
      </Helmet>
      <div className="nero-content-bg full-height ptb-30 pl-30 pr-30">
        <Row>
          <Col md={{ span: 8, offset: 8 }} xs={24}>
            <Card bordered={false}>
              <Divider>
                <Title level={3}>{FORGOT_PASSWORD}</Title>
              </Divider>
              <ForgotPasswordForm />
              <Button
                type="link"
                onClick={() => {
                  navigate(urlSignIn);
                }}
              >
                {BUTTON_BACK_TO_SIGN_IN}
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export { ForgotPasswordPage as default };
