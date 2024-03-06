import { Col, Result, Row } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { CategoryEdit } from '../../components/blog/category/CategoryEdit';
import { PARAM_ID } from '../../configs/constants';
import { CATEGORY, EDIT, ERROR_GENERIC } from '../../configs/lang';

const BlogCategoryEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {EDIT} {CATEGORY}
        </title>
      </Helmet>
      <Row>
        <Col md={12}>
          <CategoryEdit id={id} />
        </Col>
      </Row>
    </>
  );
};

export { BlogCategoryEditPage };
