import { Layout, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import './style.css';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useWindowSize } from '@nero/utils';
import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';
import {
  URL_EDIT_BLOG_CATEGORY,
  URL_EDIT_BLOG_POST,
  URL_EDIT_BLOG_TAG,
  URL_EDIT_FOOTER_GROUP,
  URL_EDIT_FOOTER_LINK,
  URL_EDIT_NAVBAR_LINK,
  URL_EDIT_PAGE,
  URL_EDIT_PAPER,
  URL_PRICING,
} from '../../configs/constants';
import { useAppSelector } from '../../store/hooks';
import { routes } from '../../routes';

const { Content, Sider, Header } = Layout;

export interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = (props: AdminLayoutProps) => {
  const { children } = props;
  const [width] = useWindowSize();
  const auth = useAppSelector((state) => state.auth);
  const breadcrumbs = useReactRouterBreadcrumbs(routes(auth), {
    excludePaths: [
      '/',
      URL_EDIT_PAPER,
      URL_PRICING,
      URL_EDIT_PAGE,
      URL_EDIT_NAVBAR_LINK,
      URL_EDIT_FOOTER_LINK,
      URL_EDIT_FOOTER_GROUP,
      URL_EDIT_BLOG_CATEGORY,
      URL_EDIT_BLOG_TAG,
      URL_EDIT_BLOG_POST,
    ],
  });

  return (
    <Layout>
      <Sider collapsed={width < 767 ? true : false}>
        <div className="admin-brand" />
        <Sidebar />
      </Sider>

      <Layout>
        <Header className="admin-layout-header" style={{ padding: 0 }}>
          <Navbar />
        </Header>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbs.map(({ match, breadcrumb }) => (
              <Breadcrumb.Item key={match.pathname}>
                <Link to={match.pathname}>{breadcrumb}</Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Content>
            <div
              className="admin-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: '100vh',
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export { AdminLayout };
