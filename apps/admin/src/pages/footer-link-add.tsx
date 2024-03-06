import { Col, Row } from 'antd';
import { Helmet } from 'react-helmet-async';
import { FooterLinkAdd } from '../components/settings/FooterSettings/footer_link/FooterLinkAdd';
import { ADD_FOOTER_LINK } from '../configs/lang';

const FooterLinkAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_FOOTER_LINK}</title>
      </Helmet>
      <Row>
        <Col xs={24} sm={24} md={12}>
          <FooterLinkAdd />
        </Col>
      </Row>
    </>
  );
};

export { FooterLinkAddPage };
