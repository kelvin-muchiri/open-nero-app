import { Helmet } from 'react-helmet-async';
import { SiteUnavailable } from '../components/SiteUnavailable';

const SiteUnavailablePage = () => {
  return (
    <>
      <Helmet>
        <title>We&apos;ll be back soon</title>
      </Helmet>
      <SiteUnavailable />
    </>
  );
};

export { SiteUnavailablePage };
