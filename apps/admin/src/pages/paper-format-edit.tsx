import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PaperFormatEdit } from '../components/catalog/paper_formats/PaperFormatEdit';
import { PARAM_ID } from '../configs/constants';
import { EDIT_PAPER_FORMAT, ERROR_GENERIC } from '../configs/lang';

const PaperFormatEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>{EDIT_PAPER_FORMAT}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <PaperFormatEdit paperFormatId={id} />
        </Col>
      </Row>
    </>
  );
};

export { PaperFormatEditPage };
