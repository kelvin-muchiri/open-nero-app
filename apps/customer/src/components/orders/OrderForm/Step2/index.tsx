import { Button, Form, Input, InputNumber, Select, Tooltip } from 'antd';
import { Language } from '..';
import {
  ATTACHMENT,
  ERROR_INSTRUCTIONS_MAX,
  ERROR_PAPER_FORMAT_REQUIRED,
  ERROR_TOPIC_MAX,
  ERROR_TOPIC_REQUIRED,
  INPUT_HINT_SELECT,
  INPUT_LABEL_INSTRUCTIONS,
  INPUT_LABEL_LANGUAGE,
  INPUT_LABEL_PAPER_FORMAT,
  INPUT_LABEL_REFERENCES,
  LANGUAGE_ENGLISH_UK,
  LANGUAGE_ENGLISH_US,
  TOPIC,
  UPLOAD,
} from '../../../../configs/lang';
import { GenericCatalogListItem } from '@nero/query-api-service';
import { PaperClipOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../../store/hooks';

export interface Step2Props {
  formatList: GenericCatalogListItem[];
}

const Step2: React.FC<Step2Props> = (props: Step2Props) => {
  const { formatList } = props;
  const config = useAppSelector((state) => state.config);

  return (
    <>
      <Form.Item
        name="topic"
        label={TOPIC}
        rules={[
          { max: 255, message: ERROR_TOPIC_MAX },
          { required: true, message: ERROR_TOPIC_REQUIRED },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="references" label={INPUT_LABEL_REFERENCES}>
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        name="format"
        label={INPUT_LABEL_PAPER_FORMAT}
        rules={[{ required: true, message: ERROR_PAPER_FORMAT_REQUIRED }]}
      >
        <Select placeholder={INPUT_HINT_SELECT}>
          {formatList?.map((format) => (
            <Select.Option key={format.id} value={format.id}>
              {format.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="language" label={INPUT_LABEL_LANGUAGE}>
        <Select placeholder={INPUT_HINT_SELECT}>
          <Select.Option key={Language.ENGLISH_UK} value={Language.ENGLISH_UK}>
            {LANGUAGE_ENGLISH_UK}
          </Select.Option>
          <Select.Option key={Language.ENGLISH_US} value={Language.ENGLISH_US}>
            {LANGUAGE_ENGLISH_US}
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="comment"
        label={INPUT_LABEL_INSTRUCTIONS}
        rules={[{ max: 1000, message: ERROR_INSTRUCTIONS_MAX }]}
      >
        <Input.TextArea />
      </Form.Item>
      {config.attachmentEmail && (
        <Form.Item label={ATTACHMENT}>
          <Tooltip
            title={
              <>
                <p>
                  Send your attachments to <strong>{config.attachmentEmail}</strong> after placing
                  your order.
                </p>
                <p>
                  Use the <strong>order ID</strong> generated as the email subject
                </p>
              </>
            }
          >
            <Button icon={<PaperClipOutlined />} type="link" size="small">
              {UPLOAD}
            </Button>
          </Tooltip>
        </Form.Item>
      )}
    </>
  );
};

export { Step2 };
