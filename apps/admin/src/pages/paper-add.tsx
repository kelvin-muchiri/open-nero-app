import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { PaperAdd } from '../components/catalog/papers/PaperAdd';
import { ADD_PAPER } from '../configs/lang';

const PaperAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_PAPER}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <PaperAdd />
        </Col>
      </Row>
    </>
  );
};

export { PaperAddPage };
