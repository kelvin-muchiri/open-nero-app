import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { FooterGroupEdit } from '../components/settings/FooterSettings/footer_group/FooterGroupEdit';
import { PARAM_ID } from '../configs/constants';
import { EDIT_FOOTER_GROUP, ERROR_GENERIC } from '../configs/lang';

const FooterGroupEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>{EDIT_FOOTER_GROUP}</title>
      </Helmet>
      <Row>
        <Col xs={24} sm={24} md={12}>
          <FooterGroupEdit id={id} />
        </Col>
      </Row>
    </>
  );
};

export { FooterGroupEditPage };
