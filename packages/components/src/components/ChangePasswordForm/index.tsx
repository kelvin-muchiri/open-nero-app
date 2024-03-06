// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Form, notification, Space, Alert, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import {
  BUTTON_LABEL_SUBMIT,
  ERROR_CONFIRM_NEW_PASSWORD_REQUIRED,
  ERROR_GENERIC,
  ERROR_MAX_PASSWORD,
  ERROR_MIN_PASSWORD,
  ERROR_NEW_PASSWORD_REQUIRED,
  ERROR_PASSWORDS_MISMATCH,
  INPUT_LABEL_CONFIRM_NEW_PASSWORD,
  INPUT_LABEL_NEW_PASSWORD,
  LOADING,
  SUCCESS_GENERIC,
} from '../../lang';
import { NeroAPIService } from '@nero/api-service';
import {
  ENDPOINT_CHANGE_PASSWORD,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../constants';

export interface ChangePasswordFormProps {
  neroAPIService: NeroAPIService;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = (props: ChangePasswordFormProps) => {
  const { neroAPIService } = props;
  const [success, setSuccess] = useState<boolean>(false);
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {success && <Alert message={SUCCESS_GENERIC} type="success" closable />}
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          setSubmitting(true);
          neroAPIService
            .getAxiosInstance()
            .post(ENDPOINT_CHANGE_PASSWORD, values)
            .then(() => {
              setSuccess(true);
              form.resetFields();
            })
            .catch(() => {
              setSuccess(false);
              notification.error({ message: ERROR_GENERIC });
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isSubmitting ? LOADING : BUTTON_LABEL_SUBMIT}
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export { ChangePasswordForm };
