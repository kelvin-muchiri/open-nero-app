// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Form, Input, Button, Space, Alert } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useEffect, useState } from 'react';
import { ENDPOINT_TOKEN_GET } from '../../constants';
import {
  BUTTON_FORGOT_PASSWORD,
  BUTTON_LABEL_SUBMIT,
  LOADING,
  ERROR_EMAIL_REQUIRED,
  ERROR_GENERIC,
  ERROR_PASSWORD_REQUIRED,
  EMAIL,
  INPUT_LABEL_PASSWORD,
  INPUT_REMEMBER_ME,
  ERROR_INVALID_CREDENTIALS,
  ERROR_LOGIN_TOO_MANY_ATTEMPTS,
} from '../../lang';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { useForm } from 'antd/lib/form/Form';
import { ProfileType, User } from '@nero/query-api-service';
import { NeroAPIService } from '@nero/api-service';

export interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

interface ServerValidationErrors {
  non_field_errors?: string[];
  username?: string[];
  password?: string[];
}

interface ServerResponse {
  user: User;
}

export interface LoginFormProps {
  neroApiService: NeroAPIService;
  profileType: ProfileType;
  onForgotPassword: () => void;
  onLoginSuccess: (user: User, rememberMe: boolean) => void;
  onLoginFailed: () => void;
}

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<ServerValidationErrors>({});
  const [tooManyAttempts, setTooManyAttempts] = useState<boolean>(false);
  const [form] = useForm();
  const { profileType, onForgotPassword, onLoginSuccess, onLoginFailed, neroApiService } = props;

  useEffect(() => {
    form.setFields([
      {
        name: 'email',
        errors: serverErrors.username || [],
      },
      {
        name: 'password',
        errors: serverErrors.password || [],
      },
    ]);
  }, [form, serverErrors]);

  return (
    <Form
      form={form}
      className="login-form"
      layout="vertical"
      initialValues={{ remember: true }}
      onValuesChange={() => {
        setFailed(false);
        setInvalidCredentials(false);
        setTooManyAttempts(false);
      }}
      onFinish={(values: FormData) => {
        setSubmitting(true);

        const { password, email, remember } = values;

        neroApiService
          .getAxiosInstance()
          .post<ServerResponse>(
            ENDPOINT_TOKEN_GET,
            {
              username: email,
              password,
              profile_type: profileType,
            },
            {
              'axios-retry': {
                retries: 0, // no retries incase we get a 401
              },
            } as AxiosRequestConfig
          )
          .then((res) => {
            setServerErrors({});
            onLoginSuccess(res.data.user, remember);
          })
          .catch((err: AxiosError) => {
            if (err.response?.status == 400) {
              setServerErrors(err.response.data as ServerValidationErrors);
            } else if (err.response?.status == 401) {
              setInvalidCredentials(true);
            } else if (err.response?.status == 429) {
              setTooManyAttempts(true);
            } else {
              setFailed(true);
            }
            onLoginFailed();
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      <Form.Item
        label={EMAIL}
        name="email"
        rules={[{ required: true, message: ERROR_EMAIL_REQUIRED }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={INPUT_LABEL_PASSWORD}
        name="password"
        rules={[{ required: true, message: ERROR_PASSWORD_REQUIRED }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{INPUT_REMEMBER_ME}</Checkbox>
        </Form.Item>

        <Button
          type="link"
          className="login-form__forgot"
          onClick={() => {
            onForgotPassword();
          }}
        >
          {BUTTON_FORGOT_PASSWORD}
        </Button>
      </Form.Item>

      <Space direction="vertical">
        {serverErrors.non_field_errors && (
          <Alert type="error" message={serverErrors.non_field_errors?.join(' ')} />
        )}
        {failed && <Alert type="error" message={ERROR_GENERIC} />}

        {invalidCredentials && <Alert type="error" message={ERROR_INVALID_CREDENTIALS} />}

        {tooManyAttempts && <Alert type="error" message={ERROR_LOGIN_TOO_MANY_ATTEMPTS} />}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isSubmitting ? LOADING : BUTTON_LABEL_SUBMIT}
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export { LoginForm };
