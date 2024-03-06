import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { LevelAdd } from '../components/catalog/levels/LevelAdd';
import { ADD_LEVEL } from '../configs/lang';

const LevelAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_LEVEL}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <LevelAdd />
        </Col>
      </Row>
    </>
  );
};

export { LevelAddPage };
