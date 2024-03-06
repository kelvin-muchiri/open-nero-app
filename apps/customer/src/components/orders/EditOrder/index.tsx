import { Empty, notification, Result, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_CART, ENDPOINT_CART_ITEM, URL_CART } from '../../../configs/constants';
import { ERROR_GENERIC } from '../../../configs/lang';
import { CartItemRequestData } from '@nero/query-api-service';
import { OrderForm } from '../OrderForm';
import { useGetCartQuery, useUpdateCartItemMutation } from '../../../services/api';

interface EditOrderProps {
  id: string; // id of the item to be edited
  onCalculatorInputChanged?: (
    pages: string | number,
    paperId?: string,
    levelId?: string,
    deadlineId?: string
  ) => void;
}

const EditOrder: React.FC<EditOrderProps> = (props: EditOrderProps) => {
  const { id, onCalculatorInputChanged } = props;
  const { data, error, isLoading } = useGetCartQuery(ENDPOINT_CART);
  const [updateCartItem] = useUpdateCartItemMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.cart?.items && onCalculatorInputChanged) {
      const item = data?.cart?.items.find((item) => item.id == id);
      if (item) {
        onCalculatorInputChanged(item.pages, item.paper.id, item.level?.id, item.deadline.id);
      }
    }
  }, [data?.cart?.items, onCalculatorInputChanged, id]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const item = data?.cart?.items.find((item) => item.id == id);

  if (!item) {
    return <Empty />;
  }

  const onEdit = (values: CartItemRequestData) => {
    updateCartItem({
      url: `${ENDPOINT_CART_ITEM}${id}/`,
      data: values,
    })
      .unwrap()
      .then(() => {
        navigate(URL_CART);
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  };

  const {
    topic,
    level,
    course,
    paper,
    paper_format,
    deadline,
    language,
    pages,
    references,
    comment,
    quantity,
  } = item;

  return (
    <OrderForm
      onFinish={onEdit}
      initialValues={{
        topic,
        level: level?.id,
        course: course.id,
        paper: paper.id,
        format: paper_format.id,
        deadline: deadline.id,
        language: language.id,
        pages,
        references,
        comment,
        quantity,
      }}
      onCalculatorInputChanged={onCalculatorInputChanged}
    />
  );
};

export { EditOrder };
