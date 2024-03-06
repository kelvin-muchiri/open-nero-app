import { Col, Result, Row } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { TagEdit } from '../../components/blog/tag/TagEdit';
import { PARAM_ID } from '../../configs/constants';
import { CATEGORY, EDIT, ERROR_GENERIC } from '../../configs/lang';

const BlogTagEditPage = () => {
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
          <TagEdit id={id} />
        </Col>
      </Row>
    </>
  );
};

export { BlogTagEditPage };
