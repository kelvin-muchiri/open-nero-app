import { Helmet } from 'react-helmet-async';
import { VerifyEmailInterceptor } from '../components/VerifyEmailInterceptor';
import { VERIFY_EMAIL } from '../configs/lang';

const VerifyEmailInterceptorPage = () => {
  return (
    <>
      <Helmet>
        <title>{VERIFY_EMAIL}</title>
      </Helmet>
      <div className="nero-content-bg full-height ptb-30 pl-30 pr-30">
        <VerifyEmailInterceptor />
      </div>
    </>
  );
};

export { VerifyEmailInterceptorPage as default };
