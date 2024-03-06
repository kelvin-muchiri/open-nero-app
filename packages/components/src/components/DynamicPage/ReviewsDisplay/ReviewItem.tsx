// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Avatar, Card, Divider, Rate, Space } from 'antd';
import { CUSTOMER_ID } from '../../../lang';
import { UserOutlined } from '@ant-design/icons';

export interface ReviewDisplayItemProps {
  rate: number;
  service: string;
  customerID: string;
  comment: string;
}

const ReviewDisplayItem: React.FC<ReviewDisplayItemProps> = (props: ReviewDisplayItemProps) => {
  const { rate, service, customerID, comment } = props;

  return (
    <Card
      className="nero-reviews__item"
      title={
        <Space direction="vertical" style={{ width: '100%' }}>
          <span className="nero-reviews__item-title">{service}</span>
          <Rate className="nero-reviews__item-rate" disabled allowHalf value={rate} />
        </Space>
      }
    >
      <div className="nero-reviews__item-body">
        <p>{comment}</p>
      </div>

      <div className="nero-reviews__item-footer">
        <Divider />
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span className="text--meta">
            {CUSTOMER_ID} #{customerID}
          </span>
        </Space>
      </div>
    </Card>
  );
};

export { ReviewDisplayItem };
