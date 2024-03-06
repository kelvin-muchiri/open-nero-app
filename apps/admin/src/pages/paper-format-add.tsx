import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { PaperFormatAdd } from '../components/catalog/paper_formats/PaperFormatAdd';
import { ADD_PAPER_FORMAT } from '../configs/lang';

const PaperFormatAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_PAPER_FORMAT}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <PaperFormatAdd />
        </Col>
      </Row>
    </>
  );
};

export { PaperFormatAddPage };
