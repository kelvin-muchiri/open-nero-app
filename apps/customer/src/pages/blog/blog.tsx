import { Helmet } from 'react-helmet-async';
import { BlogList } from '../../components/Blog/BlogList';
import { BLOG } from '../../configs/lang';
import { useAppSelector } from '../../store/hooks';
import { MetaTagsHelmet, MetaTagsHelmetProps } from '../../Html';
import { useGetURLBlog } from '../../helpers/hooks';

export interface BlogPageProps {
  metaTags?: MetaTagsHelmetProps;
}

const BlogPage: React.FC<BlogPageProps> = (props: BlogPageProps) => {
  const { primaryDomain } = useAppSelector((state) => state.config);
  const urlBlog = useGetURLBlog();
  const { metaTags } = props;

  return (
    <>
      {metaTags && <MetaTagsHelmet {...metaTags} />}
      <Helmet>
        {primaryDomain && <link rel="canonical" href={`https://${primaryDomain}${urlBlog}`} />}
      </Helmet>
      <div className="pb-20 bg-white full-height">
        <h1 className="text-center ptb-40 large-text nero-page-title">{BLOG}</h1>
        <div className="nero-wrapper-960">
          <BlogList />
        </div>
      </div>
    </>
  );
};

export { BlogPage as default };
