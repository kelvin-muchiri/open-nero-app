import { CheckCircleFilled, CloseCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { Col, Result, Row, Skeleton, Typography, Table, Tag, Button, Space, message } from 'antd';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  ENDPOINT_ORDER_ITEMS,
  SEARCH_ITEM_STATUS,
  URL_ORDERS,
  URL_ORDER_ITEMS,
} from '../../../configs/constants';
import {
  ERROR_GENERIC,
  TOPIC,
  CUSTOMER,
  ORDER_ID,
  IS_PAID,
  STATUS,
  DUE_DATE,
  REFRESH,
  DATA_UPDATED,
  ORDER_ITEMS,
} from '../../../configs/lang';
import { OrderItem, OrderItemStatus, OrderStatus } from '@nero/query-api-service';
import { ColumnsType } from 'antd/lib/table';
import { getOrderItemStatusColor, parseOrderItemStatus, useQueryParams } from '@nero/utils';
import { useNavigate } from 'react-router-dom';
import { PrimaryFilters, PrimaryFilterType } from './PrimaryFilters';
import { parseQueryParams } from './utils';
import { useGetOrderItemsQuery } from '../../../services/api';

const { Title, Text } = Typography;

const OrderItemList = () => {
  const [page, setPage] = useState<number>(1);
  const queryParams = useQueryParams();
  const { data, isLoading, error, refetch } = useGetOrderItemsQuery({
    url: ENDPOINT_ORDER_ITEMS,
    params: { ...parseQueryParams(queryParams), page },
  });
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<OrderItem> = [
    {
      title: TOPIC,
      dataIndex: 'topic',
      key: 'topic',
      render: (topic: string, item: OrderItem) => {
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
      title: ORDER_ID,
      dataIndex: 'order_id',
      key: 'order_id',
      render: (_: string, item: OrderItem) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_ORDERS}/${item.order.id}`);
            }}
          >
            {item.order.id}
          </Button>
        );
      },
    },
    {
      title: IS_PAID,
      dataIndex: 'is_paid',
      key: 'is_paid',
      render: (_: string, item: OrderItem) => {
        return (
          <>
            {item.order.status == OrderStatus.PAID ? (
              <CheckCircleFilled style={{ color: '#389e0d' }} />
            ) : (
              <CloseCircleFilled style={{ color: '#cf1322' }} />
            )}
          </>
        );
      },
    },
    {
      title: DUE_DATE,
      dataIndex: 'due_date',
      key: 'due_date',
      render: (dateString: string, item: OrderItem) => {
        if (!item.due_date) return <span>N/A</span>;

        return (
          <Text type={item.is_overdue ? 'danger' : undefined}>
            {format(new Date(dateString), ' EEE, dd MMM yyyy hh:mm a')}
          </Text>
        );
      },
    },
    {
      title: CUSTOMER,
      dataIndex: 'owner',
      key: 'customer',
      render: (_: string, item: OrderItem) => {
        return item.order.owner?.full_name;
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
  const queryParamStatus = queryParams.get(SEARCH_ITEM_STATUS);

  return (
    <>
      <Row justify="space-between">
        <Col xs={24} md={8}>
          <Title level={3}>{ORDER_ITEMS}</Title>
        </Col>
      </Row>

      <Space direction="vertical" style={{ width: '100%' }}>
        <PrimaryFilters
          active={queryParamStatus ? (queryParamStatus as PrimaryFilterType) : 'all'}
          onFilterSelected={(filterType) => {
            if (filterType == 'all') {
              navigate(URL_ORDER_ITEMS);
            } else {
              navigate({
                pathname: URL_ORDER_ITEMS,
                search: `?${SEARCH_ITEM_STATUS}=${filterType}`,
              });
            }
          }}
        />
        <Row>
          <Col span={24}>
            <Button
              size="small"
              className="admin-table-header-actions"
              icon={<ReloadOutlined />}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                refetch();
                await message.success(DATA_UPDATED);
              }}
            >
              {REFRESH}
            </Button>
          </Col>
        </Row>
      </Space>

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

export { OrderItemList };
