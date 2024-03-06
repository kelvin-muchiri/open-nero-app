import { Helmet } from 'react-helmet-async';
import { CategoryTree } from '../../components/blog/category/CategoryTree';
import { CATEGORIES } from '../../configs/lang';

const BlogCategoryTreePage = () => {
  return (
    <>
      <Helmet>
        <title>{CATEGORIES}</title>
      </Helmet>
      <CategoryTree />
    </>
  );
};

export { BlogCategoryTreePage };
