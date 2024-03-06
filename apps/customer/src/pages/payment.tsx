import { Row, Col, Divider, Card, Typography, Result, Skeleton, Space, Alert, Button } from 'antd';
import {
  ENDPOINT_PAYMENT_METHODS,
  ENDPOINT_SELF_ORDERS,
  URL_HOME,
  URL_PAYMENT_SUCCESS,
} from '../configs/constants';
import {
  CONTACT_FOR_SUPPORT,
  ERROR_GENERIC,
  ERROR_PAYMENT_GENERIC,
  SECURE_PAYMENT,
  SUCCESS_PAYMENT_CANCELLED,
  TAKE_ME_HOME,
} from '../configs/lang';
import { PaymentMethodCode } from '@nero/query-api-service';
import { PayPalOrder } from '../components/payment_methods';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetPaymentMethodsQuery, useGetSingleOrderQuery } from '../services/api';
import { PaymentInstructions } from '../components/payment_methods/Instructions';
import { Twocheckout } from '../components/payment_methods/2Checkout';
import { NODE_ENV } from '../configs/envs';

const { Title } = Typography;

type LocationState = {
  orderId: string;
};

const PaymentPage = () => {
  const location = useLocation();
  const { orderId } = location.state as LocationState;
  const { data: order, isLoading: orderLoading } = useGetSingleOrderQuery({
    url: ENDPOINT_SELF_ORDERS,
    id: orderId,
  });
  const { data: paymentMethods, isLoading: paymentMethodsLoading } = useGetPaymentMethodsQuery({
    url: ENDPOINT_PAYMENT_METHODS,
    params: { is_active: true },
  });
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);
  const [cancelled, setCancelled] = useState<boolean>(false);

  const onApprove = useCallback(() => {
    navigate(URL_PAYMENT_SUCCESS);
  }, [navigate]);

  const onError = useCallback(() => {
    setError(true);
    setCancelled(false);
  }, []);

  const onCancel = useCallback(() => {
    setCancelled(true);
    setError(false);
  }, []);

  const feedback = (message: string) => (
    <Space direction="vertical">
      <p>{message}</p>
      <Button
        type="primary"
        onClick={() => {
          navigate(URL_HOME);
        }}
      >
        {TAKE_ME_HOME}
      </Button>
    </Space>
  );

  return (
    <>
      <Helmet>
        <title>{SECURE_PAYMENT}</title>
      </Helmet>
      <div className="nero-content-bg full-height ptb-30 pl-30 pr-30">
        <Row>
          <Col md={{ span: 8, offset: 8 }} xs={24}>
            <Card bordered={false}>
              {!order || !paymentMethods?.length ? (
                <>
                  {orderLoading || paymentMethodsLoading ? (
                    <Skeleton active />
                  ) : (
                    <Result
                      status="error"
                      title={ERROR_GENERIC}
                      subTitle={CONTACT_FOR_SUPPORT}
                      extra={
                        <Button
                          type="primary"
                          onClick={() => {
                            navigate(URL_HOME);
                          }}
                        >
                          {TAKE_ME_HOME}
                        </Button>
                      }
                    />
                  )}
                </>
              ) : (
                <>
                  <Divider>
                    <Title level={3}>{SECURE_PAYMENT}</Title>
                  </Divider>

                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <p>
                        We do not handle/store your credit card information because we want to
                        protect you against credit card fraud
                      </p>
                      {error && (
                        <Alert type="error" closable message={feedback(ERROR_PAYMENT_GENERIC)} />
                      )}
                      {cancelled && (
                        <Alert type="info" closable message={feedback(SUCCESS_PAYMENT_CANCELLED)} />
                      )}
                    </Space>

                    <>
                      {paymentMethods?.map((method) => (
                        <Space key={method.code} direction="vertical" style={{ width: '100%' }}>
                          {method.code == PaymentMethodCode.PAYPAL && (
                            <PayPalOrder
                              clientId={method.meta['client_id']}
                              order={order}
                              onError={onError}
                              onApprove={onApprove}
                              onCancel={onCancel}
                              onClick={() => {
                                setError(false);
                                setCancelled(false);
                              }}
                            />
                          )}
                          {method.code == PaymentMethodCode.TWOCHECKOUT && (
                            <Twocheckout
                              sellerId={method.meta['seller_id']}
                              order={order}
                              isDemo={NODE_ENV != 'production'}
                            />
                          )}
                          {method.code == PaymentMethodCode.INSTRUCTIONS && method.instructions && (
                            <PaymentInstructions instructions={method.instructions} />
                          )}
                        </Space>
                      ))}
                    </>
                  </Space>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export { PaymentPage as default };
