import { Form, Input } from 'antd';
import {
  ERROR_SEO_DESCRIPTION_MAX,
  ERROR_SEO_TITLE_MAX,
  SEO_DESCRIPTION,
  SEO_DESCRIPTION_HELP,
  SEO_TITLE,
  SEO_TITLE_HELP,
} from '../../../configs/lang';

const Seo = () => {
  return (
    <>
      <Form.Item
        label={SEO_TITLE}
        name="seo_title"
        tooltip={SEO_TITLE_HELP}
        rules={[{ max: 60, message: ERROR_SEO_TITLE_MAX }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label={SEO_DESCRIPTION}
        name="seo_description"
        tooltip={SEO_DESCRIPTION_HELP}
        rules={[{ max: 160, message: ERROR_SEO_DESCRIPTION_MAX }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
    </>
  );
};

export { Seo };
