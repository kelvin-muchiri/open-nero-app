import { Row, Col, Typography, Divider, Card, Button } from 'antd';
import { LOGIN_FORM_REGISTER_LINK, SIGN_IN, SIGN_UP } from '../configs/lang';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { MetaTagsHelmet, MetaTagsHelmetProps } from '../Html';

const { Title } = Typography;

export interface LoginPageProps {
  metaTags?: MetaTagsHelmetProps;
  urlSignUp: string;
}

const LoginPage: React.FC<LoginPageProps> = (props: LoginPageProps) => {
  const navigate = useNavigate();
  const { metaTags, urlSignUp } = props;

  return (
    <>
      {metaTags && <MetaTagsHelmet {...metaTags} />}
      <div className="nero-content-bg full-height ptb-30 pl-30 pr-30">
        <Row>
          <Col md={{ span: 8, offset: 8 }} xs={24}>
            <Card bordered={true}>
              <Divider>
                <Title level={3}>{SIGN_IN}</Title>
              </Divider>
              <LoginForm />
              {LOGIN_FORM_REGISTER_LINK}
              <Button
                type="link"
                onClick={() => {
                  navigate(urlSignUp);
                }}
              >
                {SIGN_UP}
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export { LoginPage as default };
