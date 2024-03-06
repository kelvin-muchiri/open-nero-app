import { Col, Row } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { URL_HOME } from '../../../configs/constants';
import { HOME } from '../../../configs/lang';
import { useAppSelector } from '../../../store/hooks';
import { MainMenuItem } from './MainMenuItem';
import { MeanMenuItem } from './MeanMenuItem';
import { useGetNavbarLinks } from '../../../helpers/hooks';

const Navbar = () => {
  const [isMeanMenuOpen, setIsMeanMenuOpen] = useState<boolean>(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const nodeRef = useRef(null);
  const navbarLinks = useGetNavbarLinks();
  const { siteName } = useAppSelector((state) => state.config);
  const rightNavLinks = useCallback(
    () =>
      navbarLinks.filter(
        (link) => link.link_to?.metadata.is_sign_up || link.link_to?.metadata.is_sign_in
      ),
    [navbarLinks]
  );
  const leftNavLinks = useCallback(
    () =>
      navbarLinks.filter(
        (link) =>
          !link.link_to?.metadata.is_sign_up &&
          !link.link_to?.metadata.is_sign_in &&
          !link.link_to?.metadata.is_home
      ),
    [navbarLinks]
  );

  const toggleMeanMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMeanMenuOpen(!isMeanMenuOpen);
  };

  const toggleSubmenu = (e: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    e.preventDefault();
    const updatedOpenSubmenus = [...openSubmenus];
    const index = updatedOpenSubmenus.indexOf(key);

    if (index >= 0) {
      updatedOpenSubmenus.splice(index, 1);
    } else {
      updatedOpenSubmenus.push(key);
    }
    setOpenSubmenus(updatedOpenSubmenus);
  };

  return (
    <Row className="navbar">
      <Col span={5}>
        <div className="logo">
          <Link to={URL_HOME}>{siteName}</Link>
        </div>
      </Col>
      <Col span={19}>
        <nav className="navbar__main-menu">
          <Row>
            <Col span={18}>
              <ul className="navbar__list">
                <li className="navbar__list-item">
                  <Link to={URL_HOME}>{HOME}</Link>
                </li>
                {leftNavLinks().map((item) => {
                  return <MainMenuItem item={item} key={item.id} depth={0} />;
                })}
              </ul>
            </Col>
            <Col span={6}>
              <ul className="navbar__list">
                {rightNavLinks().map((item) => (
                  <li key={item.id} className="navbar__list-item">
                    <Link to={item.link_to ? `/${item.link_to?.slug}` : '/'}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </nav>

        <div className="mobile-menu-area">
          <div className="mobile-menu mean-container">
            <>
              <div className="mean-bar">
                <a
                  href="#nav"
                  onClick={toggleMeanMenu}
                  className={`meanmenu-reveal ${isMeanMenuOpen ? 'meanclose' : ''}`}
                >
                  {isMeanMenuOpen ? (
                    'X'
                  ) : (
                    <>
                      <span />
                      <span />
                      <span />
                    </>
                  )}
                </a>
                <nav className="mean-nav">
                  <CSSTransition
                    in={isMeanMenuOpen}
                    timeout={400}
                    classNames="meanmenu-list-transition"
                    nodeRef={nodeRef}
                    unmountOnExit
                  >
                    <ul ref={nodeRef} className="menu-overflow">
                      <li>
                        <Link to={URL_HOME}>{HOME}</Link>
                      </li>
                      {leftNavLinks().map((link) => {
                        return (
                          <MeanMenuItem
                            key={link.id}
                            item={link}
                            openSubmenus={openSubmenus}
                            toggleSubmenu={toggleSubmenu}
                          />
                        );
                      })}
                      {rightNavLinks().map((link) => {
                        return (
                          <li key={link.id}>
                            <Link to={link.link_to ? `/${link.link_to?.slug}` : '/'}>
                              {link.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </CSSTransition>
                </nav>
              </div>
              <div className="mean-push"></div>
            </>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export { Navbar as default };
