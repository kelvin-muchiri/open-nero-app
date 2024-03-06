import { Result } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PagePreview } from '../components/page_managment/PagePreview';
import { PARAM_ID } from '../configs/constants';
import { ERROR_GENERIC, PREVIEW } from '../configs/lang';

const PagePreviewPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    // TODO: Show 404 page instead of error page
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>{PREVIEW}</title>
      </Helmet>
      <PagePreview pageId={id} />
    </>
  );
};

export { PagePreviewPage };
