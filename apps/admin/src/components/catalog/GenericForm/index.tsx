import { Form, Input, InputNumber, Button } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  SORT_ORDER,
  TITLE,
  BUTTON_LABEL_SUBMIT,
  SORT_ORDER_HELP,
  ERROR_PAPER_TITLE_MAX,
  ERROR_PAPER_TITLE_REQUIRED,
  LOADING,
} from '../../../configs/lang';

export interface GenericFormValues {
  name: string;
  sort_order: string | number;
}

export interface GenericFormProps {
  onFinish: (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => void;
  initialValues?: Partial<GenericFormValues>;
}

const defaultInitialValues: Partial<GenericFormValues> = {
  sort_order: 1,
};

const GenericForm: React.FC<GenericFormProps> = (props: GenericFormProps) => {
  const { initialValues, onFinish } = props;
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <Form<GenericFormValues>
      layout="vertical"
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onFinish={(values) => {
        onFinish(values, setSubmitting);
      }}
    >
      <Form.Item
        name="name"
        label={TITLE}
        rules={[
          { required: true, message: ERROR_PAPER_TITLE_REQUIRED },
          { max: 255, message: ERROR_PAPER_TITLE_MAX },
        ]}
      >
        <Input />
      </Form.Item>
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

export { GenericForm };
