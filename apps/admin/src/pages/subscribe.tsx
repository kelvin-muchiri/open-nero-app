import { Button, Result, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CurrentSubscription, Subscription, SubscriptionStatus } from '@nero/query-api-service';
import { Subscribe } from '../components/Subscription/Subscribe';
import { ENDPOINT_SUBSCRIPTION } from '../configs/constants';
import {
  ERROR_GENERIC,
  GO_TO_DASHBOARD,
  SUBSCRIBE,
  SUBSCRIPTION_EXISTS,
  TRY_AGAIN_LATER,
} from '../configs/lang';
import { apiService } from '../services/api';

const SubscribePage = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiService
      .getAxiosInstance()
      .get<CurrentSubscription>(ENDPOINT_SUBSCRIPTION)
      .then((res) => {
        setCurrentSubscription(res.data.subscription);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (hasError) {
    return <Result status="error" title={ERROR_GENERIC} subTitle={TRY_AGAIN_LATER} />;
  }
  const hasActiveSubscription =
    currentSubscription &&
    (currentSubscription.status == SubscriptionStatus.ACTIVE ||
      (currentSubscription.status == SubscriptionStatus.CANCELLED &&
        !currentSubscription.is_expired));

  if (hasActiveSubscription) {
    return (
      <>
        <Helmet>
          <title>{SUBSCRIBE}</title>
        </Helmet>
        <Result
          status="success"
          title={SUBSCRIPTION_EXISTS}
          extra={
            <Button
              type="primary"
              key="console"
              onClick={() => {
                navigate('/');
              }}
            >
              {GO_TO_DASHBOARD}
            </Button>
          }
        />
      </>
    );
  }

  return <Subscribe isOnTrial={currentSubscription == null ? true : false} />;
};

export { SubscribePage };
