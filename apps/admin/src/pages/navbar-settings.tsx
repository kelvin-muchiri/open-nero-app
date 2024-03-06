import { Helmet } from 'react-helmet-async';
import { NavbarSettings } from '../components/settings/NavbarSettings';
import { MENU_SETTINGS } from '../configs/lang';

const NavbarSettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>{MENU_SETTINGS}</title>
      </Helmet>
      <NavbarSettings />
    </>
  );
};

export { NavbarSettingsPage };
