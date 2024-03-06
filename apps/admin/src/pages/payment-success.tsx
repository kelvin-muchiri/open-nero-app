import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { GO_TO_DASHBOARD, PAYMENT_SUCCESSFUL, SUCCESS_PAYMENT_SUCCESS } from '../configs/lang';
import { Helmet } from 'react-helmet-async';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{PAYMENT_SUCCESSFUL}</title>
      </Helmet>
      <div className="site-card-border-less-wrapper">
        <Result
          status="success"
          title={SUCCESS_PAYMENT_SUCCESS}
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

export { PaymentSuccessPage };
