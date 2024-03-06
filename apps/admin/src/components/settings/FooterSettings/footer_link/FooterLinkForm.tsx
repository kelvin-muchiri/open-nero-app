import { Form, FormInstance, Input, InputNumber, Select } from 'antd';
import {
  ERROR_PAGE_REQUIRED,
  ERROR_NAVBAR_LINK_TITLE_MAX,
  ERROR_TITLE_REQUIRED,
  FOOTER_GROUP,
  INPUT_HINT_SELECT,
  NAVBAR_LINK_TO,
  NAVBAR_LINK_TO_HELP,
  SORT_ORDER,
  SORT_ORDER_HELP,
  TITLE,
} from '../../../../configs/lang';
import { GenericSelectOption } from '@nero/utils';

const { Option } = Select;

export interface FooterLinkFormValues {
  title: string;
  link_to: string;
  group?: string;
  sort_order?: string | number;
}

export interface FooterLinkFormProps {
  initialValues?: Partial<FooterLinkFormValues>;
  linkToOptions: GenericSelectOption[];
  groupOptions?: GenericSelectOption[];
  onSubmit: (values: FooterLinkFormValues) => void;
  form: FormInstance;
}

const defaultInitialValues: Partial<FooterLinkFormValues> = {
  sort_order: 1,
};

const FooterLinkForm: React.FC<FooterLinkFormProps> = (props: FooterLinkFormProps) => {
  const { initialValues, onSubmit, linkToOptions, groupOptions, form } = props;
  return (
    <Form<FooterLinkFormValues>
      form={form}
      layout="vertical"
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onFinish={onSubmit}
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

      <Form.Item
        name="link_to"
        label={NAVBAR_LINK_TO}
        tooltip={NAVBAR_LINK_TO_HELP}
        rules={[{ required: true, message: ERROR_PAGE_REQUIRED }]}
      >
        <Select allowClear placeholder={INPUT_HINT_SELECT}>
          {linkToOptions.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.title}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {groupOptions && groupOptions.length > 0 && (
        <Form.Item name="group" label={FOOTER_GROUP}>
          <Select allowClear placeholder={INPUT_HINT_SELECT}>
            {groupOptions.map((option) => (
              <Option key={option.key} value={option.value}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item name="sort_order" label={SORT_ORDER} tooltip={SORT_ORDER_HELP}>
        <InputNumber min={0} />
      </Form.Item>
    </Form>
  );
};

export { FooterLinkForm };
