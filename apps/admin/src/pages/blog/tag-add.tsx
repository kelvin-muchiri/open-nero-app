import { Col, Row } from 'antd';
import { Helmet } from 'react-helmet-async';
import { TagAdd } from '../../components/blog/tag/TagAdd';
import { ADD_TAG } from '../../configs/lang';

const BlogTagAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_TAG}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <TagAdd />
        </Col>
      </Row>
    </>
  );
};

export { BlogTagAddPage };
