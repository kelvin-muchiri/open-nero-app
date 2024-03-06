import { Helmet } from 'react-helmet-async';
import { OrderHistory } from '../components/orders/OrderHistory';
import { HISTORY } from '../configs/lang';

const OrderHistoryPage = () => {
  return (
    <>
      <Helmet>
        <title>{HISTORY}</title>
      </Helmet>
      <OrderHistory />
    </>
  );
};

export { OrderHistoryPage as default };
