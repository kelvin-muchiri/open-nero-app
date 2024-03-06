import { Result, Button } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  ERROR_PAYMENT,
  ERROR_PAYMENT_DESCRIPTION,
  GO_TO_DASHBOARD,
  PAYMENT_FAILED,
} from '../configs/lang';

const PaymentFailedPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{PAYMENT_FAILED}</title>
      </Helmet>
      <div className="site-card-border-less-wrapper">
        <Result
          status="error"
          title={ERROR_PAYMENT}
          subTitle={ERROR_PAYMENT_DESCRIPTION}
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

export { PaymentFailedPage };
