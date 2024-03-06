import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Coupon, CouponType } from '@nero/query-api-service';
import { Button, Col, notification, Popconfirm, Result, Row, Skeleton, Space, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_COUPONS, URL_ADD_COUPON, URL_COUPONS } from '../../../configs/constants';
import {
  ACTIONS,
  ADD_COUPON,
  CODE,
  COUPONS,
  COUPON_TYPE,
  EDIT,
  ERROR_GENERIC,
  FIRST_TIMER,
  IS_ACTIVE,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  REGULAR,
  SUCCESS_GENERIC,
} from '../../../configs/lang';
import { useDeleteCouponMutation, useGetCouponsQuery } from '../../../services/api';

const CouponList = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, error } = useGetCouponsQuery({
    url: ENDPOINT_COUPONS,
    params: { page },
  });
  const navigate = useNavigate();
  const [deleteCoupon] = useDeleteCouponMutation();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const columns: ColumnsType<Coupon> = [
    {
      title: CODE,
      dataIndex: 'code',
      key: 'code',
      render: (code: string, { id }) => {
        return (
          <Button
            type="link"
            onClick={() => {
              navigate(`${URL_COUPONS}/${id}`);
            }}
          >
            {code}
          </Button>
        );
      },
    },
    {
      title: COUPON_TYPE,
      dataIndex: 'coupon_type',
      key: 'coupon_type',
      render: (coupon_type: CouponType) => {
        return <span>{coupon_type == CouponType.REGULAR ? REGULAR : FIRST_TIMER}</span>;
      },
    },
    {
      title: IS_ACTIVE,
      dataIndex: 'is_expired',
      key: 'is_expired',
      render: (is_expired: boolean) => {
        return (
          <>
            {!is_expired ? (
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
      render: (_: string, { id }) => {
        return (
          <Space size="large">
            <Tooltip title={EDIT}>
              <EditOutlined
                onClick={() => {
                  navigate(`${URL_COUPONS}/${id}`);
                }}
              />
            </Tooltip>
            <Popconfirm
              title={POPUP_DELETE}
              onConfirm={() => {
                deleteCoupon({ url: ENDPOINT_COUPONS, id })
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
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Row justify="space-between">
        <Col xs={24} md={8}>
          <h3>{COUPONS}</h3>
        </Col>
        <Col xs={24} md={8}>
          <Button
            className="admin-table-header-actions"
            type="primary"
            onClick={() => {
              navigate(URL_ADD_COUPON);
            }}
          >
            {ADD_COUPON}
          </Button>
        </Col>
      </Row>
      <div className="nero-table-responsive">
        <Table
          dataSource={data?.results}
          columns={columns}
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

export { CouponList };
