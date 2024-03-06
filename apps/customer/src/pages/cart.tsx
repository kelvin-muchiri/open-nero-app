import { Helmet } from 'react-helmet-async';
import { Cart } from '../components/orders/Cart';
import { CART } from '../configs/lang';

const CartPage = () => {
  return (
    <>
      <Helmet>
        <title>{CART}</title>
      </Helmet>
      <Cart />
    </>
  );
};

export { CartPage as default };
