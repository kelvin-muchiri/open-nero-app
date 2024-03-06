// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Button, Form, Input, Space, Alert } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import {
  ENDPOINT_RESET_PASSWORD_END,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../constants';
import {
  BUTTON_LABEL_SUBMIT,
  LOADING,
  ERROR_CONFIRM_NEW_PASSWORD_REQUIRED,
  ERROR_GENERIC,
  ERROR_MAX_PASSWORD,
  ERROR_MIN_PASSWORD,
  ERROR_NEW_PASSWORD_REQUIRED,
  ERROR_PASSWORDS_MISMATCH,
  INPUT_LABEL_CONFIRM_NEW_PASSWORD,
  INPUT_LABEL_NEW_PASSWORD,
} from '../../lang';
import { NeroAPIService } from '@nero/api-service';

interface ServerValidationErrors {
  non_field_errors?: string[];
  new_password1?: string[];
  new_password2?: string[];
}

export interface ResetPasswordFormProps {
  uidb64: string;
  token: string;
  onSuccess: () => void;
  onInvalidCredentials: () => void;
  neroAPIService: NeroAPIService;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = (props: ResetPasswordFormProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const { uidb64, token, onSuccess, onInvalidCredentials } = props;
  const [form] = useForm();
  const [serverErrors, setServerErrors] = useState<ServerValidationErrors>({});
  const [failed, setFailed] = useState<boolean>(false);
  const { neroAPIService } = props;

  useEffect(() => {
    form.setFields([
      {
        name: 'password',
        errors: serverErrors.new_password1 || [],
      },
      {
        name: 'confirm_password',
        errors: serverErrors.new_password2 || [],
      },
    ]);
  }, [form, serverErrors]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values: { password: string; confirm_password: string }) => {
        setSubmitting(true);

        const { password, confirm_password } = values;

        neroAPIService
          .getAxiosInstance()
          .post(ENDPOINT_RESET_PASSWORD_END, {
            uidb64,
            token,
            new_password1: password,
            new_password2: confirm_password,
          })
          .then(() => {
            onSuccess();
          })
          .catch((err: AxiosError) => {
            if (err.response?.status == 400) {
              const validationErrors = err.response.data as ServerValidationErrors;

              if (
                validationErrors.non_field_errors &&
                validationErrors.non_field_errors[0] == 'Invalid activation credentials'
              ) {
                onInvalidCredentials();
              } else {
                setServerErrors(validationErrors);
              }
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
        name="password"
        label={INPUT_LABEL_NEW_PASSWORD}
        rules={[
          {
            required: true,
            message: ERROR_NEW_PASSWORD_REQUIRED,
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
        label={INPUT_LABEL_CONFIRM_NEW_PASSWORD}
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: ERROR_CONFIRM_NEW_PASSWORD_REQUIRED,
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
      <Space direction="vertical">
        {serverErrors.non_field_errors && (
          <Alert type="error" message={serverErrors.non_field_errors?.join(' ')} />
        )}
        {failed && <Alert type="error" message={ERROR_GENERIC} />}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isSubmitting ? LOADING : BUTTON_LABEL_SUBMIT}
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export { ResetPasswordForm };
