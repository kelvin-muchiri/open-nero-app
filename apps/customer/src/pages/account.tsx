import { Row, Col, Typography, Divider } from 'antd';
import { Helmet } from 'react-helmet-async';
import { Profile } from '../components/Profile';
import { PROFILE } from '../configs/lang';

const { Title } = Typography;

const AccountPage = () => {
  return (
    <>
      <Helmet>
        <title>{PROFILE}</title>
      </Helmet>
      <Title level={4}>{PROFILE}</Title>
      <Divider />
      <Row>
        <Col md={12} xs={24}>
          <Profile />
        </Col>
      </Row>
    </>
  );
};

export { AccountPage as default };
