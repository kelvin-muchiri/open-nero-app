import { Button, Result } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { PAGE_NOT_FOUND, TAKE_ME_HOME, PAGE_NOT_FOUND_DESCRIPTION } from '../configs/lang';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{PAGE_NOT_FOUND}</title>
      </Helmet>
      <div className="bg-white full-height">
        <Result
          status="404"
          title="404"
          subTitle={PAGE_NOT_FOUND_DESCRIPTION}
          extra={
            <Button
              type="primary"
              onClick={() => {
                navigate('/');
              }}
            >
              {TAKE_ME_HOME}
            </Button>
          }
        />
      </div>
    </>
  );
};

export { NotFoundPage };
