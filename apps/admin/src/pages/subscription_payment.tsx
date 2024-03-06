import { Button, Card, Col, Divider, Result, Row, Skeleton, Typography } from 'antd';
import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalSubscription } from '../components/Subscription/Paypal';
import {
  ENDPOINT_SITE_CONFIGS,
  URL_PAYMENT_CANCELLED,
  URL_PAYMENT_FAILED,
  URL_PAYMENT_SUCCESS,
} from '../configs/constants';
import { PAYPAL_CLIENT_ID } from '../configs/envs';
import { ERROR_GENERIC, GO_TO_DASHBOARD, SECURE_PAYMENT } from '../configs/lang';
import { useGetPublicSiteConfigsQuery } from '../services/api';

const { Title } = Typography;

type LocationState = {
  planId: string;
};

const SubscriptionPaymentPage = () => {
  const location = useLocation();
  const {
    data: configs,
    isLoading: configsLoading,
    error,
  } = useGetPublicSiteConfigsQuery(ENDPOINT_SITE_CONFIGS);
  const navigate = useNavigate();
  const onApprove = useCallback(() => {
    navigate(URL_PAYMENT_SUCCESS);
  }, [navigate]);
  const onError = useCallback(() => {
    navigate(URL_PAYMENT_FAILED);
  }, [navigate]);
  const onCancel = useCallback(() => {
    navigate(URL_PAYMENT_CANCELLED);
  }, [navigate]);

  if (configsLoading) {
    return <Skeleton active />;
  }

  if (error || !configs?.site_id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }
  let planId = '';

  try {
    planId = (location.state as LocationState).planId;
  } catch (e) {
    return (
      <div className="site-card-border-less-wrapper">
        <Result
          status="error"
          title={ERROR_GENERIC}
          extra={
            <Button
              type="primary"
              onClick={() => {
                navigate('/');
              }}
            >
              {GO_TO_DASHBOARD}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{SECURE_PAYMENT}</title>
      </Helmet>
      <Row>
        <Col md={{ span: 8, offset: 8 }} xs={24}>
          <Card bordered={false}>
            <Divider>
              <Title level={3}>{SECURE_PAYMENT}</Title>
            </Divider>
            <PayPalSubscription
              clientId={PAYPAL_CLIENT_ID}
              planId={planId}
              siteId={configs.site_id}
              onError={onError}
              onApprove={onApprove}
              onCancel={onCancel}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export { SubscriptionPaymentPage };
