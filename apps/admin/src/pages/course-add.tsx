import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { CourseAdd } from '../components/catalog/courses/CourseAdd';
import { ADD_COURSE } from '../configs/lang';

const CourseAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_COURSE}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <CourseAdd />
        </Col>
      </Row>
    </>
  );
};

export { CourseAddPage };
