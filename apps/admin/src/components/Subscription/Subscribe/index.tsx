import { Card, Typography, Row, Col, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { URL_PAY_SUBSCRIPTION } from '../../../configs/constants';
import { PAYPAL_BASIC_PLAN_ID, PAYPAL_BASIC_PLAN_WITH_TRIAL_ID } from '../../../configs/envs';
import {
  MONTHLY,
  MONTHLY_PER_MONTH,
  MONTHLY_PLAN_DESCRIPTION,
  MONTHLY_PLAN_DESCRIPTION_IS_TRIAL,
  SUBSCRIBE,
  SUBSCRIBE_TITLE,
  SUBSCRIBE_TITLE_IS_TRIAL,
} from '../../../configs/lang';
const { Title } = Typography;

export interface SubscribeProps {
  isOnTrial?: boolean; // whether to subscribe to plan with trial or not
}

const Subscribe: React.FC<SubscribeProps> = (props: SubscribeProps) => {
  const navigate = useNavigate();
  const handleSubscribe = (planId: string) => {
    navigate(URL_PAY_SUBSCRIPTION, { state: { planId } });
  };
  const { isOnTrial } = props;

  return (
    <>
      <Title level={1}>{isOnTrial ? SUBSCRIBE_TITLE_IS_TRIAL : SUBSCRIBE_TITLE}</Title>
      <Row>
        <Col md={{ span: 8, offset: 8 }} xs={24} sm={24}>
          <Card title={MONTHLY} extra={MONTHLY_PER_MONTH}>
            <Space direction="vertical">
              <p>{isOnTrial ? MONTHLY_PLAN_DESCRIPTION_IS_TRIAL : MONTHLY_PLAN_DESCRIPTION}</p>
              <Button
                type="primary"
                onClick={() =>
                  handleSubscribe(
                    isOnTrial ? PAYPAL_BASIC_PLAN_WITH_TRIAL_ID : PAYPAL_BASIC_PLAN_ID
                  )
                }
              >
                {SUBSCRIBE}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export { Subscribe };
