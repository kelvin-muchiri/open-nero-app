import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_CART, URL_CART } from '../../../configs/constants';
import { ERROR_GENERIC } from '../../../configs/lang';
import { CartItemRequestData } from '@nero/query-api-service';
import { OrderForm } from '../OrderForm';
import { useAddToCartMutation } from '../../../services/api';

export interface AddOrderProps {
  onCalculatorInputChanged?: (
    pages: string | number,
    paperId?: string,
    levelId?: string,
    deadlineId?: string
  ) => void;
}

const AddOrder: React.FC<AddOrderProps> = (props: AddOrderProps) => {
  const [addToCart] = useAddToCartMutation();
  const navigate = useNavigate();

  const addCart = (item: CartItemRequestData) => {
    addToCart({
      url: ENDPOINT_CART,
      data: {
        items: [item],
      },
    })
      .unwrap()
      .then(() => {
        navigate(URL_CART);
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  };

  const { onCalculatorInputChanged } = props;

  return <OrderForm onFinish={addCart} onCalculatorInputChanged={onCalculatorInputChanged} />;
};

export { AddOrder };
