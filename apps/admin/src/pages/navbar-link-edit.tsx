import { Result, Row, Col } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { NavbarLinkEdit } from '../components/settings/NavbarSettings/navbar_link/NavbarLinkEdit';
import { PARAM_ID } from '../configs/constants';
import { EDIT_MENU_LINK, ERROR_GENERIC } from '../configs/lang';

const NavbarLinkEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>{EDIT_MENU_LINK}</title>
      </Helmet>
      <Row>
        <Col xs={24} sm={24} md={12}>
          <NavbarLinkEdit id={id} />
        </Col>
      </Row>
    </>
  );
};

export { NavbarLinkEditPage };
