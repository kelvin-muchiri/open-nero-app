import { Form, FormInstance, Input, InputNumber } from 'antd';
import {
  ERROR_NAVBAR_LINK_TITLE_MAX,
  ERROR_TITLE_REQUIRED,
  SORT_ORDER,
  SORT_ORDER_HELP,
  TITLE,
} from '../../../../configs/lang';

export interface FooterGroupFormValues {
  title: string;
  sort_order?: string | number;
}

export interface FooterGroupFormProps {
  initialValues?: Partial<FooterGroupFormValues>;
  onSubmit: (values: FooterGroupFormValues) => void;
  form: FormInstance;
}

const defaultInitialValues: Partial<FooterGroupFormValues> = {
  sort_order: 1,
};

const FooterGroupForm: React.FC<FooterGroupFormProps> = (props: FooterGroupFormProps) => {
  const { initialValues, onSubmit, form } = props;
  return (
    <Form<FooterGroupFormValues>
      form={form}
      layout="vertical"
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onFinish={(values) => {
        onSubmit(values);
      }}
    >
      <Form.Item
        name="title"
        label={TITLE}
        rules={[
          { required: true, message: ERROR_TITLE_REQUIRED },
          { max: 20, message: ERROR_NAVBAR_LINK_TITLE_MAX },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="sort_order" label={SORT_ORDER} tooltip={SORT_ORDER_HELP}>
        <InputNumber min={0} />
      </Form.Item>
    </Form>
  );
};

export { FooterGroupForm };
