import { Helmet } from 'react-helmet-async';
import { CouponList } from '../../components/coupon/CouponList';
import { COUPONS } from '../../configs/lang';

const CouponListPage = () => {
  return (
    <>
      <Helmet>
        <title>{COUPONS}</title>
      </Helmet>
      <CouponList />
    </>
  );
};

export { CouponListPage };
