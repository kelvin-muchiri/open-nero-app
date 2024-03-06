import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Descriptions, Row, Col, Space, Button, Tooltip, Popconfirm } from 'antd';
import { useState } from 'react';
import './style.css';
import {
  ACADEMIC_LEVEL,
  PAPER,
  DEADLINE,
  COURSE,
  PAPER_FORMAT,
  LANGUAGE,
  PAGES,
  REFERENCES,
  QUANTITY,
  COMMENT,
  UNIT_PRICE,
  TOPIC,
  EDIT,
  REMOVE,
  POPUP_CANCEL,
  POPUP_OK,
  POPUP_REMOVE_CART_ITEM_TITLE,
  SUBTOTAL_PRICE,
} from '../../../../configs/lang';
import { CartItemResponse } from '@nero/query-api-service';

interface CartItemProps {
  item: CartItemResponse;
  onEdit: () => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = (props: CartItemProps) => {
  const { item, onEdit, onRemove } = props;
  const [tooltipRemoveVisible, setToolTipRemoveVisible] = useState<boolean>();

  return (
    <Card className="cart-item">
      <Row justify="space-between">
        <Col span={24}>
          <Space className="cart-item__actions">
            <Tooltip title={EDIT}>
              <Button
                shape="circle"
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit()}
              />
            </Tooltip>

            <Popconfirm
              title={POPUP_REMOVE_CART_ITEM_TITLE}
              okText={POPUP_OK}
              cancelText={POPUP_CANCEL}
              onCancel={() => {
                setToolTipRemoveVisible(undefined);
              }}
              onConfirm={() => onRemove()}
            >
              <Tooltip title={REMOVE} visible={tooltipRemoveVisible}>
                <Button
                  danger
                  shape="circle"
                  type="primary"
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => setToolTipRemoveVisible(false)}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        </Col>
      </Row>
      <Descriptions>
        <Descriptions.Item label={TOPIC}>{item.topic}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={PAPER}>{item.paper.name}</Descriptions.Item>
      </Descriptions>
      {item.level && (
        <Descriptions>
          <Descriptions.Item label={ACADEMIC_LEVEL}>{item.level.name}</Descriptions.Item>
        </Descriptions>
      )}
      <Descriptions>
        <Descriptions.Item label={DEADLINE}>{item.deadline.full_name}</Descriptions.Item>
        <Descriptions.Item label={COURSE}>{item.course.name}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={PAPER_FORMAT}>{item.paper_format.name}</Descriptions.Item>
        <Descriptions.Item label={LANGUAGE}>{item.language.name}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={PAGES}>{item.pages}</Descriptions.Item>
        <Descriptions.Item label={REFERENCES}>{item.references}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={COMMENT}>{item.comment}</Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label={QUANTITY}>{item.quantity}</Descriptions.Item>
        <Descriptions.Item label={UNIT_PRICE}>${item.price}</Descriptions.Item>
        <Descriptions.Item label={SUBTOTAL_PRICE}>${item.total_price}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export { CartItem };
