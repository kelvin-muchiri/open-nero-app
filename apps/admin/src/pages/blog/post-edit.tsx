import { Result } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PostEdit } from '../../components/blog/post/PostEdit';
import { PARAM_ID } from '../../configs/constants';
import { BLOG, EDIT, ERROR_GENERIC } from '../../configs/lang';

const BlogPostEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    // TODO: Show 404 page instead of error page
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {EDIT} {BLOG}
        </title>
      </Helmet>
      <PostEdit id={id} />
    </>
  );
};

export { BlogPostEditPage };
