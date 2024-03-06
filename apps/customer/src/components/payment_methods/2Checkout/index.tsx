import { Order } from '@nero/query-api-service';
import { Button } from 'antd';
import { BUTTON_PAY } from '../../../configs/lang';

export interface TwocheckoutProps {
  sellerId: string;
  order: Order;
  isDemo?: boolean;
}

const Twocheckout: React.FC<TwocheckoutProps> = (props: TwocheckoutProps) => {
  const { sellerId, order, isDemo } = props;

  return (
    <form action="https://www.2checkout.com/checkout/purchase" method="post">
      <input type="hidden" name="sid" value={sellerId} />
      <input type="hidden" name="mode" value="2CO" />

      {order.items.map((item, index) => (
        <>
          <input type="hidden" name={`li_${index}_type`} value="product" />
          <input type="hidden" name={`li_${index}_name`} value={item.topic} />
          <input type="hidden" name={`li_${index}_price`} value={item.price} />
          <input type="hidden" name={`li_${index}_quantity`} value={item.quantity} />
        </>
      ))}

      {order.coupon && (
        <>
          <input type="hidden" name={`li_${order.items.length}_type`} value="coupon" />
          <input type="hidden" name={`li_${order.items.length}_name`} value={order.coupon.code} />
          <input
            type="hidden"
            name={`li_${order.items.length}_price`}
            value={order.coupon.discount}
          />
        </>
      )}

      {isDemo && <input type="hidden" name="demo" value="Y" />}

      <Button type="primary" htmlType="submit">
        {BUTTON_PAY}
      </Button>
    </form>
  );
};

export { Twocheckout };
