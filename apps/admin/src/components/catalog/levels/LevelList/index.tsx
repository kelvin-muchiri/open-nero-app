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
import { ENDPOINT_LEVELS, URL_ADD_LEVEL, URL_LEVELS } from '../../../../configs/constants';
import {
  ACTIONS,
  ADD_LEVEL,
  DELETE,
  EDIT,
  ERROR_GENERIC,
  LEVELS,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  SORT_ORDER,
  SUCCESS_GENERIC,
  TITLE,
} from '../../../../configs/lang';
import { GenericCatalogListItem } from '@nero/query-api-service';
import { apiService, useDeleteLevelMutation, useGetLevelsQuery } from '../../../../services/api';

const { Title } = Typography;

const LevelList = () => {
  const { data: levelList, isLoading, error } = useGetLevelsQuery(ENDPOINT_LEVELS);
  const navigate = useNavigate();
  const [deleteLevel] = useDeleteLevelMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !levelList) {
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
                  navigate(`${URL_LEVELS}/${item.id}`);
                }}
              />
            </Tooltip>

            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={() => {
                deleteLevel({
                  url: ENDPOINT_LEVELS,
                  id: item.id,
                  axios: apiService.getAxiosInstance(),
                  getLevelsUrl: ENDPOINT_LEVELS,
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
          <Title level={3}>{LEVELS}</Title>
        </Col>
        <Col xs={24} md={8}>
          <Button
            className="admin-table-header-actions"
            type="primary"
            onClick={() => {
              navigate(URL_ADD_LEVEL);
            }}
          >
            {ADD_LEVEL}
          </Button>
        </Col>
      </Row>
      <div className="nero-table-responsive">
        <Table
          className="admin-layout-table"
          dataSource={levelList}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  );
};

export { LevelList };
