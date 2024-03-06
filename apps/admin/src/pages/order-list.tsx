import { Helmet } from 'react-helmet-async';
import { OrderList } from '../components/orders/OrderList';
import { ORDERS } from '../configs/lang';

const OrderListPage = () => {
  return (
    <>
      <Helmet>
        <title>{ORDERS}</title>
      </Helmet>
      <OrderList />
    </>
  );
};

export { OrderListPage };
