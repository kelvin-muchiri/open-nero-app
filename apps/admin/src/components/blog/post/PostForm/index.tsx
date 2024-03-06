import { GenericSelectOption } from '@nero/utils';
import { Form, FormInstance, Select, Switch, TreeSelect } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { useCallback, useEffect, useState } from 'react';
import { CATEGORIES, INPUT_HINT_SELECT, IS_PUBLIC, TAGS } from '../../../../configs/lang';
import { buildTreeSelectNode } from '../../../utils';
import { PostImageUploadImage } from '../PostImageUpload';
import { Seo } from './Seo';
import { Title } from './Title';
import { Visibility } from './Visibility';

const { Option } = Select;

export interface PostFormValues {
  title: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  is_featured?: boolean;
  is_pinned?: boolean;
  is_published?: boolean;
  featured_image?: PostImageUploadImage | null;
  tags?: string[];
  categories?: string[];
}

export interface PostFormProps {
  initialValues?: PostFormValues;
  form: FormInstance;
  onSubmit: (values: PostFormValues) => void;
  tagOptions: GenericSelectOption[];
  categoryOptions: DataNode[];
  postId?: string;
}

const PostForm: React.FC<PostFormProps> = (props: PostFormProps) => {
  const { form, onSubmit, postId, initialValues, tagOptions, categoryOptions } = props;
  const [featuredImage, setFeaturedImage] = useState<PostImageUploadImage | null | undefined>(null);
  const buildCategoryNodes = useCallback(
    () => buildTreeSelectNode(categoryOptions),
    [categoryOptions]
  );

  useEffect(() => {
    setFeaturedImage(initialValues?.featured_image);
  }, [initialValues?.featured_image]);

  return (
    <Form<PostFormValues>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        onSubmit({ ...values, featured_image: featuredImage });
      }}
    >
      <Form.Item name="is_published" valuePropName="checked" label={IS_PUBLIC}>
        <Switch />
      </Form.Item>

      <Title postId={postId} />

      <Seo />

      <Visibility
        featuredImageUrl={featuredImage?.image ?? undefined}
        onFeaturedImageChange={(image) => setFeaturedImage(image)}
        onFeaturedImageRemove={() => setFeaturedImage(null)}
      />

      <Form.Item name="tags" label={TAGS}>
        <Select mode="multiple" allowClear placeholder={INPUT_HINT_SELECT}>
          {tagOptions.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.title}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="categories" label={CATEGORIES}>
        <TreeSelect
          multiple
          showSearch
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder={INPUT_HINT_SELECT}
          allowClear
          treeDefaultExpandAll
        >
          {buildCategoryNodes()}
        </TreeSelect>
      </Form.Item>
    </Form>
  );
};

export { PostForm };
