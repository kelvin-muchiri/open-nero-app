import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Skeleton } from 'antd';
import { Order } from '@nero/query-api-service';

export interface ButtonWrapperProps {
  order: Order;
  onApprove: () => void;
  onError: () => void;
  onCancel: () => void;
  onClick?: () => void;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = (props: ButtonWrapperProps) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <Skeleton />;
  }

  const { order, onApprove, onError, onCancel, onClick } = props;

  return (
    <PayPalButtons
      onClick={onClick}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              custom_id: order.id.toString(),
              amount: {
                currency_code: 'USD',
                value: order.amount_payable.toString(),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: order.original_amount_payable.toString(),
                  },
                  discount: !order.coupon
                    ? undefined
                    : {
                        currency_code: 'USD',
                        value: order.coupon.discount.toString(),
                      },
                },
              },
              items: order.items.map((item) => {
                return {
                  name: item.paper,
                  quantity: item.quantity.toString(),
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: item.price.toString(),
                  },
                };
              }),
            },
          ],
        });
      }}
      onApprove={(data, actions) => {
        if (actions.order) {
          return actions.order.capture().then(() => {
            onApprove();
          });
        }

        return Promise.resolve();
      }}
      onError={() => {
        onError();
      }}
      onCancel={() => {
        onCancel();
      }}
    />
  );
};

export { ButtonWrapper };
