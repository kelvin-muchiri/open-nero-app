import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { CourseEdit } from '../components/catalog/courses/CourseEdit';
import { PARAM_ID } from '../configs/constants';
import { COURSE, EDIT, ERROR_GENERIC } from '../configs/lang';

const CourseEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {EDIT} {COURSE}
        </title>
      </Helmet>
      <Row>
        <Col md={12}>
          <CourseEdit courseId={id} />
        </Col>
      </Row>
    </>
  );
};

export { CourseEditPage };
