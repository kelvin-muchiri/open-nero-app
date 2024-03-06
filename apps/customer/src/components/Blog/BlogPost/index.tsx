import { DynamicPost } from '@nero/components';
import { Post } from '@nero/query-api-service';
import { Result, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import Axios from 'axios';
import { ENDPOINT_BLOG_POSTS, URL_NOT_FOUND } from '../../../configs/constants';
import { ERROR_GENERIC } from '../../../configs/lang';
import { apiService } from '../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updatePost } from '../reducer/blogSlice';

export interface BlogPostProps {
  slug: string;
}

const BlogPost: React.FC<BlogPostProps> = (props: BlogPostProps) => {
  const post = useAppSelector((state) => state.blog.post);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const { slug } = props;

  useEffect(() => {
    // fetch data incase server side rendering fails or app is not running with SSR
    if (!post || post.slug != slug) {
      apiService
        .getAxiosInstance()
        .get<Post>(`${ENDPOINT_BLOG_POSTS}${slug}/`, {
          withCredentials: false,
          headers: { 'X-Ignore-Credentials': true },
        })
        .then((res) => {
          dispatch(updatePost(res.data));
        })
        .catch((err) => {
          if (Axios.isAxiosError(err) && err.response?.status == 404) {
            setNotFound(true);
            return;
          }
          setError(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="bg-white full-height">
        <div className="nero-wrapper-960">
          <Result status="error" title={ERROR_GENERIC} />
        </div>
      </div>
    );
  }

  if (notFound) {
    return <Navigate to={URL_NOT_FOUND} />;
  }

  if (!post) {
    return (
      <div className="bg-white full-height">
        <div className="nero-wrapper-960">
          <Skeleton active />
        </div>
      </div>
    );
  }

  const { title, seo_title, seo_description } = post;

  return (
    <>
      <Helmet>
        <title>{seo_title || title}</title>
        <meta name="description" content={seo_description || title} />
        <meta property="og:title" content={seo_title || title} />
        <meta property="og:description" content={seo_description || title} />
      </Helmet>

      <div className="bg-white full-height">
        <h1 className="text-center ptb-40 nero-page-title large-text">{title}</h1>
        <DynamicPost post={post} />
      </div>
    </>
  );
};

export { BlogPost };
