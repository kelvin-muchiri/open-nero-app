import { Col, Result, Row } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { CouponEdit } from '../../components/coupon/CouponEdit';
import { PARAM_ID } from '../../configs/constants';
import { COUPON, EDIT, ERROR_GENERIC } from '../../configs/lang';

const CouponEditPage = () => {
  const { id } = useParams<typeof PARAM_ID>();

  if (!id) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {EDIT} {COUPON}
        </title>
      </Helmet>
      <Row>
        <Col md={12}>
          <CouponEdit id={id} />
        </Col>
      </Row>
    </>
  );
};

export { CouponEditPage };
