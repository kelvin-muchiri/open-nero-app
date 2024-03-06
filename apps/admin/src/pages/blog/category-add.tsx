import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { CategoryAdd } from '../../components/blog/category/CategoryAdd';
import { ADD_CATEGORY } from '../../configs/lang';

const BlogCategoryAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_CATEGORY}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <CategoryAdd />
        </Col>
      </Row>
    </>
  );
};

export { BlogCategoryAddPage };
