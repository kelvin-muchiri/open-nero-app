import { Result } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { OrderItemDetail } from '../components/orders/OrderItemDetail';
import { PARAM_ID } from '../configs/constants';
import { ERROR_GENERIC, ORDER_ITEM } from '../configs/lang';

const OrderItemPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {ORDER_ITEM} {id}
        </title>
      </Helmet>
      <OrderItemDetail orderItemId={id} />
    </>
  );
};

export { OrderItemPage };
