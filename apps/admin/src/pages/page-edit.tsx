import { Result } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PageEdit } from '../components/page_managment/PageEdit';
import { PARAM_ID } from '../configs/constants';
import { EDIT, ERROR_GENERIC, PAGE } from '../configs/lang';

const PageEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    // TODO: Show 404 page instead of error page
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {EDIT} {PAGE}
        </title>
      </Helmet>
      <PageEdit pageId={id} />
    </>
  );
};

export { PageEditPage };
