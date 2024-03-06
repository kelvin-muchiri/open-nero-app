import { Helmet } from 'react-helmet-async';
import { TagList } from '../../components/blog/tag/TagList';
import { TAGS } from '../../configs/lang';

const BlogTagListPage = () => {
  return (
    <>
      <Helmet>
        <title>{TAGS}</title>
      </Helmet>
      <TagList />
    </>
  );
};

export { BlogTagListPage };
