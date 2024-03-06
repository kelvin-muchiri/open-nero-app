import { Helmet } from 'react-helmet-async';
import { FooterSettings } from '../components/settings/FooterSettings';
import { FOOTER_SETTINGS } from '../configs/lang';

const FooterSettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>{FOOTER_SETTINGS}</title>
      </Helmet>
      <FooterSettings />
    </>
  );
};

export { FooterSettingsPage };
