import { Form, Switch } from 'antd';

import {
  FEATURED_IMAGE,
  IS_FEATURED,
  IS_FEATURED_HELP,
  IS_PINNED,
  IS_PINNED_HELP,
} from '../../../../configs/lang';
import { PostImageUpload, PostImageUploadImage } from '../PostImageUpload';

export interface VisibilityProps {
  featuredImageUrl?: string;
  onFeaturedImageChange: (image: PostImageUploadImage) => void;
  onFeaturedImageRemove: () => void;
}

const Visibility: React.FC<VisibilityProps> = (props: VisibilityProps) => {
  const { featuredImageUrl, onFeaturedImageChange, onFeaturedImageRemove } = props;

  return (
    <>
      <Form.Item label={FEATURED_IMAGE} name="featured_image">
        <PostImageUpload
          previewUrl={featuredImageUrl}
          onRemove={onFeaturedImageRemove}
          onChange={onFeaturedImageChange}
        />
      </Form.Item>

      <Form.Item
        name="is_featured"
        valuePropName="checked"
        label={IS_FEATURED}
        tooltip={IS_FEATURED_HELP}
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="is_pinned"
        valuePropName="checked"
        label={IS_PINNED}
        tooltip={IS_PINNED_HELP}
      >
        <Switch />
      </Form.Item>
    </>
  );
};

export { Visibility };
