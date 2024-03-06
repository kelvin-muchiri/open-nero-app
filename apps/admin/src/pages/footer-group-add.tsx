import { Col, Row } from 'antd';
import { Helmet } from 'react-helmet-async';
import { FooterGroupAdd } from '../components/settings/FooterSettings/footer_group/FooterGroupAdd';
import { ADD_FOOTER_GROUP } from '../configs/lang';

const FooterGroupAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_FOOTER_GROUP}</title>
      </Helmet>
      <Row>
        <Col xs={24} sm={24} md={12}>
          <FooterGroupAdd />
        </Col>
      </Row>
    </>
  );
};

export { FooterGroupAddPage };
