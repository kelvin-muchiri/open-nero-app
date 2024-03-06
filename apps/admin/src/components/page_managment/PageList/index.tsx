import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Typography,
  Button,
  Skeleton,
  Result,
  Empty,
  Table,
  Popconfirm,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_PAGES, URL_NEW_PAGE, URL_EDIT_PAGE } from '../../../configs/constants';
import {
  ACTIONS,
  BUTTON_NEW_PAGE,
  ERROR_GENERIC,
  PAGES,
  SUCCESS_GENERIC,
  TITLE,
  POPUP_OK,
  POPUP_CANCEL,
  POPUP_DELETE,
  IS_PUBLIC,
} from '../../../configs/lang';
import { DraftPage } from '@nero/query-api-service';
import { useDeletePageMutation, useGetDraftPagesQuery } from '../../../services/api';

const { Title } = Typography;

const PageList = () => {
  const navigate = useNavigate();
  const { data: pages, error, isLoading } = useGetDraftPagesQuery({ url: ENDPOINT_PAGES });
  const [deletePage] = useDeletePageMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!pages) {
    return <Empty />;
  }

  const columns: ColumnsType<DraftPage> = [
    {
      title: TITLE,
      dataIndex: 'title',
      key: 'title',
      render: (title: string, page) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_EDIT_PAGE}/${page.id}`);
            }}
          >
            {title}
          </Button>
        );
      },
    },
    {
      title: IS_PUBLIC,
      dataIndex: 'is_public',
      key: 'is_public',
      render: (_: string, item) => {
        return (
          <>
            {item.is_public ? (
              <CheckCircleFilled style={{ color: '#389e0d' }} />
            ) : (
              <CloseCircleFilled style={{ color: '#cf1322' }} />
            )}
          </>
        );
      },
    },
    {
      title: ACTIONS,
      key: 'actions',
      render: (_: string, page: DraftPage) => {
        return (
          <Popconfirm
            title={POPUP_DELETE}
            onConfirm={() => {
              deletePage(`${ENDPOINT_PAGES}${page.id}/`)
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
            <DeleteOutlined />
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <>
      <Row justify="space-between">
        <Col xs={24} md={8}>
          <Title level={3}>{PAGES}</Title>
        </Col>
        <Col xs={24} md={8}>
          <Button
            className="admin-table-header-actions"
            type="primary"
            onClick={() => {
              navigate(URL_NEW_PAGE);
            }}
          >
            {BUTTON_NEW_PAGE}
          </Button>
        </Col>
      </Row>
      <div className="nero-table-responsive">
        <Table dataSource={pages} columns={columns} />
      </div>
    </>
  );
};

export { PageList };
