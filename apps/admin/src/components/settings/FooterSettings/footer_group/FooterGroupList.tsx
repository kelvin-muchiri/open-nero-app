import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, notification, Popconfirm, Result, Skeleton, Space, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_FOOTER_GROUPS,
  URL_ADD_FOOTER_GROUP,
  URL_EDIT_FOOTER_GROUP,
} from '../../../../configs/constants';
import {
  ACTIONS,
  ADD_FOOTER_GROUP,
  DELETE,
  EDIT,
  ERROR_GENERIC,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  SORT_ORDER,
  SUCCESS_GENERIC,
  TITLE,
} from '../../../../configs/lang';
import { FooterGroup } from '@nero/query-api-service';
import { useDeleteFooterGroupMutation, useGetFooterGroupsQuery } from '../../../../services/api';

const FooterGroupList = () => {
  const {
    data: groups,
    error,
    isLoading,
  } = useGetFooterGroupsQuery(`${ENDPOINT_FOOTER_GROUPS}no-cache/`);
  const [deleteFooterGroup] = useDeleteFooterGroupMutation();
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<FooterGroup> = [
    {
      title: TITLE,
      dataIndex: 'title',
      key: 'title',
      render: (title: string, group) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_EDIT_FOOTER_GROUP}/${group.id}`);
            }}
          >
            {title}
          </Button>
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
      render: (_: string, group) => {
        return (
          <Space size="large">
            <Tooltip title={EDIT}>
              <EditOutlined
                onClick={() => {
                  navigate(`${URL_EDIT_FOOTER_GROUP}/${group.id}`);
                }}
              />
            </Tooltip>

            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={() => {
                deleteFooterGroup({ url: ENDPOINT_FOOTER_GROUPS, id: group.id })
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
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button
        className="admin-table-header-actions"
        type="primary"
        onClick={() => {
          navigate(URL_ADD_FOOTER_GROUP);
        }}
      >
        {ADD_FOOTER_GROUP}
      </Button>
      <div className="nero-table-responsive">
        <Table dataSource={groups} columns={columns} pagination={false} />
      </div>
    </Space>
  );
};

export { FooterGroupList };
