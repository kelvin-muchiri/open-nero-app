import { Result, Space, Typography } from 'antd';
const { Link } = Typography;

const SiteUnavailable = () => {
  return (
    <Result
      title="We'll be back soon"
      subTitle={`${location.origin} is currently unavailable`}
      extra={
        <Space direction="vertical">
          <p>If you are a visitor to this store, please try again later</p>
          <p>
            If you are the owner of the site, please{' '}
            <Link href={`${location.origin}/admin`} target="_blank">
              sign in
            </Link>{' '}
            to resolve this issue
          </p>
        </Space>
      }
    />
  );
};

export { SiteUnavailable };
