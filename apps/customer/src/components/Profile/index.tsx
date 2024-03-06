import { useState } from 'react';
import { Result, Skeleton, Empty, Form, Input, Button, notification, Alert, Space } from 'antd';
import './style.css';
import {
  ENDPOINT_PROFILE,
  ENDPOINT_RESEND_EMAIL_VERIFICATION,
  URL_DELETE_ACCOUNT,
} from '../../configs/constants';
import {
  ERROR_FIRST_NAME_REQUIRED,
  ERROR_GENERIC,
  ERROR_NAME_MAX,
  INPUT_LABEL_FIRST_NAME,
  INPUT_LABEL_LAST_NAME,
  EMAIL,
  TOOLTIP_EMAIL_VERIFICATION,
  ERROR_EMAIL_REQUIRED,
  ERROR_EMAIL_INVALID,
  BUTTON_LABEL_SUBMIT,
  LOADING,
  SUCCESS_GENERIC,
  EMAIL_VERIFICATION_SENT,
  ERROR_FIRST_NAME_INVALID,
  ERROR_LAST_NAME_INVALID,
  DELETE_ACCOUNT,
  RESEND_LINK,
  TRY_AGAIN_LATER,
  SUCCESS_EMAIL_LINK_RESENT,
} from '../../configs/lang';
import { emailExistsValidator } from '../../helpers/validators';
import { UpdateProfileData } from '@nero/query-api-service';
import { useNavigate } from 'react-router-dom';
import { apiService, useGetProfileQuery, useUpdateProfileMutation } from '../../services/api';

export interface ProfileFormValues {
  first_name: string;
  last_name: string;
  email: string;
}

const Profile = () => {
  const { data, isLoading, error } = useGetProfileQuery(ENDPOINT_PROFILE);
  const [updateProfile] = useUpdateProfileMutation();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [emailChanged, setEmailChanged] = useState<boolean>(false);
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!data) {
    return <Empty />;
  }

  const { first_name, last_name, email } = data;

  return (
    <div className="profile">
      <Space direction="vertical" style={{ width: '100%' }}>
        {success && (
          <Space direction="vertical">
            <Alert
              className="profile__alert"
              message={SUCCESS_GENERIC}
              type="success"
              closable
              description={emailChanged ? EMAIL_VERIFICATION_SENT : null}
            />
            {emailChanged && (
              <Button
                type="link"
                onClick={() => {
                  apiService
                    .getAxiosInstance()
                    .get(ENDPOINT_RESEND_EMAIL_VERIFICATION)
                    .then(() => {
                      notification.success({ message: SUCCESS_EMAIL_LINK_RESENT });
                    })
                    .catch(() => {
                      notification.error({ message: ERROR_GENERIC, description: TRY_AGAIN_LATER });
                    });
                }}
              >
                {RESEND_LINK}
              </Button>
            )}
          </Space>
        )}

        <Form
          layout="vertical"
          initialValues={{ first_name, last_name, email }}
          onValuesChange={() => {
            if (!enableSubmit) {
              setEnableSubmit(true);
            }
          }}
          onFinish={(values: ProfileFormValues) => {
            if (values.email != email) {
              setEmailChanged(true);
            }
            setSubmitting(true);
            updateProfile({ url: ENDPOINT_PROFILE, data: values as UpdateProfileData })
              .unwrap()
              .then(() => {
                setEnableSubmit(false);
                setSuccess(true);
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
            name="first_name"
            label={INPUT_LABEL_FIRST_NAME}
            rules={[
              { required: true, message: ERROR_FIRST_NAME_REQUIRED },
              { max: 35, message: ERROR_NAME_MAX },
              {
                pattern: new RegExp(/^[a-z]+(?:['-.][a-z]+)*$/i),
                message: ERROR_FIRST_NAME_INVALID,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label={INPUT_LABEL_LAST_NAME}
            rules={[
              { max: 35, message: ERROR_NAME_MAX },
              {
                pattern: new RegExp(/^[a-z]+(?:['-.][a-z]+)*$/i),
                message: ERROR_LAST_NAME_INVALID,
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
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!enableSubmit}>
              {isSubmitting ? LOADING : BUTTON_LABEL_SUBMIT}
            </Button>
          </Form.Item>
        </Form>
        <Button
          className="profile__btn-delete-account"
          danger
          onClick={() => {
            navigate(URL_DELETE_ACCOUNT);
          }}
        >
          {DELETE_ACCOUNT}
        </Button>
      </Space>
    </div>
  );
};

export { Profile };
