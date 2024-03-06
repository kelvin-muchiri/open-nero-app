import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined } from '@ant-design/icons';
import { PostListItem } from '@nero/query-api-service';
import { Button, Col, notification, Popconfirm, Result, Row, Skeleton, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_BLOG_POSTS,
  URL_ADD_BLOG_POST,
  URL_EDIT_BLOG_POST,
} from '../../../../configs/constants';
import {
  ACTIONS,
  ERROR_GENERIC,
  IS_PUBLIC,
  NEW_POST,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  POSTS,
  SUCCESS_GENERIC,
  TITLE,
} from '../../../../configs/lang';
import { useDeletePostMutation, useGetPostsQuery } from '../../../../services/api';

const { Title } = Typography;

const PostList = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, error } = useGetPostsQuery({
    url: `${ENDPOINT_BLOG_POSTS}no-cache/`,
    params: { page },
  });
  const navigate = useNavigate();
  const [deletePost] = useDeletePostMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<PostListItem> = [
    {
      title: TITLE,
      dataIndex: 'title',
      key: 'title',
      render: (title: string, item) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_EDIT_BLOG_POST}/${item.slug}`);
            }}
          >
            {title}
          </Button>
        );
      },
    },
    {
      title: IS_PUBLIC,
      dataIndex: 'is_published',
      key: 'is_published',
      render: (_: string, item) => {
        return (
          <>
            {item.is_published ? (
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
      render: (_: string, item) => {
        return (
          <Popconfirm
            title={POPUP_DELETE}
            onConfirm={() => {
              deletePost({ url: ENDPOINT_BLOG_POSTS, slug: item.slug })
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
          <Title level={3}>{POSTS}</Title>
        </Col>
        <Col xs={24} md={8}>
          <Button
            className="admin-table-header-actions"
            type="primary"
            onClick={() => {
              navigate(URL_ADD_BLOG_POST);
            }}
          >
            {NEW_POST}
          </Button>
        </Col>
      </Row>
      <div className="nero-table-responsive">
        <Table
          dataSource={data?.results}
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

export { PostList };
