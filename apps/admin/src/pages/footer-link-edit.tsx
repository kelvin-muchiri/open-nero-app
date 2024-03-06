import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { FooterLinkEdit } from '../components/settings/FooterSettings/footer_link/FooterLinkEdit';
import { PARAM_ID } from '../configs/constants';
import { EDIT_FOOTER_LINK, ERROR_GENERIC } from '../configs/lang';

const FooterLinkEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>{EDIT_FOOTER_LINK}</title>
      </Helmet>
      <Row>
        <Col xs={24} sm={24} md={12}>
          <FooterLinkEdit id={id} />
        </Col>
      </Row>
    </>
  );
};

export { FooterLinkEditPage };
