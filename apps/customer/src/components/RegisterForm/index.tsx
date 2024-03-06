import { useCallback, useEffect, useState } from 'react';
import { Form, Input, Button, Alert, Space } from 'antd';
import {
  BUTTON_LABEL_SUBMIT,
  ERROR_CONFIRM_PASSWORD_REQUIRED,
  ERROR_EMAIL_REQUIRED,
  ERROR_PASSWORD_REQUIRED,
  EMAIL,
  FULL_NAME,
  INPUT_LABEL_PASSWORD,
  INPUT_LABEL_CONFIRM_PASSWORD,
  TOOLTIP_EMAIL_VERIFICATION,
  ERROR_PASSWORDS_MISMATCH,
  LOADING,
  ERROR_MIN_PASSWORD,
  ERROR_MAX_PASSWORD,
  ERROR_FULL_NAME_MAX,
  ERROR_FULL_NAME_REQUIRED,
  ERROR_EMAIL_INVALID,
  SUCCESS_REGISTER_TITLE,
  BUTTON_LABEL_REGISTER_COMPLETE,
  ERROR_GENERIC,
  SIGN_IN,
  REGISTER_FORM_LOGIN_LINK,
  ERROR_FULL_NAME_INVALID,
} from '../../configs/lang';
import { AxiosError } from 'axios';
import {
  ENDPOINT_REGISTER,
  MAX_FULL_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../configs/constants';
import { useNavigate } from 'react-router-dom';
import { emailExistsValidator } from '../../helpers/validators';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { verifyRecaptcha } from './utils';
import { apiService } from '../../services/api';

interface FormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface ServerValidationErrors {
  non_field_errors?: string[];
  email?: string[];
  full_name?: string[];
  password?: string[];
  confirm_password?: string[];
}

export interface RegisterFormProps {
  urlSignIn: string;
}

const RegisterForm: React.FC<RegisterFormProps> = (props: RegisterFormProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<ServerValidationErrors>({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fields = ['full_name', 'email', 'password', 'confirm_password'].map((field) => {
      return {
        name: field,
        errors: serverErrors[field as keyof ServerValidationErrors] || [],
      };
    });

    form.setFields(fields);
  }, [form, serverErrors]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      // Execute recaptcha not yet available
      return;
    }

    return executeRecaptcha('customer_register');
  }, [executeRecaptcha]);

  const { urlSignIn } = props;

  return (
    <>
      {isSuccess ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            type="success"
            showIcon
            message={SUCCESS_REGISTER_TITLE}
            style={{ width: '100%' }}
          />
          <Button
            type="link"
            onClick={() => {
              navigate(urlSignIn);
            }}
          >
            {BUTTON_LABEL_REGISTER_COMPLETE}
          </Button>
        </Space>
      ) : (
        <Form
          form={form}
          validateTrigger="onBlur"
          layout="vertical"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onFinish={async (values: FormData) => {
            setSubmitting(true);

            const token = await handleReCaptchaVerify();

            if (!token) {
              setFailed(true);
              setSubmitting(false);
              return;
            }

            const isCaptchaValid = await verifyRecaptcha(token);

            if (!isCaptchaValid) {
              setFailed(true);
              setSubmitting(false);
              return;
            }

            const { full_name, password, confirm_password, email } = values;

            apiService
              .getAxiosInstance()
              .post(ENDPOINT_REGISTER, {
                full_name,
                password,
                confirm_password,
                email,
              })
              .then(() => {
                form.resetFields();
                setServerErrors({});
                setSuccess(true);
              })
              .catch((err: AxiosError) => {
                if (err.response?.status == 400) {
                  setServerErrors(err.response.data as ServerValidationErrors);
                } else {
                  setFailed(true);
                }
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          <Form.Item
            label={FULL_NAME}
            name="full_name"
            rules={[
              { required: true, message: ERROR_FULL_NAME_REQUIRED },
              {
                max: MAX_FULL_NAME_LENGTH,
                message: ERROR_FULL_NAME_MAX,
              },
              {
                pattern: new RegExp(/^[a-z\s]+(?:['-.][a-z]+)*$/i),
                message: ERROR_FULL_NAME_INVALID,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            validateTrigger="onBlur"
            validateFirst={true}
            label={EMAIL}
            name="email"
            tooltip={TOOLTIP_EMAIL_VERIFICATION}
            rules={[
              { required: true, message: ERROR_EMAIL_REQUIRED },
              { type: 'email', message: ERROR_EMAIL_INVALID },
              {
                validator: async (_, value: string) => {
                  return await emailExistsValidator(value);
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={INPUT_LABEL_PASSWORD}
            rules={[
              {
                required: true,
                message: ERROR_PASSWORD_REQUIRED,
              },
              {
                min: MIN_PASSWORD_LENGTH,
                message: ERROR_MIN_PASSWORD,
              },
              {
                max: MAX_PASSWORD_LENGTH,
                message: ERROR_MAX_PASSWORD,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label={INPUT_LABEL_CONFIRM_PASSWORD}
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: ERROR_CONFIRM_PASSWORD_REQUIRED,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(ERROR_PASSWORDS_MISMATCH));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className="google-recaptcha-branding">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
            <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </div>
          <Space direction="vertical">
            {serverErrors.non_field_errors && (
              <Alert type="error" message={serverErrors.non_field_errors?.join(' ')} />
            )}
            {failed && <Alert type="error" message={ERROR_GENERIC} />}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isSubmitting ? LOADING : BUTTON_LABEL_SUBMIT}
              </Button>
              <br />
              {REGISTER_FORM_LOGIN_LINK}
              <Button
                type="link"
                onClick={() => {
                  navigate(urlSignIn);
                }}
              >
                {SIGN_IN}
              </Button>
            </Form.Item>
          </Space>
        </Form>
      )}
    </>
  );
};

export { RegisterForm };
