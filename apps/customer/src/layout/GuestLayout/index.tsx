import { Suspense, lazy } from 'react';
import { Layout, Spin } from 'antd';
import { useAppSelector } from '../../store/hooks';
import { Navigate } from 'react-router-dom';
import { URL_ORDER_HISTORY } from '../../configs/constants';
const { Header, Content, Footer } = Layout;

const NeroFooter = lazy(() => import('./Footer'));
const Navbar = lazy(() => import('./Navbar'));

export interface GuestLayoutProps {
  children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = (props: GuestLayoutProps) => {
  const { children } = props;
  const auth = useAppSelector((state) => state.auth);

  if (!auth.isLoading && auth.isAuthenticated && auth.user?.profile_type == 'CUSTOMER') {
    // if a customer is already logged in, take them to dashboard
    return <Navigate to={URL_ORDER_HISTORY} />;
  }

  return (
    <Layout className="guest-layout">
      <Header>
        <Suspense fallback={<Spin />}>
          <Navbar />
        </Suspense>
      </Header>
      <Content>{children}</Content>
      <Footer className="guest-layout__footer">
        <Suspense fallback={<Spin />}>
          <NeroFooter />
        </Suspense>
      </Footer>
    </Layout>
  );
};

export { GuestLayout };
