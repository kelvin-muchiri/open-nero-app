import { Layout, Col } from 'antd';
import { URL_HOME } from '../../configs/constants';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const { Header, Content } = Layout;

export interface ResultLayoutProps {
  children: React.ReactNode;
}

const ResultLayout: React.FC<ResultLayoutProps> = (props: ResultLayoutProps) => {
  const { children } = props;
  const config = useAppSelector((state) => state.config);

  return (
    <Layout className="guest-layout">
      <Header>
        <Col xl={6} lg={6} md={6} sm={22} xs={22}>
          <div className="logo">
            <Link to={URL_HOME}>{config.siteName}</Link>
          </div>
        </Col>
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
};

export { ResultLayout };
