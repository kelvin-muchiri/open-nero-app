import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { OrderDetail } from '../components/orders/OrderDetail';
import { PARAM_ID } from '../configs/constants';
import { ORDER } from '../configs/lang';

const AdminOrderDetailPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  return (
    <>
      <Helmet>
        <title>
          {ORDER} {id}
        </title>
      </Helmet>
      <OrderDetail orderId={id || ''} />
    </>
  );
};

export { AdminOrderDetailPage };
