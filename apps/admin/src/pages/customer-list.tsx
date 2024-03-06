import { Helmet } from 'react-helmet-async';
import { CustomerList } from '../components/customers/CustomerList';
import { CUSTOMERS } from '../configs/lang';

const CustomerListPage = () => {
  return (
    <>
      <Helmet>
        <title>{CUSTOMERS}</title>
      </Helmet>
      <CustomerList />
    </>
  );
};

export { CustomerListPage };
