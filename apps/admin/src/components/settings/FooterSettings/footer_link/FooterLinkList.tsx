import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, notification, Popconfirm, Result, Skeleton, Space, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_FOOTER_LINKS,
  URL_ADD_FOOTER_LINK,
  URL_EDIT_FOOTER_GROUP,
  URL_EDIT_FOOTER_LINK,
} from '../../../../configs/constants';
import {
  ACTIONS,
  ADD_FOOTER_LINK,
  DELETE,
  EDIT,
  ERROR_GENERIC,
  FOOTER_GROUP,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  SORT_ORDER,
  SUCCESS_GENERIC,
  TITLE,
} from '../../../../configs/lang';
import { FooterGroup, FooterLink } from '@nero/query-api-service';
import { useDeleteFooterLinkMutation, useGetFooterLinksQuery } from '../../../../services/api';

const FooterLinkList = () => {
  const {
    data: links,
    error,
    isLoading,
  } = useGetFooterLinksQuery(`${ENDPOINT_FOOTER_LINKS}no-cache/`);
  const [deleteFooterLink] = useDeleteFooterLinkMutation();
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<FooterLink> = [
    {
      title: TITLE,
      dataIndex: 'title',
      key: 'title',
      render: (title: string, link) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_EDIT_FOOTER_LINK}/${link.id}`);
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
      title: FOOTER_GROUP,
      dataIndex: 'group',
      key: 'group',
      render: (group?: FooterGroup) => {
        if (!group) {
          return '';
        }

        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_EDIT_FOOTER_GROUP}/${group.id}`);
            }}
          >
            {group.title}
          </Button>
        );
      },
    },
    {
      title: ACTIONS,
      key: 'actions',
      render: (_: string, link) => {
        return (
          <Space size="large">
            <Tooltip title={EDIT}>
              <EditOutlined
                onClick={() => {
                  navigate(`${URL_EDIT_FOOTER_LINK}/${link.id}`);
                }}
              />
            </Tooltip>

            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={() => {
                deleteFooterLink({ url: ENDPOINT_FOOTER_LINKS, id: link.id })
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
          navigate(URL_ADD_FOOTER_LINK);
        }}
      >
        {ADD_FOOTER_LINK}
      </Button>
      <div className="nero-table-responsive">
        <Table dataSource={links} columns={columns} pagination={false} />
      </div>
    </Space>
  );
};

export { FooterLinkList };
