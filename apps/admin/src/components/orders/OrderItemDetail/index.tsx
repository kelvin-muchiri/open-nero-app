import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  notification,
  Popconfirm,
  Result,
  Row,
  Select,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { format } from 'date-fns';
import './style.css';
import { ENDPOINT_ORDER_ITEMS, ENDPOINT_PAPER_FILES, URL_ORDERS } from '../../../configs/constants';
import {
  CHANGE_PAYMENT_STATUS,
  COMPLETE,
  CREATED_ON,
  CUSTOMER,
  DELETE,
  DUE_DATE,
  ERROR_GENERIC,
  IN_PROGRESS,
  ORDER_ID,
  PENDING,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  STATUS,
  SUCCESS_GENERIC,
  UPLOADED_PAPERS,
  UPLOADED_PAPERS_EMPTY,
  VOID,
} from '../../../configs/lang';
import { OrderItemDescription } from './OrderItemDescription';
import { PaperUpload } from './PaperUpload';
import { downloadPaper, getDueDateValue, getOrderStatusColor, parseOrderStatus } from '@nero/utils';
import { DeleteOutlined } from '@ant-design/icons';
import { UploadedFilePreview } from '@nero/components';
import { useEffect, useState } from 'react';
import { OrderItemStatus, OrderStatus } from '@nero/query-api-service';
import { useNavigate } from 'react-router-dom';
import {
  apiService,
  useGetOrderItemQuery,
  useUpdateOrderItemMutation,
} from '../../../services/api';

const { Title, Text } = Typography;

export interface OrderItemDetailProps {
  orderItemId: string;
}

const OrderItemDetail: React.FC<OrderItemDetailProps> = (props: OrderItemDetailProps) => {
  const { orderItemId } = props;
  const {
    data: orderItem,
    isLoading,
    refetch,
  } = useGetOrderItemQuery({
    url: ENDPOINT_ORDER_ITEMS,
    id: orderItemId,
  });
  const [updateOrderItem] = useUpdateOrderItemMutation();
  const [status, setStatus] = useState<OrderItemStatus>();
  const navigate = useNavigate();

  useEffect(() => {
    setStatus(orderItem?.status);
  }, [orderItem?.status]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!orderItem) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const handleStatusChange = (value: OrderItemStatus) => {
    setStatus(value);

    updateOrderItem({ url: ENDPOINT_ORDER_ITEMS, id: orderItemId, data: { status: value } })
      .unwrap()
      .then(() => {
        notification.success({ message: SUCCESS_GENERIC });
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  };

  return (
    <div className="order-item-detail">
      <Row justify="space-between">
        <Col>
          <Title level={4}>{orderItem.topic}</Title>
          <Space direction="vertical">
            <Space size="small">
              <Tag color={getOrderStatusColor(orderItem.order.status)}>
                {parseOrderStatus(orderItem.order.status)}
              </Tag>
              {orderItem.order.status == OrderStatus.UNPAID && (
                <Button
                  type="link"
                  onClick={() => {
                    navigate(`${URL_ORDERS}/${orderItem.order.id}`);
                  }}
                >
                  {CHANGE_PAYMENT_STATUS}
                </Button>
              )}
            </Space>

            <span className="text--meta">
              {ORDER_ID}: {orderItem.order.id}
            </span>
            <span className="text--meta">
              {`${DUE_DATE}:`}{' '}
              <Text type={orderItem.is_overdue ? 'danger' : undefined}>
                {getDueDateValue(orderItem)}
              </Text>
            </span>
            <span className="text--meta">
              {CUSTOMER}: {orderItem.order.owner?.full_name}
            </span>
            <span className="text--meta">{`${CREATED_ON}: ${format(
              new Date(orderItem.created_at),
              'EEE, dd MMM yyyy hh:mm a'
            )}`}</span>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col xs={24} md={15}>
          <OrderItemDescription item={orderItem} />
        </Col>
        <Col xs={24} md={9}>
          <Form layout="vertical">
            <Form.Item label={STATUS}>
              <Select
                size="large"
                value={status}
                onChange={handleStatusChange}
                style={{ width: '100%' }}
              >
                <Select.Option value={OrderItemStatus.PENDING}>{PENDING}</Select.Option>
                <Select.Option value={OrderItemStatus.IN_PROGRESS}>{IN_PROGRESS}</Select.Option>
                <Select.Option value={OrderItemStatus.COMPLETE}>{COMPLETE}</Select.Option>
                <Select.Option value={OrderItemStatus.VOID}>{VOID}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label={UPLOADED_PAPERS}>
              {orderItem.papers.length == 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={UPLOADED_PAPERS_EMPTY} />
              ) : (
                <div className="order-item-detail__file-list">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {orderItem.papers.map((paper, i) => (
                      <Card key={i}>
                        <Row className="order-item-detail__delete-wrapper">
                          <Col span={24}>
                            <Popconfirm
                              title={POPUP_DELETE}
                              onConfirm={() => {
                                apiService
                                  .getAxiosInstance()
                                  .delete(`${ENDPOINT_PAPER_FILES}${paper.id}`)
                                  .then(() => {
                                    refetch();
                                  })
                                  .catch(() => {
                                    notification.error({ message: ERROR_GENERIC });
                                  });
                              }}
                              okText={POPUP_OK}
                              cancelText={POPUP_CANCEL}
                            >
                              <Tooltip title={DELETE}>
                                <DeleteOutlined className="order-item-detail__delete-paper-file" />
                              </Tooltip>
                            </Popconfirm>
                          </Col>
                        </Row>

                        <UploadedFilePreview
                          fileName={paper.file_name}
                          comment={paper.comment}
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onDownload={async () => {
                            try {
                              const res = await apiService
                                .getAxiosInstance()
                                .get<{ url: string }>(
                                  `${ENDPOINT_PAPER_FILES}${paper.id}/download/`
                                );
                              await downloadPaper(res.data.url);
                            } catch {
                              notification.error({
                                message: ERROR_GENERIC,
                              });
                            }
                          }}
                        />
                      </Card>
                    ))}
                  </Space>
                </div>
              )}
            </Form.Item>

            <PaperUpload orderItemId={orderItemId} onUploadSuccess={() => refetch()} />
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export { OrderItemDetail };
