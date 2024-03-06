import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { LevelEdit } from '../components/catalog/levels/LevelEdit';
import { PARAM_ID } from '../configs/constants';
import { ACADEMIC_LEVEL, ERROR_GENERIC, EDIT } from '../configs/lang';

const LevelEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {EDIT} {ACADEMIC_LEVEL}
        </title>
      </Helmet>
      <Row>
        <Col md={12}>
          <LevelEdit levelId={id} />
        </Col>
      </Row>
    </>
  );
};

export { LevelEditPage };
