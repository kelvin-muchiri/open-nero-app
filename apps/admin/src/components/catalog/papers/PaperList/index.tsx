import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  DollarCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
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
  Alert,
  Popconfirm,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_PAPERS,
  URL_ADD_PAPER,
  URL_EDIT_PAPER,
  URL_PRICING,
} from '../../../../configs/constants';
import {
  ACTIONS,
  ADD_PAPER,
  DELETE,
  EDIT,
  ERROR_GENERIC,
  PAPERS,
  PAPER_LIST_WARNING,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  PRICES_SET,
  PRICING,
  SORT_ORDER,
  SUCCESS_GENERIC,
  TITLE,
} from '../../../../configs/lang';
import { PaperListItem } from '@nero/query-api-service';
import { apiService, useDeletePaperMutation, useGetPapersQuery } from '../../../../services/api';

const { Title } = Typography;

const PaperList = () => {
  const {
    data: paperList,
    isLoading,
    error,
  } = useGetPapersQuery({
    url: `${ENDPOINT_PAPERS}no-cache/`,
  });
  const navigate = useNavigate();
  const [deletePaper] = useDeletePaperMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !paperList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const navigateToPricing = (item: PaperListItem) => {
    navigate(`${URL_PRICING}/${item.id}`);
  };

  const columns: ColumnsType<PaperListItem> = [
    {
      title: TITLE,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: PRICES_SET,
      key: 'prices_set',
      render: (_: string, item: PaperListItem) => {
        return (
          <>
            {item.deadlines.length > 0 || item.levels.length > 0 ? (
              <CheckCircleFilled
                style={{ color: '#389e0d' }}
                onClick={() => navigateToPricing(item)}
              />
            ) : (
              <CloseCircleFilled
                style={{ color: '#cf1322' }}
                onClick={() => navigateToPricing(item)}
              />
            )}
          </>
        );
      },
    },
    {
      title: SORT_ORDER,
      dataIndex: 'sort_order',
      key: 'sort_order',
    },
    {
      title: ACTIONS,
      key: 'actions',
      render: (_: string, item: PaperListItem) => {
        return (
          <Space size="large">
            <Tooltip title={EDIT}>
              <EditOutlined
                onClick={() => {
                  navigate(`${URL_EDIT_PAPER}/${item.id}`);
                }}
              />
            </Tooltip>

            <Tooltip title={PRICING}>
              <DollarCircleOutlined onClick={() => navigateToPricing(item)} />
            </Tooltip>

            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={() => {
                deletePaper({
                  url: ENDPOINT_PAPERS,
                  id: item.id,
                  axios: apiService.getAxiosInstance(),
                  getPapersUrl: `${ENDPOINT_PAPERS}no-cache/`,
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
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row justify="space-between">
          <Col xs={24} md={8}>
            <Title level={3}>{PAPERS}</Title>
          </Col>
          <Col xs={24} md={8}>
            <Button
              className="admin-table-header-actions"
              type="primary"
              onClick={() => {
                navigate(URL_ADD_PAPER);
              }}
            >
              {ADD_PAPER}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Alert type="warning" message={PAPER_LIST_WARNING} closable />
          </Col>
        </Row>
      </Space>

      <div className="nero-table-responsive">
        <Table
          className="admin-layout-table"
          dataSource={paperList}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  );
};

export { PaperList };
