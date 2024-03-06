import { PostList, PostListParams } from '@nero/query-api-service';
import { useQueryParams } from '@nero/utils';
import { Empty, Pagination, Skeleton } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_BLOG_POSTS } from '../../../configs/constants';
import { apiService } from '../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { BlogListItem } from './BlogListItem';
import { updatePostList } from '../reducer/blogSlice';
import { useGetURLBlog } from '../../../helpers/hooks';

const BlogList = () => {
  const params = useQueryParams();
  const posts = useAppSelector((state) => state.blog.postList);
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const paramPage = params.get('page');
  const getPage = useCallback(() => {
    if (!paramPage) {
      return undefined;
    }

    try {
      return parseInt(paramPage);
    } catch (e) {
      return undefined;
    }
  }, [paramPage]);
  const page = getPage();

  const getPosts = useCallback(() => {
    setLoading(true);

    apiService
      .getAxiosInstance()
      .get<PostList>(ENDPOINT_BLOG_POSTS, {
        withCredentials: false,
        headers: { 'X-Ignore-Credentials': true },
        params: { page, is_published: true } as PostListParams,
      })
      .then((res) => {
        dispatch(updatePostList(res.data));
      })
      .catch(() => {
        dispatch(updatePostList(undefined));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, page]);

  useEffect(() => {
    // fetch data incase server side rendering fails or app is not
    // running with SSR
    if (!posts) {
      getPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch posts when page number changes
  useEffect(() => {
    if (page != undefined) {
      getPosts();
    }
  }, [page, getPosts]);

  const urlBlog = useGetURLBlog();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!posts) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <>
      {posts.results.map((item) => (
        <div key={item.slug} className="pb-20">
          <BlogListItem item={item} />
        </div>
      ))}
      <div className="mt-20 text-center">
        <Pagination
          current={getPage()}
          total={posts.count}
          pageSize={posts.page_size}
          onChange={(page) => {
            navigate({
              pathname: urlBlog,
              search: `?page=${page}`,
            });
          }}
          hideOnSinglePage={true}
        />
      </div>
    </>
  );
};

export { BlogList };
