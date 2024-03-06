import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { DeadlineAdd } from '../components/catalog/deadlines/DeadlineAdd';
import { ADD_DEADLINE } from '../configs/lang';

const DeadlineAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_DEADLINE}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <DeadlineAdd />
        </Col>
      </Row>
    </>
  );
};

export { DeadlineAddPage };
