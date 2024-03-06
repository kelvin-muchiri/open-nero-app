import { Helmet } from 'react-helmet-async';
import { DeadlineList } from '../components/catalog/deadlines/DeadlineList';
import { DEADLINES } from '../configs/lang';

const DeadlineListPage = () => {
  return (
    <>
      <Helmet>
        <title>{DEADLINES}</title>
      </Helmet>
      <DeadlineList />
    </>
  );
};

export { DeadlineListPage };
