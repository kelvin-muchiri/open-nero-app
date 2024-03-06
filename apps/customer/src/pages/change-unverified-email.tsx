import { Row, Col, Typography, Divider, Card } from 'antd';
import { Helmet } from 'react-helmet-async';
import { ChangeEmail } from '../components/Profile/ChangeEmail';
import { CHANGE_EMAIL } from '../configs/lang';

const { Title } = Typography;

const ChangeUnverifiedEmailPage = () => {
  return (
    <>
      <Helmet>
        <title>{CHANGE_EMAIL}</title>
      </Helmet>
      <div className="nero-content-bg full-height ptb-30 pl-30 pr-30">
        <Row>
          <Col md={{ span: 8, offset: 8 }} xs={24}>
            <Card bordered={false}>
              <Divider>
                <Title level={3}>{CHANGE_EMAIL}</Title>
              </Divider>
              <ChangeEmail />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export { ChangeUnverifiedEmailPage as default };
