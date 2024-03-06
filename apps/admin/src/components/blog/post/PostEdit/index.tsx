import { Empty, notification, Result, Skeleton } from 'antd';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_BLOG_POSTS, URL_EDIT_BLOG_POST } from '../../../../configs/constants';
import {
  ERROR_GENERIC,
  SUCCESS_DRAFT_SAVED,
  SUCCESS_POST_PUBLISHED,
} from '../../../../configs/lang';
import { useGetSinglePostQuery, useUpdatePostMutation } from '../../../../services/api';
import { useAppDispatch } from '../../../../store/hooks';
import {
  convertContentBlockDraftJsToHTML,
  convertContentBlockHTMLToDraftJs,
} from '../../../page_managment/PageEdit/utils';
import { changeBlog, reset, PostState } from '../../blogSlice';
import { MemoizedPostEditor } from '../PostEditor';

export interface PostEditProps {
  id: string;
}

const PostEdit: React.FC<PostEditProps> = (props: PostEditProps) => {
  const { id } = props;
  const { data, error, isLoading } = useGetSinglePostQuery({
    url: ENDPOINT_BLOG_POSTS,
    slug: id,
    action: 'no-cache',
  });
  const [updatePost] = useUpdatePostMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // reset state if there is data
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (!data) {
      return;
    }

    dispatch(
      changeBlog({
        slug: data.slug,
        title: data.title,
        seoTitle: data.seo_title || '',
        seoDescription: data.seo_description || '',
        isPublished: data.is_published,
        isFeatured: data.is_featured,
        isPinned: data.is_pinned,
        tags: data.tags.map((tag) => tag.id),
        categories: data.categories.map((cat) => cat.id),
        draft: convertContentBlockHTMLToDraftJs(data.draft),
        featuredImage: data.featured_image,
      })
    );
  }, [data, dispatch]);

  const edit = useCallback(
    (data: PostState, publish?: boolean) => {
      const {
        title,
        slug,
        seoTitle,
        seoDescription,
        isPublished,
        isFeatured,
        isPinned,
        tags,
        categories,
        featuredImage,
      } = data;

      updatePost({
        url: ENDPOINT_BLOG_POSTS,
        data: {
          title,
          slug,
          seo_title: seoTitle,
          seo_description: seoDescription,
          is_published: publish ? true : isPublished,
          is_featured: isFeatured,
          is_pinned: isPinned,
          tags,
          categories,
          draft: convertContentBlockDraftJsToHTML(data.draft),
          publish: publish,
          featured_image: featuredImage?.id ?? null,
        },
        slug: id,
      })
        .unwrap()
        .then(() => {
          navigate(`${URL_EDIT_BLOG_POST}/${slug}`);
          notification.success({
            message: publish ? SUCCESS_POST_PUBLISHED : SUCCESS_DRAFT_SAVED,
          });
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        });
    },
    [updatePost, id, navigate]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!data) {
    return <Empty />;
  }

  const editorProps = {
    onSave: edit,
    postId: id,
  };

  return <MemoizedPostEditor {...editorProps} />;
};

export { PostEdit };
