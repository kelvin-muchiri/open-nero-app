import { useEffect, useState } from 'react';
import {
  Result,
  Skeleton,
  Empty,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Divider,
  notification,
  message,
  Card,
} from 'antd';
import './style.css';
import {
  ENDPOINT_CART,
  ENDPOINT_SELF_ORDERS,
  URL_MAKE_PAYMENT,
  URL_PLACE_ORDER,
} from '../../../configs/constants';
import {
  BUTTON_CONTINUE_SHOPPING,
  CART_BUTTON_APPLY_COUPON,
  CART_BUTTON_CHECKOUT,
  CART_DISCOUNT,
  CART_EMPTY_DESCRIPTION,
  CART_HEADING,
  CART_SUBTOTAL,
  CART_TOTAL,
  ERROR_GENERIC,
  ORDER_SUMMARY,
  PLACE_ORDER,
  SUCCESS_GENERIC,
} from '../../../configs/lang';
import { CartItem } from './CartItem';
import { useNavigate } from 'react-router-dom';
import { ApplyCoupon } from './ApplyCoupon';
import { ArrowRightOutlined } from '@ant-design/icons';
import {
  useCreateOrderMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
} from '../../../services/api';

const { Title } = Typography;

const Cart = () => {
  const { data, error, isLoading } = useGetCartQuery(ENDPOINT_CART);
  const navigate = useNavigate();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [displayCouponField, setDisplayCouponField] = useState<boolean>(false);
  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    if (data?.cart && !data.cart.coupon && data.cart.best_match_coupon) {
      setDisplayCouponField(true);
    }
  }, [data?.cart]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!data?.cart?.items.length) {
    return (
      <Empty description={CART_EMPTY_DESCRIPTION}>
        <Button
          type="primary"
          onClick={() => {
            navigate(URL_PLACE_ORDER);
          }}
        >
          {PLACE_ORDER}
        </Button>
      </Empty>
    );
  }

  const { cart } = data;

  const onEdit = (id: string) => {
    navigate(`${URL_PLACE_ORDER}/${id}`);
  };

  const onRemove = (id: string) => {
    removeCartItem({ url: `${ENDPOINT_CART}${cart.id}/remove/`, data: { item: id } })
      .unwrap()
      .then(async () => {
        await message.success(SUCCESS_GENERIC);
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  };

  return (
    <div className="cart">
      <Title level={4}>{CART_HEADING}</Title>

      <Row gutter={10}>
        <Col xs={24} md={16}>
          {cart.items.map((item) => (
            <div key={item.id} className="cart__item">
              <CartItem
                item={item}
                onEdit={() => onEdit(item.id)}
                onRemove={() => onRemove(item.id)}
              />
            </div>
          ))}
        </Col>
        <Col xs={24} md={8}>
          <Card className="cart__summary">
            <Title level={5} className="cart__summary-heading">
              {ORDER_SUMMARY}
            </Title>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Col>
                  {CART_SUBTOTAL}{' '}
                  <span className="text--meta">
                    ({cart.items.length} item{cart.items.length > 1 ? 's' : ''})
                  </span>
                </Col>
                <Col className="cart__summary-total-value">${cart.subtotal}</Col>
              </Row>
              {cart.coupon && (
                <Row justify="space-between">
                  <Col>
                    {CART_DISCOUNT} <span className="text--meta">({cart.coupon?.code})</span>
                  </Col>
                  <Col className="cart__summary-total-value">$-{cart.discount}</Col>
                </Row>
              )}
            </Space>
            <Divider />
            <Row justify="space-between" className="cart__summary-total">
              <Col>{CART_TOTAL}</Col>
              <Col className="cart__summary-total-value">${cart.total}</Col>
            </Row>

            <span
              className="cart__summary-coupon-link text--meta"
              onClick={() => setDisplayCouponField(!displayCouponField)}
            >
              {CART_BUTTON_APPLY_COUPON}
            </span>
            <br />
            {displayCouponField && (
              <div className="cart__summary-coupon">
                <ApplyCoupon
                  cartId={cart.id}
                  defaultValue={
                    cart.coupon
                      ? undefined
                      : {
                          couponCode: cart.best_match_coupon?.code,
                          discount: cart.best_match_coupon?.discount,
                        }
                  }
                />
              </div>
            )}
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                block
                onClick={() => {
                  // create order
                  createOrder({ url: ENDPOINT_SELF_ORDERS, data: { cart: cart.id } })
                    .unwrap()
                    .then((data) => {
                      navigate(URL_MAKE_PAYMENT, { state: { orderId: data.id } });
                    })
                    .catch(() => {
                      notification.error({ message: ERROR_GENERIC });
                    });
                }}
              >
                {CART_BUTTON_CHECKOUT}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  navigate(URL_PLACE_ORDER);
                }}
              >
                {BUTTON_CONTINUE_SHOPPING}
                {<ArrowRightOutlined />}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export { Cart };
