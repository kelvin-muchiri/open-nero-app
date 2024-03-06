import { Form, FormInstance, Input } from 'antd';
import { AxiosResponse } from 'axios';
import { ENDPOINT_BLOG_TAGS, REGEX_SLUG } from '../../../configs/constants';
import {
  ERROR_BLOG_TAG_SLUG_MAX,
  ERROR_BLOG_TAG_SLUG_NOT_UNIQUE,
  ERROR_BLOG_TAG_TITLE_MAX,
  ERROR_SLUG_INVALID,
  ERROR_SLUG_REQUIRED,
  ERROR_TITLE_REQUIRED,
  SLUG,
  SLUG_HELP,
  TITLE,
} from '../../../configs/lang';
import { apiService } from '../../../services/api';

export interface TagFormValues {
  name: string;
  slug: string;
}

export interface TagFormProps {
  initialValues?: TagFormValues;
  onSubmit: (values: TagFormValues) => void;
  form: FormInstance;
  tagId?: string;
}

const TagForm: React.FC<TagFormProps> = (props: TagFormProps) => {
  const { initialValues, onSubmit, form, tagId } = props;

  return (
    <Form<TagFormValues>
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
          { max: 32, message: ERROR_BLOG_TAG_TITLE_MAX },
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
          { max: 60, message: ERROR_BLOG_TAG_SLUG_MAX },
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
                    tagId
                      ? `${ENDPOINT_BLOG_TAGS}${tagId}/slug-unique/`
                      : `${ENDPOINT_BLOG_TAGS}slug-unique/`,
                    {
                      slug: value,
                    }
                  );

                if (!res.data.is_unique) {
                  return Promise.reject(new Error(ERROR_BLOG_TAG_SLUG_NOT_UNIQUE));
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
    </Form>
  );
};

export { TagForm };
