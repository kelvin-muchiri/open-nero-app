import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Skeleton } from 'antd';

export interface SubscriptionButtonWrapperProps {
  planId: string;
  siteId: string;
  onApprove: () => void;
  onError: () => void;
  onCancel: () => void;
}

const SubscriptionButtonWrapper: React.FC<SubscriptionButtonWrapperProps> = (
  props: SubscriptionButtonWrapperProps
) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <Skeleton />;
  }

  const { planId, siteId, onApprove, onError, onCancel } = props;

  return (
    <PayPalButtons
      createSubscription={(data, actions) => {
        return actions.subscription.create({
          plan_id: planId,
          custom_id: siteId,
        });
      }}
      style={{
        label: 'subscribe',
      }}
      onApprove={() => {
        onApprove();

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

export { SubscriptionButtonWrapper };
