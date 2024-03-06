import { Result } from 'antd';
import { useParams } from 'react-router-dom';
import { BlogPost } from '../../components/Blog/BlogPost';
import { PARAM_ID } from '../../configs/constants';
import { ERROR_GENERIC } from '../../configs/lang';

const BlogPostPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return (
      <div className="bg-white full-height">
        <div className="nero-wrapper-960">
          <Result status="error" title={ERROR_GENERIC} />
        </div>
      </div>
    );
  }

  return <BlogPost slug={id} />;
};

export { BlogPostPage as default };
