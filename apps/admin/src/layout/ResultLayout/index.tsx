import { Layout, Col, Skeleton, Result } from 'antd';
import { Link } from 'react-router-dom';
import { ENDPOINT_SITE_CONFIGS } from '../../configs/constants';
import { ERROR_GENERIC } from '../../configs/lang';
import { useGetPublicSiteConfigsQuery } from '../../services/api';
import './style.css';

const { Header, Content } = Layout;

export interface ResultLayoutProps {
  children: React.ReactNode;
}

const ResultLayout: React.FC<ResultLayoutProps> = (props: ResultLayoutProps) => {
  const { children } = props;
  const {
    data: configs,
    isLoading: configsLoading,
    error: configsError,
  } = useGetPublicSiteConfigsQuery(ENDPOINT_SITE_CONFIGS);

  if (configsLoading) {
    return <Skeleton active />;
  }

  if (configsError || !configs) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <Layout className="result-layout">
      <Header>
        <Col xl={6} lg={6} md={6} sm={22} xs={22}>
          <div className="logo">
            <Link to="/">{configs.name}</Link>
          </div>
        </Col>
      </Header>
      <Content className="result-layout__content">{children}</Content>
    </Layout>
  );
};

export { ResultLayout };
