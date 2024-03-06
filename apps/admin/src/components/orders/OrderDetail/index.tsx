import {
  Button,
  Col,
  Table,
  Empty,
  Result,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  Form,
  Select,
  notification,
  Card,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ENDPOINT_ORDER_LIST, URL_ORDER_ITEMS } from '../../../configs/constants';
import {
  AMOUNT,
  CREATED_ON,
  CUSTOMER,
  DUE_DATE,
  ERROR_GENERIC,
  ORDER_DETAIL_ITEMS_TITLE,
  ORDER_NUMBER,
  PAID,
  PAYMENT_STATUS,
  STATUS,
  SUCCESS_GENERIC,
  TOPIC,
  UNPAID,
} from '../../../configs/lang';
import { getOrderItemStatusColor, parseOrderItemStatus } from '@nero/utils';
import { OrderItem, OrderItemStatus, OrderStatus } from '@nero/query-api-service';
import { ColumnsType } from 'antd/lib/table';
import { useGetSingleOrderQuery, useUpdateOrderMutation } from '../../../services/api';

const { Title, Text } = Typography;

interface OrderDetailProps {
  orderId: string;
}

const OrderDetail: React.FC<OrderDetailProps> = (props: OrderDetailProps) => {
  const { orderId } = props;
  const {
    data: order,
    error,
    isLoading,
  } = useGetSingleOrderQuery({
    url: ENDPOINT_ORDER_LIST,
    id: orderId,
  });
  const [updateOrder] = useUpdateOrderMutation();
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!order || !orderId) {
    return <Empty />;
  }

  const columns: ColumnsType<OrderItem> = [
    {
      title: TOPIC,
      dataIndex: 'topic',
      key: 'topic',
      render: (topic: string, item) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_ORDER_ITEMS}/${item.id}`);
            }}
          >
            {topic}
          </Button>
        );
      },
    },
    {
      title: DUE_DATE,
      dataIndex: 'due_date',
      key: 'due_date',
      render: (dateString: string, item) => {
        if (!item.due_date) return <span>N/A</span>;

        return (
          <Text type={item.is_overdue ? 'danger' : undefined}>
            {format(new Date(dateString), ' EEE, dd MMM yyyy hh:mm a')}
          </Text>
        );
      },
    },
    {
      title: STATUS,
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderItemStatus) => {
        return <Tag color={getOrderItemStatusColor(status)}>{parseOrderItemStatus(status)}</Tag>;
      },
    },
  ];
  const handleStatusChange = (value: OrderStatus) => {
    updateOrder({ url: ENDPOINT_ORDER_LIST, id: order.id, data: { status: value } })
      .unwrap()
      .then(() => {
        notification.success({ message: SUCCESS_GENERIC });
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  };

  return (
    <>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={4}>{`${ORDER_NUMBER} ${order.id}`}</Title>
          <Card>
            <Row justify="space-between">
              <Col xs={24} sm={24} md={6}>
                <Form layout="vertical">
                  <Form.Item label={PAYMENT_STATUS}>
                    <Select value={order.status} onChange={handleStatusChange}>
                      <Select.Option value={OrderStatus.PAID}>
                        <span>{PAID}</span>
                      </Select.Option>
                      <Select.Option value={OrderStatus.UNPAID}>
                        <span>{UNPAID}</span>
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} sm={24} md={6}>
                <Space direction="vertical">
                  <span className="text--meta">
                    {CUSTOMER}: {order.owner?.full_name}
                  </span>
                  <span className="text--meta">{`${CREATED_ON}: ${format(
                    new Date(order.created_at),
                    'EEE, dd MMM yyyy hh:mm a'
                  )}`}</span>
                  <span className="text--meta">
                    {AMOUNT}: ${order.amount_payable}
                  </span>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
        <Text strong>
          {ORDER_DETAIL_ITEMS_TITLE} {order.id}
        </Text>
      </Space>
      <div className="nero-table-responsive">
        <Table
          className="admin-layout-table"
          dataSource={order.items}
          columns={columns}
          size="small"
          pagination={false}
        />
      </div>
    </>
  );
};

export { OrderDetail };
