import { Descriptions } from 'antd';
import {
  ACADEMIC_LEVEL,
  COMMENT,
  COURSE,
  DEADLINE,
  LANGUAGE,
  PAGES,
  PAPER,
  PAPER_FORMAT,
  QUANTITY,
  REFERENCES,
  TOTAL_PRICE,
  UNIT_PRICE,
} from '../../../configs/lang';
import { OrderItem } from '@nero/query-api-service';

export interface OrderItemDescriptionProps {
  item: OrderItem;
}

const OrderItemDescription: React.FC<OrderItemDescriptionProps> = (
  props: OrderItemDescriptionProps
) => {
  const { item } = props;

  return (
    <>
      <Descriptions>
        <Descriptions.Item label={PAPER}>{item.paper}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={ACADEMIC_LEVEL}>{item.level}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={DEADLINE}>{item.deadline}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={COURSE}>{item.course}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={PAPER_FORMAT}>{item.paper_format}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={LANGUAGE}>{item.language}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={PAGES}>{item.pages}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={QUANTITY}>{item.quantity}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={REFERENCES}>{item.references}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={COMMENT}>{item.comment}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={UNIT_PRICE}>${item.price}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={TOTAL_PRICE}>${item.total_price}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export { OrderItemDescription };
