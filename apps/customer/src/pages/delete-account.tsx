import { Row, Col, Typography, Divider, Result, Button } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { DeleteAccount } from '../components/Profile/DeleteAccount';
import { URL_ACCOUNT } from '../configs/constants';
import { DELETE_ACCOUNT } from '../configs/lang';

const { Title } = Typography;

const DeleteAccountPage = () => {
  const [isConfirmed, setConfirmed] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>{DELETE_ACCOUNT}</title>
      </Helmet>
      <Title level={4}>{DELETE_ACCOUNT}</Title>
      <Divider />
      <Row>
        {!isConfirmed && (
          <Col>
            <Result
              status="warning"
              title="Your account will be permanently deleted"
              subTitle="Are you sure you want to delete your account? Your profile will be permanently deleted and your no longer have access to your data"
              extra={[
                <Button
                  type="default"
                  key="delete"
                  onClick={() => {
                    setConfirmed(true);
                  }}
                >
                  Yes, delete my account
                </Button>,
                <Button
                  type="primary"
                  key="cancel"
                  onClick={() => {
                    navigate(URL_ACCOUNT);
                  }}
                >
                  Cancel
                </Button>,
              ]}
            />
          </Col>
        )}
        {isConfirmed && (
          <Col md={12} xs={24}>
            <DeleteAccount />
          </Col>
        )}
      </Row>
    </>
  );
};

export { DeleteAccountPage as default };
