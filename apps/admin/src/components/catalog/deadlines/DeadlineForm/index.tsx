import { Form, InputNumber, Button, Select, Row, Col } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  SORT_ORDER,
  BUTTON_LABEL_SUBMIT,
  SORT_ORDER_HELP,
  LOADING,
  DURATION,
  DURATION_TYPE,
  ERROR_DURATION_REQUIRED,
  ERROR_DURATION_TYPE_REQUIRED,
  INPUT_HINT_SELECT,
  HOUR,
  DAY,
} from '../../../../configs/lang';
import { DeadlineType } from '@nero/query-api-service';
import { deadlineTypeValidator } from './utils';

const { Option } = Select;

export interface DeadlineFormValues {
  value: number | string;
  deadline_type: number | string;
  sort_order: string | number;
}

export interface DeadlineFormProps {
  onFinish: (values: DeadlineFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => void;
  initialValues?: Partial<DeadlineFormValues>;
}

const defaultInitialValues: Partial<DeadlineFormValues> = {
  sort_order: 1,
};

const DeadlineForm: React.FC<DeadlineFormProps> = (props: DeadlineFormProps) => {
  const { initialValues, onFinish } = props;
  const [isSubmitting, setSubmitting] = useState(false);
  const [durationValue, setDurationValue] = useState<number | string>();

  useEffect(() => {
    setDurationValue(initialValues?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form<DeadlineFormValues>
      layout="vertical"
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onFinish={(values) => {
        onFinish(values, setSubmitting);
      }}
    >
      <Row>
        <Col md={6}>
          <Form.Item
            name="value"
            label={DURATION}
            rules={[{ required: true, message: ERROR_DURATION_REQUIRED }]}
          >
            <InputNumber min={1} onChange={(value) => setDurationValue(value)} />
          </Form.Item>
        </Col>
        <Col md={18}>
          <Form.Item
            dependencies={['value']}
            name="deadline_type"
            label={DURATION_TYPE}
            rules={[
              { required: true, message: ERROR_DURATION_TYPE_REQUIRED },
              {
                validator: async (_, value: string | number) => {
                  // durationValue == initialValues?.value is a workaround to ensure
                  // we do not validate same deadline if user is editing deadline
                  if (durationValue == undefined || durationValue == initialValues?.value) {
                    return Promise.resolve();
                  }

                  return await deadlineTypeValidator(value as DeadlineType, durationValue);
                },
              },
            ]}
          >
            <Select placeholder={INPUT_HINT_SELECT}>
              <Option value={DeadlineType.HOUR}>{HOUR}</Option>
              <Option value={DeadlineType.DAY}>{DAY}</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="sort_order" label={SORT_ORDER} tooltip={SORT_ORDER_HELP}>
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isSubmitting ? LOADING : BUTTON_LABEL_SUBMIT}
        </Button>
      </Form.Item>
    </Form>
  );
};

export { DeadlineForm };
