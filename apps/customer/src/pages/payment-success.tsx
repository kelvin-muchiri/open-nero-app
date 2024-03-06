import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { HOME, PAYMENT_SUCCESS, SUCCESS_PAYMENT } from '../configs/lang';
import { URL_HOME } from '../configs/constants';
import { Helmet } from 'react-helmet-async';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{PAYMENT_SUCCESS}</title>
      </Helmet>
      <div className="nero-content-bg full-height ptb-30 pl-30 pr-30">
        <Result
          status="success"
          title={SUCCESS_PAYMENT}
          extra={
            <Button
              type="primary"
              key="console"
              onClick={() => {
                navigate(URL_HOME);
              }}
            >
              {HOME}
            </Button>
          }
        />
      </div>
    </>
  );
};

export { PaymentSuccessPage as default };
