import { Row, Col, Card, Typography, Divider, Button } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { URL_LOGIN } from '../configs/constants';
import { BUTTON_BACK_TO_SIGN_IN, FORGOT_PASSWORD } from '../configs/lang';

const { Title } = Typography;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{FORGOT_PASSWORD}</title>
      </Helmet>
      <div className="site-card-border-less-wrapper">
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
                  navigate(URL_LOGIN);
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

export { ForgotPasswordPage };
