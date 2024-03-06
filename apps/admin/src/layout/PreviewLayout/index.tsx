import { Layout } from 'antd';

const { Content } = Layout;

export interface PreviewLayoutProps {
  children: React.ReactNode;
}

const PreviewLayout: React.FC<PreviewLayoutProps> = (props: PreviewLayoutProps) => {
  const { children } = props;

  return (
    <Layout>
      <Content>{children}</Content>
    </Layout>
  );
};

export { PreviewLayout };
