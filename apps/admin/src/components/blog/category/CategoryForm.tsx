import { Form, FormInstance, Input, TreeSelect } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import { ENDPOINT_BLOG_CATEGORIES, REGEX_SLUG } from '../../../configs/constants';
import {
  ERROR_BLOG_CATEGORY_SLUG_MAX,
  ERROR_BLOG_CATEGORY_TITLE_MAX,
  ERROR_SLUG_INVALID,
  ERROR_SLUG_REQUIRED,
  ERROR_TITLE_REQUIRED,
  INPUT_HINT_SELECT,
  PARENT_CATEGORY,
  PARENT_CATEGORY_HELP,
  SLUG,
  SLUG_HELP,
  TITLE,
  ERROR_BLOG_CATEGORY_SLUG_NOT_UNIQUE,
  OPTIONAL,
} from '../../../configs/lang';
import { apiService } from '../../../services/api';
import { buildTreeSelectNode } from '../../utils';

export interface CategoryFormValues {
  name: string;
  slug: string;
  parent?: string;
}

export interface CategoryFormProps {
  initialValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void;
  parentLinkOptions: DataNode[];
  form: FormInstance;
  categoryId?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = (props: CategoryFormProps) => {
  const { initialValues, onSubmit, parentLinkOptions, form, categoryId } = props;
  const buildParentSelectNodes = useCallback(
    () => buildTreeSelectNode(parentLinkOptions),
    [parentLinkOptions]
  );

  return (
    <Form<CategoryFormValues>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        onSubmit(values);
      }}
    >
      <Form.Item
        name="name"
        label={TITLE}
        rules={[
          { required: true, message: ERROR_TITLE_REQUIRED },
          { max: 32, message: ERROR_BLOG_CATEGORY_TITLE_MAX },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        validateTrigger="onBlur"
        label={SLUG}
        name="slug"
        tooltip={SLUG_HELP}
        rules={[
          { required: true, message: ERROR_SLUG_REQUIRED },
          { max: 60, message: ERROR_BLOG_CATEGORY_SLUG_MAX },
          {
            pattern: new RegExp(REGEX_SLUG),
            message: ERROR_SLUG_INVALID,
          },
          {
            validator: async (_, value: string) => {
              if (!value) {
                return Promise.resolve();
              }

              try {
                const res: AxiosResponse<{ is_unique: boolean }> = await apiService
                  .getAxiosInstance()
                  .post(
                    categoryId
                      ? `${ENDPOINT_BLOG_CATEGORIES}${categoryId}/slug-unique/`
                      : `${ENDPOINT_BLOG_CATEGORIES}slug-unique/`,
                    {
                      slug: value,
                    }
                  );

                if (!res.data.is_unique) {
                  return Promise.reject(new Error(ERROR_BLOG_CATEGORY_SLUG_NOT_UNIQUE));
                }
              } catch (error) {
                return Promise.resolve();
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input placeholder="e.g about-us" />
      </Form.Item>
      {parentLinkOptions.length > 0 && (
        <Form.Item
          name="parent"
          label={`${PARENT_CATEGORY} (${OPTIONAL})`}
          tooltip={PARENT_CATEGORY_HELP}
        >
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
    </Form>
  );
};

export { CategoryForm };
