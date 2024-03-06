import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Result,
  Row,
  Skeleton,
  Space,
  Typography,
  Table,
  Tooltip,
  Popconfirm,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_DEADLINES, URL_ADD_DEADLINE, URL_DEADLINES } from '../../../../configs/constants';
import {
  ACTIONS,
  ADD_DEADLINE,
  DELETE,
  EDIT,
  ERROR_GENERIC,
  DEADLINES,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  SUCCESS_GENERIC,
  TITLE,
  SORT_ORDER,
} from '../../../../configs/lang';
import { DeadlineListItem } from '@nero/query-api-service';
import {
  apiService,
  useDeleteDeadlineMutation,
  useGetDeadlinesQuery,
} from '../../../../services/api';

const { Title } = Typography;

const DeadlineList = () => {
  const {
    data: deadlineList,
    isLoading,
    error,
  } = useGetDeadlinesQuery({
    url: ENDPOINT_DEADLINES,
  });
  const navigate = useNavigate();
  const [deleteDeadline] = useDeleteDeadlineMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !deadlineList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<DeadlineListItem> = [
    {
      title: TITLE,
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: SORT_ORDER,
      dataIndex: 'sort_order',
      key: 'sort_order',
    },
    {
      title: ACTIONS,
      key: 'actions',
      render: (_: string, item: DeadlineListItem) => {
        return (
          <Space size="large">
            <Tooltip title={EDIT}>
              <EditOutlined
                onClick={() => {
                  navigate(`${URL_DEADLINES}/${item.id}`);
                }}
              />
            </Tooltip>

            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={() => {
                deleteDeadline({
                  url: ENDPOINT_DEADLINES,
                  id: item.id,
                  axios: apiService.getAxiosInstance(),
                  getDeadlinesUrl: ENDPOINT_DEADLINES,
                })
                  .unwrap()
                  .then(() => {
                    notification.success({ message: SUCCESS_GENERIC });
                  })
                  .catch(() => {
                    notification.error({ message: ERROR_GENERIC });
                  });
              }}
              okText={POPUP_OK}
              cancelText={POPUP_CANCEL}
            >
              <Tooltip title={DELETE}>
                <DeleteOutlined />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Row justify="space-between">
        <Col xs={24} md={8}>
          <Title level={3}>{DEADLINES}</Title>
        </Col>
        <Col xs={24} md={8}>
          <Button
            className="admin-table-header-actions"
            type="primary"
            onClick={() => {
              navigate(URL_ADD_DEADLINE);
            }}
          >
            {ADD_DEADLINE}
          </Button>
        </Col>
      </Row>
      <div className="nero-table-responsive">
        <Table
          className="admin-layout-table"
          dataSource={deadlineList}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  );
};

export { DeadlineList };
