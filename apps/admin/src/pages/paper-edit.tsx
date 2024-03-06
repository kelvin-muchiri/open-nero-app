import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PaperEdit } from '../components/catalog/papers/PaperEdit';
import { PARAM_ID } from '../configs/constants';
import { EDIT, ERROR_GENERIC, PAPER } from '../configs/lang';

const PaperEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {EDIT} {PAPER}
        </title>
      </Helmet>
      <Row>
        <Col md={12}>
          <PaperEdit paperId={id} />
        </Col>
      </Row>
    </>
  );
};

export { PaperEditPage };
