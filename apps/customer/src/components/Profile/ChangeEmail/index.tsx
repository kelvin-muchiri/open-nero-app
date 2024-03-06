import { Result, Skeleton, Form, Button, Input, notification } from 'antd';
import { useState } from 'react';
import { ENDPOINT_PROFILE } from '../../../configs/constants';
import {
  BUTTON_LABEL_SUBMIT,
  LOADING,
  EMAIL,
  EMAIL_VERIFICATION_SENT,
  ERROR_EMAIL_INVALID,
  ERROR_EMAIL_REQUIRED,
  ERROR_GENERIC,
  SUCCESS_GENERIC,
  TOOLTIP_EMAIL_VERIFICATION_EDIT,
  TRY_AGAIN_LATER,
} from '../../../configs/lang';
import { emailExistsValidator } from '../../../helpers/validators';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../../services/api';

export interface ChangeEmailFormValues {
  email: string;
}

const ChangeEmail = () => {
  const { data: profile, isLoading, error } = useGetProfileQuery(ENDPOINT_PROFILE);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [updateProfile] = useUpdateProfileMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !profile) {
    return <Result status="error" title={ERROR_GENERIC} subTitle={TRY_AGAIN_LATER} />;
  }

  const { email } = profile;

  return (
    <Form<ChangeEmailFormValues>
      layout="vertical"
      initialValues={{ email }}
      onValuesChange={() => {
        if (!enableSubmit) {
          setEnableSubmit(true);
        }
      }}
      onFinish={(values) => {
        updateProfile({ url: ENDPOINT_PROFILE, data: { email: values.email } })
          .unwrap()
          .then(() => {
            setEnableSubmit(false);
            notification.success({
              message: SUCCESS_GENERIC,
              description: EMAIL_VERIFICATION_SENT,
              duration: 0,
            });
          })
          .catch(() => {
            notification.error({ message: ERROR_GENERIC, description: TRY_AGAIN_LATER });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      <Form.Item
        validateTrigger="onBlur"
        validateFirst={true}
        label={EMAIL}
        name="email"
        tooltip={TOOLTIP_EMAIL_VERIFICATION_EDIT}
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
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!enableSubmit}>
          {isSubmitting ? LOADING : BUTTON_LABEL_SUBMIT}
        </Button>
      </Form.Item>
    </Form>
  );
};

export { ChangeEmail };
