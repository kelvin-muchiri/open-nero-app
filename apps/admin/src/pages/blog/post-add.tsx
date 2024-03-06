import { Col, Row } from 'antd';
import { Helmet } from 'react-helmet-async';
import { PostAdd } from '../../components/blog/post/PostAdd';
import { NEW_POST } from '../../configs/lang';

const BlogPostAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{NEW_POST}</title>
      </Helmet>
      <Row>
        <Col md={24}>
          <PostAdd />
        </Col>
      </Row>
    </>
  );
};

export { BlogPostAddPage };
