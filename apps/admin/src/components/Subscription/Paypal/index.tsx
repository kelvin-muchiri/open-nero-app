import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SubscriptionButtonWrapper } from './ButtonWrapper';

export interface PayPalSubscriptionProps {
  planId: string;
  clientId: string;
  siteId: string;
  onApprove: () => void;
  onError: () => void;
  onCancel: () => void;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = (props: PayPalSubscriptionProps) => {
  const { planId, siteId, clientId, onApprove, onError, onCancel } = props;
  const buttonWrapperProps = {
    planId,
    siteId,
    onApprove,
    onError,
    onCancel,
  };
  return (
    <PayPalScriptProvider
      options={{
        'client-id': clientId,
        currency: 'USD',
        intent: 'subscription',
        vault: true,
      }}
    >
      <SubscriptionButtonWrapper {...buttonWrapperProps} />
    </PayPalScriptProvider>
  );
};

export { PayPalSubscription };
