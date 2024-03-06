import { Row, Col, Typography, Divider, Card } from 'antd';
import { SIGN_IN } from '../configs/lang';
import { Navigate } from 'react-router-dom';
import { URL_PAGES } from '../configs/constants';
import { Helmet } from 'react-helmet-async';
import { useAppSelector } from '../store/hooks';
import { LoginForm } from '../components/LoginForm';

const { Title } = Typography;

const AdminLoginPage = () => {
  const auth = useAppSelector((state) => state.auth);

  if (!auth.isLoading && auth.isAuthenticated && auth.user?.profile_type == 'STAFF') {
    // if a staff is already logged in, take them to dashboard
    return <Navigate to={URL_PAGES} />;
  }

  return (
    <>
      <Helmet>
        <title>{SIGN_IN}</title>
      </Helmet>
      <div className="site-card-border-less-wrapper">
        <Row>
          <Col md={{ span: 8, offset: 8 }} xs={24}>
            <Card bordered={false}>
              <Divider>
                <Title level={3}>{SIGN_IN}</Title>
              </Divider>
              <LoginForm />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export { AdminLoginPage };
