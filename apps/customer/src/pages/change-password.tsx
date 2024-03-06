import { ChangePasswordForm } from '@nero/components';
import { Row, Col, Typography, Divider } from 'antd';
import { Helmet } from 'react-helmet-async';
import { CHANGE_PASSWORD } from '../configs/lang';
import { apiService } from '../services/api';

const { Title } = Typography;

const ChangePasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>{CHANGE_PASSWORD}</title>
      </Helmet>
      <Title level={4}>{CHANGE_PASSWORD}</Title>
      <Divider />
      <Row>
        <Col md={12} xs={24}>
          <ChangePasswordForm neroAPIService={apiService} />
        </Col>
      </Row>
    </>
  );
};

export { ChangePasswordPage as default };
