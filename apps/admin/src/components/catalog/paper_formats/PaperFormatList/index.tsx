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
import {
  ENDPOINT_PAPER_FORMATS,
  URL_ADD_PAPER_FORMAT,
  URL_PAPER_FORMATS,
} from '../../../../configs/constants';
import {
  ACTIONS,
  ADD_PAPER_FORMAT,
  DELETE,
  EDIT,
  ERROR_GENERIC,
  PAPER_FORMATS,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  SORT_ORDER,
  SUCCESS_GENERIC,
  TITLE,
} from '../../../../configs/lang';
import { GenericCatalogListItem } from '@nero/query-api-service';
import {
  apiService,
  useDeletePaperFormatMutation,
  useGetPaperFormatsQuery,
} from '../../../../services/api';

const { Title } = Typography;

const PaperFormatList = () => {
  const {
    data: paperFormatList,
    isLoading,
    error,
  } = useGetPaperFormatsQuery(`${ENDPOINT_PAPER_FORMATS}no-cache/`);
  const navigate = useNavigate();
  const [deletePaperFormat] = useDeletePaperFormatMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !paperFormatList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<GenericCatalogListItem> = [
    {
      title: TITLE,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: SORT_ORDER,
      dataIndex: 'sort_order',
      key: 'sort_order',
    },
    {
      title: ACTIONS,
      key: 'actions',
      render: (_: string, item: GenericCatalogListItem) => {
        return (
          <Space size="large">
            <Tooltip title={EDIT}>
              <EditOutlined
                onClick={() => {
                  navigate(`${URL_PAPER_FORMATS}/${item.id}`);
                }}
              />
            </Tooltip>

            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={() => {
                deletePaperFormat({
                  url: ENDPOINT_PAPER_FORMATS,
                  id: item.id,
                  axios: apiService.getAxiosInstance(),
                  getPaperFormatsUrl: `${ENDPOINT_PAPER_FORMATS}no-cache/`,
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
          <Title level={3}>{PAPER_FORMATS}</Title>
        </Col>
        <Col xs={24} md={8}>
          <Button
            className="admin-table-header-actions"
            type="primary"
            onClick={() => {
              navigate(URL_ADD_PAPER_FORMAT);
            }}
          >
            {ADD_PAPER_FORMAT}
          </Button>
        </Col>
      </Row>
      <div className="nero-table-responsive">
        <Table
          className="admin-layout-table"
          dataSource={paperFormatList}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  );
};

export { PaperFormatList };
