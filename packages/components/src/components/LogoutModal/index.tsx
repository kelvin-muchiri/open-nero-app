// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { useState } from 'react';
import { Modal, notification } from 'antd';
import { ENDPOINT_LOGOUT } from '../../constants';
import {
  ERROR_GENERIC,
  LOGOUT,
  LOGOUT_BUTTON_CONFIRM,
  LOGOUT_CONFIRM,
  TRY_AGAIN_LATER,
} from '../../lang';
import { logout } from '@nero/auth';
import { NeroAPIService } from '@nero/api-service';
import { useDispatch } from 'react-redux';

export interface LogoutProps {
  onSuccess: () => void;
  children: React.ReactNode;
  neroAPIService: NeroAPIService;
}

const LogoutModal: React.FC<LogoutProps> = (props: LogoutProps) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { onSuccess, children, neroAPIService } = props;
  const dispatch = useDispatch();

  const handleOk = () => {
    setConfirmLoading(true);

    neroAPIService
      .getAxiosInstance()
      .post(ENDPOINT_LOGOUT, {})
      .then(() => {
        dispatch(logout());
        onSuccess();
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC, description: TRY_AGAIN_LATER });
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <>
      <div onClick={() => setVisible(true)}>{children}</div>
      <Modal
        title={LOGOUT}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        okText={LOGOUT_BUTTON_CONFIRM}
      >
        {LOGOUT_CONFIRM}
      </Modal>
    </>
  );
};

export { LogoutModal };
