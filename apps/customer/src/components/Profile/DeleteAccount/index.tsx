import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Alert, Button, Form, Input, notification, Space } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@nero/auth';
import { ENDPOINT_DELETE_ACCOUNT } from '../../../configs/constants';
import {
  BUTTON_DELETE_ACCOUNT,
  LOADING,
  ERROR_GENERIC,
  ERROR_INCORRECT_PASSWORD,
  ERROR_PASSWORD_REQUIRED,
  INPUT_LABEL_DELETE_ACCOUNT_PASSWORD,
} from '../../../configs/lang';
import { apiService } from '../../../services/api';

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [incorrectPassword, setIncorrectPassword] = useState<boolean>(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {incorrectPassword && <Alert type="error" message={ERROR_INCORRECT_PASSWORD} />}
      <Form
        layout="vertical"
        onValuesChange={() => {
          if (incorrectPassword) {
            setIncorrectPassword(false);
          }
        }}
        onFinish={(values) => {
          setSubmitting(true);
          apiService
            .getAxiosInstance()
            .post(ENDPOINT_DELETE_ACCOUNT, values)
            .then(() => {
              dispatch(logout());
            })
            .catch((error: FetchBaseQueryError) => {
              if (error.status == 400) {
                setIncorrectPassword(true);
              } else {
                notification.error({ message: ERROR_GENERIC });
              }
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        <Form.Item
          name="password"
          label={INPUT_LABEL_DELETE_ACCOUNT_PASSWORD}
          rules={[
            {
              required: true,
              message: ERROR_PASSWORD_REQUIRED,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" danger htmlType="submit">
            {isSubmitting ? LOADING : BUTTON_DELETE_ACCOUNT}
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export { DeleteAccount };
