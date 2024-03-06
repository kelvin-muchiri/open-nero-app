import { Result } from 'antd';
import { ENDPOINT_PAGES } from '../../../configs/constants';
import { ERROR_GENERIC } from '../../../configs/lang';
import { DynamicPage } from '@nero/components';
import { queryService, useGetDraftPagesQuery } from '../../../services/api';

export interface PreviewPageProps {
  pageId: string;
}

const PagePreview: React.FC<PreviewPageProps> = (props: PreviewPageProps) => {
  const { data, error, isLoading } = useGetDraftPagesQuery({ url: ENDPOINT_PAGES });
  const page = data?.find((page) => page.id == props.pageId);

  if (isLoading) {
    return <div style={{ height: '100vh' }}></div>;
  }

  if (error || !page) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <DynamicPage
      neroQuery={queryService}
      page={{
        ...page,
        blocks: page.draft,
      }}
      loginURL="/"
    />
  );
};

export { PagePreview };
