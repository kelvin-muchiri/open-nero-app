import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Col, Result, Row, Skeleton, Typography, Table } from 'antd';
import { useState } from 'react';
import { format } from 'date-fns';
import { ENDPOINT_CUSTOMERS } from '../../../configs/constants';
import {
  ERROR_GENERIC,
  CUSTOMERS,
  FULL_NAME,
  EMAIL,
  IS_EMAIL_VERIFIED,
  DATE_JOINED,
  LAST_LOGIN,
} from '../../../configs/lang';
import { CustomerListItem } from '@nero/query-api-service';
import { ColumnsType } from 'antd/lib/table';
import { useGetCustomersQuery } from '../../../services/api';

const { Title } = Typography;

const CustomerList = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, error } = useGetCustomersQuery({
    url: ENDPOINT_CUSTOMERS,
    params: { page },
  });

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<CustomerListItem> = [
    {
      title: FULL_NAME,
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: EMAIL,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: IS_EMAIL_VERIFIED,
      dataIndex: 'is_email_verified',
      key: 'is_email_verified',
      render: (_: string, item: CustomerListItem) => {
        return (
          <>
            {item.is_email_verified ? (
              <CheckCircleFilled style={{ color: '#389e0d' }} />
            ) : (
              <CloseCircleFilled style={{ color: '#cf1322' }} />
            )}
          </>
        );
      },
    },
    {
      title: DATE_JOINED,
      dataIndex: 'date_joined',
      key: 'date_joined',
      render: (dateString: string) => {
        return format(new Date(dateString), 'dd MMM yyyy');
      },
    },
    {
      title: LAST_LOGIN,
      dataIndex: 'last_login',
      key: 'last_login',
      render: (dateString?: string) => {
        if (dateString) {
          return format(new Date(dateString), 'dd MMM yyyy');
        }
      },
    },
  ];

  return (
    <>
      <Row justify="space-between">
        <Col xs={24} md={8}>
          <Title level={3}>{CUSTOMERS}</Title>
        </Col>
      </Row>
      <div className="nero-table-responsive">
        <Table
          className="admin-layout-table"
          dataSource={data.results}
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

export { CustomerList };
