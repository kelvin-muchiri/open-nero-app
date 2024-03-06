import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { OrderDetail } from '../components/orders/OrderDetail';
import { PARAM_ORDER_ID } from '../configs/constants';
import { ORDER } from '../configs/lang';

const OrderDetailPage = () => {
  const { orderId } = useParams<typeof PARAM_ORDER_ID>();
  return (
    <>
      <Helmet>
        <title>
          {ORDER} {orderId}
        </title>
      </Helmet>
      <OrderDetail orderId={orderId || ''} />
    </>
  );
};

export { OrderDetailPage as default };
