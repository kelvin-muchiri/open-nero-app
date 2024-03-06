import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Order } from '@nero/query-api-service';
import { ButtonWrapper } from './ButtonWrapper';

export interface PayPalOrderProps {
  order: Order;
  clientId: string;
  onApprove: () => void;
  onError: () => void;
  onCancel: () => void;
  onClick?: () => void;
}

const PayPalOrder: React.FC<PayPalOrderProps> = (props: PayPalOrderProps) => {
  const { order, clientId, onApprove, onError, onCancel, onClick } = props;
  const buttonWrapperProps = {
    order,
    onApprove,
    onError,
    onCancel,
    onClick,
  };
  return (
    <PayPalScriptProvider
      options={{
        'client-id': clientId,
        currency: 'USD',
      }}
    >
      <ButtonWrapper {...buttonWrapperProps} />
    </PayPalScriptProvider>
  );
};

export { PayPalOrder };
