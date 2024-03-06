import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { NavbarLinkAdd } from '../components/settings/NavbarSettings/navbar_link/NavbarLinkAdd';
import { ADD_MENU_LINK } from '../configs/lang';

const NavbarLinkAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_MENU_LINK}</title>
      </Helmet>
      <Row>
        <Col xs={24} sm={24} md={12}>
          <NavbarLinkAdd />
        </Col>
      </Row>
    </>
  );
};

export { NavbarLinkAddPage };
