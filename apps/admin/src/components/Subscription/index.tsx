import { SubscriptionStatus } from '@nero/query-api-service';
import { Alert, Button, notification, Popconfirm, Result, Skeleton, Space, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './style.css';
import { ENDPOINT_SUBSCRIPTION, URL_SUBSCRIBE } from '../../configs/constants';
import {
  CANCEL,
  ERROR_GENERIC,
  SUBSCRIPTION_NONE,
  SUBSCRIPTION,
  SUBSCRIPTION_ACTIVE,
  SUBSCRIPTION_CANCELLED,
  SUBSCRIPTION_SUSPENDED,
  YOU_CAN,
  SUBSCRIPTION_ACTIVE_UNTIL,
  YOUR_SUBSCRIPTION,
  LOADING,
  SUBSCRIPTION_CANCEL_CONFIRM_TITLE,
  SUBSCRIPTION_CANCEL_CONFIRM_DESCRIPTION,
  SUBSCRIPTION_CANCEL_OK,
  SUBSCRIPTION_CANCEL_DECLINE,
  SUBSCRIPTION_CANCEL_CONFIRM_NOTE,
  SUBSCRIBE_BUTTON_LABEL,
  SUBSCRIPTION_LIMTED_ACCESS,
} from '../../configs/lang';
import { useCancelSubscriptionMutation, useGetCurrentSubscriptionQuery } from '../../services/api';

const { Title } = Typography;

const Subscription = () => {
  const { data, isLoading, error } = useGetCurrentSubscriptionQuery({ url: ENDPOINT_SUBSCRIPTION });
  const [cancelSubscription] = useCancelSubscriptionMutation();
  const navigate = useNavigate();
  const [isCancelling, setCancelling] = useState<boolean>(false);
  const handleCancelSubscription = useCallback(() => {
    setCancelling(true);
    cancelSubscription(`${ENDPOINT_SUBSCRIPTION}cancel/`)
      .unwrap()
      .then(() => {
        notification.error({ message: SUBSCRIPTION_CANCELLED });
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      })
      .finally(() => {
        setCancelling(false);
      });
  }, [cancelSubscription]);
  const shouldSubscribe = useCallback(() => {
    if (!data) {
      return false;
    }

    const { subscription } = data;

    if (subscription == null) {
      return true;
    }

    if (subscription.status == SubscriptionStatus.CANCELLED && subscription.is_expired) {
      return true;
    }

    return subscription.status == SubscriptionStatus.SUSPENED;
  }, [data]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const { subscription } = data;

  return (
    <div className="subscription">
      <Title level={1}>{SUBSCRIPTION}</Title>
      <div className="subscription__alert">
        {subscription == null && (
          <Alert message={`${SUBSCRIPTION_NONE}. ${SUBSCRIPTION_LIMTED_ACCESS}`} type="error" />
        )}
        {subscription?.status == SubscriptionStatus.CANCELLED && (
          <Alert
            message={`${SUBSCRIPTION_CANCELLED}${
              !subscription.is_expired
                ? `. ${SUBSCRIPTION_ACTIVE_UNTIL} ${format(
                    new Date(subscription.next_billing_time),
                    'dd MMM yyyy'
                  )}`
                : `. ${SUBSCRIPTION_LIMTED_ACCESS}`
            }`}
            type="error"
          />
        )}
        {subscription?.status == SubscriptionStatus.SUSPENED && (
          <Alert message={SUBSCRIPTION_SUSPENDED} type="error" />
        )}
        {subscription?.status == SubscriptionStatus.ACTIVE && (
          <Alert message={SUBSCRIPTION_ACTIVE} type="success" />
        )}
      </div>
      {shouldSubscribe() && (
        <>
          {YOU_CAN}
          <Button
            type="link"
            className="subscription__action_btn"
            onClick={() => {
              navigate(URL_SUBSCRIBE);
            }}
          >
            {SUBSCRIBE_BUTTON_LABEL}
          </Button>
        </>
      )}
      {subscription?.status == SubscriptionStatus.ACTIVE && (
        <Popconfirm
          title={
            <Space direction="vertical">
              <Title level={4}>{SUBSCRIPTION_CANCEL_CONFIRM_TITLE}</Title>
              <p>
                {SUBSCRIPTION_CANCEL_CONFIRM_DESCRIPTION}{' '}
                {format(new Date(subscription.next_billing_time), 'dd MMM yyyy')}
              </p>
              <Alert type="warning" message={SUBSCRIPTION_CANCEL_CONFIRM_NOTE} />
            </Space>
          }
          onConfirm={() => {
            if (isCancelling) {
              return;
            }

            handleCancelSubscription();
          }}
          okText={isCancelling ? LOADING : SUBSCRIPTION_CANCEL_OK}
          cancelText={SUBSCRIPTION_CANCEL_DECLINE}
        >
          {YOU_CAN}
          <Button type="link" className="subscription__action_btn">
            {isCancelling ? LOADING : CANCEL}
          </Button>
          {YOUR_SUBSCRIPTION}
        </Popconfirm>
      )}
    </div>
  );
};

export { Subscription };
