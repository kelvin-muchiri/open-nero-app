import { Helmet } from 'react-helmet-async';
import { OrderItemList } from '../components/orders/OrderItemList';
import { ORDER_ITEMS } from '../configs/lang';

const OrderItemListPage = () => {
  return (
    <>
      <Helmet>
        <title>{ORDER_ITEMS}</title>
      </Helmet>
      <OrderItemList />
    </>
  );
};

export { OrderItemListPage };
