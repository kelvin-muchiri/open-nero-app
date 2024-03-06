import { Helmet } from 'react-helmet-async';
import { PostList } from '../../components/blog/post/PostList';
import { POSTS } from '../../configs/lang';

const PostListPage = () => {
  return (
    <>
      <Helmet>
        <title>{POSTS}</title>
      </Helmet>
      <PostList />
    </>
  );
};

export { PostListPage };
