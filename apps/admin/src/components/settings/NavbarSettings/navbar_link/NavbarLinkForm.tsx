import { Form, FormInstance, Input, Select, TreeSelect } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { useCallback } from 'react';
import {
  ERROR_NAVBAR_LINK_TITLE_MAX,
  ERROR_TITLE_REQUIRED,
  INPUT_HINT_SELECT,
  NAVBAR_LINK_PARENT,
  NAVBAR_LINK_PARENT_HELP,
  NAVBAR_LINK_TO,
  NAVBAR_LINK_TO_HELP,
  TITLE,
} from '../../../../configs/lang';
import { GenericSelectOption } from '@nero/utils';
import { buildTreeSelectNode } from '../../../utils';

const { Option } = Select;

export interface NavbarFormValues {
  title: string;
  link_to?: string;
  parent?: string;
}

export interface NavbarFormProps {
  initialValues?: NavbarFormValues;
  onSubmit: (values: NavbarFormValues) => void;
  parentLinkOptions: DataNode[];
  linkToOptions: GenericSelectOption[];
  form: FormInstance;
}

const NavbarLinkForm: React.FC<NavbarFormProps> = (props: NavbarFormProps) => {
  const { initialValues, onSubmit, parentLinkOptions, linkToOptions, form } = props;
  const buildParentSelectNodes = useCallback(
    () => buildTreeSelectNode(parentLinkOptions),
    [parentLinkOptions]
  );

  return (
    <Form<NavbarFormValues>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        onSubmit(values);
      }}
    >
      <Form.Item
        name="title"
        label={TITLE}
        rules={[
          { required: true, message: ERROR_TITLE_REQUIRED },
          { max: 50, message: ERROR_NAVBAR_LINK_TITLE_MAX },
        ]}
      >
        <Input />
      </Form.Item>

      {parentLinkOptions.length > 0 && (
        <Form.Item name="parent" label={NAVBAR_LINK_PARENT} tooltip={NAVBAR_LINK_PARENT_HELP}>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder={INPUT_HINT_SELECT}
            allowClear
            treeDefaultExpandAll
          >
            {buildParentSelectNodes()}
          </TreeSelect>
        </Form.Item>
      )}

      <Form.Item name="link_to" label={NAVBAR_LINK_TO} tooltip={NAVBAR_LINK_TO_HELP}>
        <Select allowClear placeholder={INPUT_HINT_SELECT}>
          {linkToOptions.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export { NavbarLinkForm };
