import {
  Row,
  Col,
  Typography,
  Button,
  Table,
  Space,
  Result,
  Skeleton,
  Empty,
  Tag,
  Alert,
} from 'antd';
import { format } from 'date-fns';
import './style.css';
import {
  ACTIONS,
  BUTTON_NEW_ORDER,
  DATE_ORDERED,
  COLUMN_ACTION_DOWNLOAD,
  EARLIEST_DUE_DATE,
  ORDER_HISTORY,
  ORDER_ID,
  STATUS,
  COLUMN_ACTION_PAY,
  COLUMN_ACTION_VIEW,
  ERROR_GENERIC,
} from '../../../configs/lang';
import {
  ENDPOINT_SELF_ORDERS,
  URL_MAKE_PAYMENT,
  URL_ORDER_HISTORY,
  URL_PLACE_ORDER,
} from '../../../configs/constants';
import { SelfOrderListItem, OrderStatus } from '@nero/query-api-service';
import { useState } from 'react';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import { getOrderStatusColor, parseOrderStatus } from '@nero/utils';
import { useNavigate } from 'react-router-dom';
import { useGetSelfOrdersQuery } from '../../../services/api';
import { useAppSelector } from '../../../store/hooks';

const { Title } = Typography;

const OrderHistory = () => {
  const [page, setPage] = useState<number>(1);
  const { data, error, isLoading } = useGetSelfOrdersQuery({
    url: ENDPOINT_SELF_ORDERS,
    params: { page },
  });
  const navigate = useNavigate();
  const config = useAppSelector((state) => state.config);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!data) {
    return <Empty />;
  }

  const columns = [
    {
      title: ORDER_ID,
      dataIndex: 'id',
      key: 'id',
      render: (id: string | number) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_ORDER_HISTORY}/${id}`);
            }}
          >
            {id}
          </Button>
        );
      },
    },
    {
      title: STATUS,
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => {
        return <Tag color={getOrderStatusColor(status)}>{parseOrderStatus(status)}</Tag>;
      },
    },
    {
      title: DATE_ORDERED,
      dataIndex: 'created_at',
      key: 'created_at',
      responsive: ['md'] as Breakpoint[],
      render: (dateString: string) => {
        return format(new Date(dateString), 'dd MMM yyyy');
      },
    },
    {
      title: EARLIEST_DUE_DATE,
      dataIndex: 'earliest_due',
      key: 'earliest_due',
      responsive: ['md'] as Breakpoint[],
      render: (dateString: string) => {
        if (dateString) {
          return format(new Date(dateString), 'dd MMM yyyy');
        }
        return null;
      },
    },
    {
      title: ACTIONS,
      key: 'actions',
      responsive: ['md'] as Breakpoint[],
      render: (_: string, order: SelfOrderListItem) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                navigate(`${URL_ORDER_HISTORY}/${order.id}`);
              }}
            >
              {order.status == OrderStatus.PAID ? COLUMN_ACTION_DOWNLOAD : COLUMN_ACTION_VIEW}
            </Button>
            {order.status == OrderStatus.UNPAID && (
              <Button
                type="link"
                onClick={() => {
                  navigate(URL_MAKE_PAYMENT, { state: { orderId: order.id } });
                }}
              >
                {COLUMN_ACTION_PAY}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="order-history">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row justify="space-between">
          <Col xs={24} md={8}>
            <Title level={3}>{ORDER_HISTORY}</Title>
          </Col>
          <Col xs={24} md={8}>
            <Button
              className="order-history__btn_new_order"
              type="primary"
              onClick={() => {
                navigate(URL_PLACE_ORDER);
              }}
            >
              {BUTTON_NEW_ORDER}
            </Button>
          </Col>
        </Row>
        {data?.count > 0 && config.attachmentEmail && (
          <Alert
            type="info"
            message={
              <>
                <p>
                  Send your attachments to <strong>{config.attachmentEmail}</strong> after placing
                  your order.
                </p>
                <p>Use the order ID generated as the email subject</p>
              </>
            }
          />
        )}
      </Space>
      <Table
        className="order-history__table"
        dataSource={data?.results}
        columns={columns}
        size="small"
        pagination={{
          hideOnSinglePage: true,
          total: data?.count,
          defaultCurrent: page,
          pageSize: data?.page_size,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </div>
  );
};

export { OrderHistory };
