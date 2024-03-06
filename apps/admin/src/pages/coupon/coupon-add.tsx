import { Col, Row } from 'antd';
import { Helmet } from 'react-helmet-async';
import { CouponAdd } from '../../components/coupon/CouponAdd';
import { ADD_COUPON } from '../../configs/lang';

const CouponAddPage = () => {
  return (
    <>
      <Helmet>
        <title>{ADD_COUPON}</title>
      </Helmet>
      <Row>
        <Col md={12}>
          <CouponAdd />
        </Col>
      </Row>
    </>
  );
};

export { CouponAddPage };
