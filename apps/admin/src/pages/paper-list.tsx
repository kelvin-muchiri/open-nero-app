import { Helmet } from 'react-helmet-async';
import { PaperList } from '../components/catalog/papers/PaperList';
import { PAPERS } from '../configs/lang';

const PaperListPage = () => {
  return (
    <>
      <Helmet>
        <title>{PAPERS}</title>
      </Helmet>
      <PaperList />
    </>
  );
};

export { PaperListPage };
