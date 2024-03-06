import {
  Skeleton,
  Row,
  Col,
  Typography,
  Empty,
  Divider,
  Button,
  Tag,
  Space,
  Result,
  Tooltip,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './style.css';
import { ENDPOINT_SELF_ORDERS, URL_MAKE_PAYMENT } from '../../../configs/constants';
import {
  BUTTON_PAY,
  BUTTON_PAY_TOOL_TIP,
  CREATED_ON,
  ERROR_GENERIC,
  ORDER_NUMBER,
} from '../../../configs/lang';
import { getOrderStatusColor, parseOrderStatus } from '@nero/utils';
import { OrderStatus } from '@nero/query-api-service';
import { OrderItemDetail } from './OrderItemDetail';
import { useGetSingleOrderQuery } from '../../../services/api';

const { Title } = Typography;

interface OrderDetailProps {
  orderId: string;
}

const OrderDetail: React.FC<OrderDetailProps> = (props: OrderDetailProps) => {
  const { orderId } = props;
  const { data, error, isLoading } = useGetSingleOrderQuery({
    url: ENDPOINT_SELF_ORDERS,
    id: orderId,
  });
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!data || !orderId) {
    return <Empty />;
  }

  return (
    <div className="order-detail">
      <Row justify="space-between">
        <Col xs={24} md={8}>
          <Title level={4}>{`${ORDER_NUMBER} ${data.id}`}</Title>
          <Space direction="vertical">
            <Tag color={getOrderStatusColor(data.status)}>{parseOrderStatus(data.status)}</Tag>
            {data.status == OrderStatus.UNPAID && (
              <span className="order-detail__status-help-text text--meta">
                {BUTTON_PAY_TOOL_TIP}
              </span>
            )}
            <span className="text--meta">{`${CREATED_ON} ${format(
              new Date(data.created_at),
              'dd MMM yyyy'
            )}`}</span>
          </Space>
        </Col>
        {data.status == OrderStatus.UNPAID && (
          <Col xs={24} md={8}>
            <Tooltip placement="left" title={BUTTON_PAY_TOOL_TIP}>
              <Button
                className="order-detail__btn_pay"
                type="primary"
                danger
                onClick={() => {
                  navigate(URL_MAKE_PAYMENT, { state: { orderId } });
                }}
              >
                {BUTTON_PAY}
              </Button>
            </Tooltip>
          </Col>
        )}
      </Row>
      <Divider />
      <Row gutter={16}>
        {data.items.map((item, i) => (
          <Col key={i} className="order-detail__item" xs={24} md={data.items.length > 1 ? 12 : 24}>
            <OrderItemDetail item={item} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export { OrderDetail };
