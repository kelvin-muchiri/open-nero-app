import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Skeleton, Result, Row, Col, Typography, Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_ORDER_LIST, URL_ORDERS } from '../../../configs/constants';
import {
  AMOUNT,
  CREATED_ON,
  CUSTOMER,
  EARLIEST_DUE_DATE,
  ERROR_GENERIC,
  IS_PAID,
  NUM_ITEMS,
  ORDERS,
  ORDER_ID,
} from '../../../configs/lang';
import { OrderListItem, OrderStatus } from '@nero/query-api-service';
import { formatDate } from '@nero/utils';
import { useGetOrdersQuery } from '../../../services/api';

const { Title } = Typography;

const OrderList = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, error } = useGetOrdersQuery({
    url: ENDPOINT_ORDER_LIST,
    params: { page },
  });
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<OrderListItem> = [
    {
      title: ORDER_ID,
      dataIndex: 'id',
      key: 'id',
      render: (id: string, order) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_ORDERS}/${order.id}`);
            }}
          >
            {id}
          </Button>
        );
      },
    },
    {
      title: CUSTOMER,
      dataIndex: 'owner',
      key: 'owner',
      render: (_: string, order) => {
        return order.owner?.full_name;
      },
    },
    {
      title: AMOUNT,
      dataIndex: 'amount_payble',
      key: 'amount_payble',
      render: (_: string, order) => {
        return `$${order.amount_payable}`;
      },
    },
    {
      title: NUM_ITEMS,
      dataIndex: 'no_of_items',
      key: 'no_of_items',
    },
    {
      title: IS_PAID,
      key: 'is_paid',
      render: (_: string, order) => {
        return (
          <>
            {order.status == OrderStatus.PAID ? (
              <CheckCircleFilled style={{ color: '#389e0d' }} />
            ) : (
              <CloseCircleFilled style={{ color: '#cf1322' }} />
            )}
          </>
        );
      },
    },
    {
      title: EARLIEST_DUE_DATE,
      dataIndex: 'earliest_due',
      key: 'earliest_due',
      render: (dateString: string) => {
        if (!dateString) {
          return 'N/A';
        }
        return formatDate(dateString);
      },
    },
    {
      title: CREATED_ON,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (dateString: string) => {
        return formatDate(dateString);
      },
    },
  ];

  return (
    <>
      <Row justify="space-between">
        <Col xs={24} md={8}>
          <Title level={3}>{ORDERS}</Title>
        </Col>
      </Row>

      <div className="nero-table-responsive">
        <Table
          className="admin-layout-table"
          dataSource={data.results}
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
    </>
  );
};

export { OrderList };
