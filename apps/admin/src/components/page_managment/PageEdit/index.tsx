import { Empty, notification, Result, Skeleton } from 'antd';
import { useCallback, useEffect } from 'react';
import { ENDPOINT_PAGES } from '../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_DRAFT_SAVED, SUCCESS_PAGE_PUBLISHED } from '../../../configs/lang';
import { MemoizedPageEditor } from '../PageEditor';
import { changePage, PageState, reset } from '../pageSlice';
import { useGetDraftPagesQuery, useUpdatePageMutation } from '../../../services/api';
import { useAppDispatch } from '../../../store/hooks';
import { convertContentBlockDraftJsToHTML, convertContentBlockHTMLToDraftJs } from './utils';

export interface PageEditProps {
  pageId: string;
}

const PageEdit: React.FC<PageEditProps> = (props: PageEditProps) => {
  const { data, error, isLoading } = useGetDraftPagesQuery({ url: ENDPOINT_PAGES });
  const [updatePage] = useUpdatePageMutation();
  const dispatch = useAppDispatch();
  const page = data?.find((page) => page.id == props.pageId);

  useEffect(() => {
    // reset state if there is data
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (!page) {
      return;
    }

    dispatch(
      changePage({
        slug: page.slug,
        title: page.title,
        seoTitle: page.seo_title || '',
        seoDescription: page.seo_description || '',
        isPublic: page.is_public,
        isHome: !!page.metadata.is_home,
        landingPage: page.metadata.landing_page ?? null,
        draft: convertContentBlockHTMLToDraftJs(page.draft),
      })
    );
  }, [page, dispatch]);

  const edit = useCallback(
    (data: PageState, publish?: boolean) => {
      const { title, seoTitle, seoDescription, slug, isPublic, isHome, landingPage } = data;

      updatePage({
        url: `${ENDPOINT_PAGES}${props.pageId}/`,
        data: {
          title: title,
          seo_title: seoTitle,
          seo_description: seoDescription,
          slug: slug,
          is_public: publish ? true : isPublic,
          metadata: {
            is_home: isHome,
            landing_page: landingPage,
          },
          draft: convertContentBlockDraftJsToHTML(data.draft),
          publish: publish,
        },
        id: props.pageId,
      })
        .unwrap()
        .then(() => {
          notification.success({
            message: publish ? SUCCESS_PAGE_PUBLISHED : SUCCESS_DRAFT_SAVED,
          });
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        });
    },
    [updatePage, props.pageId]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!page) {
    return <Empty />;
  }

  const pageEditorProps = {
    onSave: edit,
    pageId: page.id,
  };

  return <MemoizedPageEditor {...pageEditorProps} />;
};

export { PageEdit };
