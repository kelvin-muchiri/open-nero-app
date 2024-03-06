import { Row, Col, Typography, Divider, Card } from 'antd';
import { SIGN_UP } from '../configs/lang';
import { RegisterForm } from '../components/RegisterForm';
import { GOOGLE_RECAPTCHA_SITE_KEY } from '../configs/envs';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { MetaTagsHelmet, MetaTagsHelmetProps } from '../Html';

const { Title } = Typography;

export interface RegisterPageProps {
  metaTags?: MetaTagsHelmetProps;
  urlSignIn: string;
}

const RegisterPage: React.FC<RegisterPageProps> = (props: RegisterPageProps) => {
  const { metaTags, urlSignIn } = props;
  // Only one GoogleReCaptchaProvider is required for the entire application.
  // For now we add it here, if recaptcha is implemented in another part of the app,
  // them the provider should be moved high app in the tree https://www.npmjs.com/package/react-google-recaptcha-v3
  return (
    <GoogleReCaptchaProvider reCaptchaKey={GOOGLE_RECAPTCHA_SITE_KEY}>
      {metaTags && <MetaTagsHelmet {...metaTags} />}
      <div className="nero-content-bg full-height ptb-30 pl-30 pr-30">
        <Row>
          <Col md={{ span: 8, offset: 8 }} xs={24}>
            <Card bordered={true}>
              <Divider>
                <Title level={3}>{SIGN_UP}</Title>
              </Divider>
              <RegisterForm urlSignIn={urlSignIn} />
            </Card>
          </Col>
        </Row>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export { RegisterPage as default };
