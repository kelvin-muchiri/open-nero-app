import { Form, FormInstance, Input, Radio } from 'antd';
import { ButtonSize } from 'antd/lib/button';
import {
  ERROR_EDITOR_BUTTON_NAME_MAX,
  ERROR_NAME_REQUIRED,
  ERROR_URL_INVALID,
  LARGE,
  LINK_TO,
  LINK_TO_HELP,
  MEDIUM,
  NAME,
  SIZE,
  SMALL,
  ERROR_LINK_TO_REQUIRED,
} from '../../../../../../configs/lang';
import { ButtonBlock } from '../../../../pageSlice';

interface ButtonEditorFormValues {
  name: string;
  link_to: string;
  size?: ButtonSize;
}

export interface ButtonEditorFormProps {
  form: FormInstance;
  block: ButtonBlock;
  onSubmit: (values: ButtonBlock) => void;
}

const ButtonEditorForm: React.FC<ButtonEditorFormProps> = (props: ButtonEditorFormProps) => {
  const { onSubmit, form, block } = props;

  const initialFormValues: ButtonEditorFormValues = {
    name: block.name,
    link_to: block.linkTo,
    size: block.size,
  };

  return (
    <Form<ButtonEditorFormValues>
      form={form}
      initialValues={initialFormValues}
      layout="vertical"
      onFinish={(values) => {
        const { name, link_to, size } = values;

        onSubmit({ ...block, linkTo: link_to, name, size });
      }}
    >
      <Form.Item
        label={NAME}
        name="name"
        rules={[
          { required: true, message: ERROR_NAME_REQUIRED },
          { max: 30, message: ERROR_EDITOR_BUTTON_NAME_MAX },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={LINK_TO}
        name="link_to"
        tooltip={LINK_TO_HELP}
        rules={[
          { required: true, message: ERROR_LINK_TO_REQUIRED },
          { type: 'url', message: ERROR_URL_INVALID },
        ]}
      >
        <Input placeholder="e.g https://mywebsite.com/about-us" />
      </Form.Item>
      <Form.Item label={SIZE} name="size">
        <Radio.Group>
          <Radio.Button value="small">{SMALL}</Radio.Button>
          <Radio.Button value="medium">{MEDIUM}</Radio.Button>
          <Radio.Button value="large">{LARGE}</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export { ButtonEditorForm };
