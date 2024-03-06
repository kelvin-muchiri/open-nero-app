import { Tag, Space, Card, Tabs, Descriptions, notification } from 'antd';
import {
  DUE_DATE,
  DESCRIPTION,
  DOWNLOAD,
  PAPER,
  ACADEMIC_LEVEL,
  DEADLINE,
  COURSE,
  PAPER_FORMAT,
  LANGUAGE,
  PAGES,
  REFERENCES,
  QUANTITY,
  UNIT_PRICE,
  TOTAL_PRICE,
  COMMENT,
  ERROR_GENERIC,
} from '../../../../configs/lang';
import {
  getOrderItemStatusColor,
  parseOrderItemStatus,
  getDueDateValue,
  downloadPaper,
} from '@nero/utils';
import { OrderItem } from '@nero/query-api-service';
import { UploadedFilePreview } from '@nero/components';
import { apiService } from '../../../../services/api';
import { ENDPOINT_PAPER_FILES } from '../../../../configs/constants';

export interface OrderItemProps {
  item: OrderItem;
}

const { TabPane } = Tabs;

const OrderItemDetail: React.FC<OrderItemProps> = (props: OrderItemProps) => {
  const { item } = props;
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab={DOWNLOAD} key="1">
          <Space direction="vertical">
            <span>{item.topic}</span>
            <Tag color={getOrderItemStatusColor(item.status)}>
              {parseOrderItemStatus(item.status)}
            </Tag>
            <span className="text--meta">
              {DUE_DATE} : {getDueDateValue(item)}
            </span>
            <Space direction="vertical">
              {item.papers.map((paper, i) => (
                <UploadedFilePreview
                  key={i}
                  fileName={paper.file_name}
                  comment={paper.comment}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onDownload={async () => {
                    try {
                      const res = await apiService
                        .getAxiosInstance()
                        .get<{ url: string }>(`${ENDPOINT_PAPER_FILES}${paper.id}/download/`);
                      await downloadPaper(res.data.url);
                    } catch {
                      notification.error({
                        message: ERROR_GENERIC,
                      });
                    }
                  }}
                />
              ))}
            </Space>
          </Space>
        </TabPane>
        <TabPane tab={DESCRIPTION} key="2">
          <Descriptions>
            <Descriptions.Item label={PAPER}>{item.paper}</Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label={ACADEMIC_LEVEL}>{item.level}</Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label={DEADLINE}>{item.deadline}</Descriptions.Item>
            <Descriptions.Item label={COURSE}>{item.course}</Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label={PAPER_FORMAT}>{item.paper_format}</Descriptions.Item>
            <Descriptions.Item label={LANGUAGE}>{item.language}</Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label={PAGES}>{item.pages}</Descriptions.Item>
            <Descriptions.Item label={REFERENCES}>{item.references}</Descriptions.Item>
            <Descriptions.Item label={QUANTITY}>{item.quantity}</Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label={COMMENT}>{item.comment}</Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label={UNIT_PRICE}>${item.price}</Descriptions.Item>
            <Descriptions.Item label={TOTAL_PRICE}>${item.total_price}</Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export { OrderItemDetail };
