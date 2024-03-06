import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Tag } from '@nero/query-api-service';
import {
  Button,
  Col,
  notification,
  Popconfirm,
  Result,
  Row,
  Skeleton,
  Space,
  Tooltip,
  Typography,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_BLOG_TAGS,
  URL_ADD_BLOG_TAG,
  URL_EDIT_BLOG_TAG,
} from '../../../configs/constants';
import {
  ACTIONS,
  ADD_TAG,
  DELETE,
  EDIT,
  ERROR_GENERIC,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  SUCCESS_GENERIC,
  TAGS,
  TITLE,
} from '../../../configs/lang';
import { useDeletePostTagMutation, useGetPostTagsQuery } from '../../../services/api';

const { Title } = Typography;

const TagList = () => {
  const { data, isLoading, error } = useGetPostTagsQuery({
    url: `${ENDPOINT_BLOG_TAGS}no-cache/`,
  });
  const navigate = useNavigate();
  const [deleteTag] = useDeletePostTagMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<Tag> = [
    {
      title: TITLE,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: ACTIONS,
      key: 'actions',
      render: (_: string, item) => {
        return (
          <Space size="large">
            <Tooltip title={EDIT}>
              <EditOutlined
                onClick={() => {
                  navigate(`${URL_EDIT_BLOG_TAG}/${item.id}`);
                }}
              />
            </Tooltip>
            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={() => {
                deleteTag({
                  url: ENDPOINT_BLOG_TAGS,
                  id: item.id,
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
          <Title level={3}>{TAGS}</Title>
        </Col>
        <Col xs={24} md={8}>
          <Button
            className="admin-table-header-actions"
            type="primary"
            onClick={() => {
              navigate(URL_ADD_BLOG_TAG);
            }}
          >
            {ADD_TAG}
          </Button>
        </Col>
      </Row>
      <div className="nero-table-responsive">
        <Table
          className="admin-layout-table"
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  );
};

export { TagList };
