import { Helmet } from 'react-helmet-async';
import { PageList } from '../components/page_managment/PageList';
import { PAGES } from '../configs/lang';

const PageListPage = () => {
  return (
    <>
      <Helmet>
        <title>{PAGES}</title>
      </Helmet>
      <PageList />
    </>
  );
};

export { PageListPage };
