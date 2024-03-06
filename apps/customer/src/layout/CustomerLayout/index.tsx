import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';
import { ENDPOINT_PROFILE, URL_VERIFY_EMAIL_INTERCEPTOR } from '../../configs/constants';
import { useWindowSize } from '@nero/utils';
import { routes } from '../../routes';
import { useGetProfileQuery } from '../../services/api';
import { useAppSelector } from '../../store/hooks';
import { Navbar as AccountNavbar } from './Navbar';
import { Sidebar } from './Sidebar';
const { Header, Content, Sider } = Layout;

export interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = (props: CustomerLayoutProps) => {
  const { children } = props;
  const [width] = useWindowSize();
  const auth = useAppSelector((state) => state.auth);
  const breadcrumbs = useReactRouterBreadcrumbs(routes(auth), {
    excludePaths: ['/'],
  });
  const { data: profile } = useGetProfileQuery(ENDPOINT_PROFILE);
  const navigate = useNavigate();

  if (profile && !profile.is_email_verified) {
    navigate(URL_VERIFY_EMAIL_INTERCEPTOR);
  }

  return (
    <Layout className="account-layout">
      <Header>
        <AccountNavbar />
      </Header>

      <Layout>
        <Sider className="account-layout__sider" collapsed={width < 767 ? true : false}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Sidebar />
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbs.map(({ match, breadcrumb }) => (
              <Breadcrumb.Item key={match.pathname}>
                <Link to={match.pathname}>{breadcrumb}</Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Content
            className="account-layout__content"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export { CustomerLayout };
