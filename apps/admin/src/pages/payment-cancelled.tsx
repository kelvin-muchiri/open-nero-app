import { Result, Button } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  GO_TO_DASHBOARD,
  PAYMENT_CANCELLED,
  SUCCESS_PAYMENT_CANCELLED,
  SUCCESS_PAYMENT_CANCELLED_DESC,
} from '../configs/lang';

const PaymentCancelledPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{PAYMENT_CANCELLED}</title>
      </Helmet>
      <div className="site-card-border-less-wrapper">
        <Result
          status="info"
          title={SUCCESS_PAYMENT_CANCELLED}
          subTitle={SUCCESS_PAYMENT_CANCELLED_DESC}
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
      </div>
    </>
  );
};

export { PaymentCancelledPage };
