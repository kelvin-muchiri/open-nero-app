import { Helmet } from 'react-helmet-async';
import { Subscription } from '../components/Subscription';
import { SUBSCRIPTION } from '../configs/lang';

const SubscriptionPage = () => {
  return (
    <>
      <Helmet>
        <title>{SUBSCRIPTION}</title>
      </Helmet>
      <Subscription />
    </>
  );
};

export { SubscriptionPage };
