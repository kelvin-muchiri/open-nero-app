// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Form, Input, Button, Space, Alert } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { NeroAPIService } from '@nero/api-service';
import { ENDPOINT_RESET_PASSWORD_START } from '../../constants';
import { ProfileType } from '@nero/query-api-service';
import { useState } from 'react';
import {
  BUTTON_LABEL_SUBMIT,
  LOADING,
  ERROR_EMAIL_INVALID,
  ERROR_EMAIL_REQUIRED,
  ERROR_GENERIC,
  EMAIL,
  SUCCESS_RESET_PASSWORD_START,
} from '../../lang';

export interface ForgotPasswordFormProps {
  profileType: ProfileType;
  neroAPIService: NeroAPIService;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = (props: ForgotPasswordFormProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [form] = useForm();
  const { profileType, neroAPIService } = props;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {success && <Alert message={SUCCESS_RESET_PASSWORD_START} />}
      {failed && <Alert message={ERROR_GENERIC} />}
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => {
          if (success) {
            setSuccess(false);
          }

          if (failed) {
            setFailed(false);
          }
        }}
        onFinish={(values) => {
          setSubmitting(true);

          neroAPIService
            .getAxiosInstance()
            .post(ENDPOINT_RESET_PASSWORD_START, { ...values, profile_type: profileType })
            .then(() => {
              setSuccess(true);
              form.resetFields();
            })
            .catch(() => {
              setFailed(true);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        <Form.Item
          label={EMAIL}
          name="email"
          rules={[
            { required: true, message: ERROR_EMAIL_REQUIRED },
            { type: 'email', message: ERROR_EMAIL_INVALID },
          ]}
        >
          <Input />
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

export { ForgotPasswordForm };
