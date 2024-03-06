import { Form, Input } from 'antd';
import { AxiosResponse } from 'axios';
import { ENDPOINT_BLOG_POSTS, REGEX_SLUG } from '../../../../configs/constants';
import {
  ERROR_BLOG_POST_SLUG_NOT_UNIQUE,
  ERROR_PAGE_SLUG_MAX,
  ERROR_SLUG_INVALID,
  ERROR_SLUG_REQUIRED,
  SLUG,
  SLUG_HELP,
  TITLE,
  PAGE_TITLE_HELP,
  ERROR_BLOG_POST_TITLE_MAX,
  ERROR_TITLE_REQUIRED,
} from '../../../../configs/lang';
import { apiService } from '../../../../services/api';

export interface TitleProps {
  postId?: string;
}

const Title: React.FC<TitleProps> = (props: TitleProps) => {
  const { postId } = props;

  return (
    <>
      <Form.Item
        label={TITLE}
        name="title"
        tooltip={PAGE_TITLE_HELP}
        rules={[
          { required: true, message: ERROR_TITLE_REQUIRED },
          { max: 255, message: ERROR_BLOG_POST_TITLE_MAX },
        ]}
      >
        <Input.TextArea rows={4} placeholder="e.g About Us" />
      </Form.Item>
      <Form.Item
        validateTrigger="onBlur"
        label={SLUG}
        name="slug"
        tooltip={SLUG_HELP}
        rules={[
          { required: true, message: ERROR_SLUG_REQUIRED },
          { max: 60, message: ERROR_PAGE_SLUG_MAX },
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
                    postId
                      ? `${ENDPOINT_BLOG_POSTS}${postId}/slug-unique/`
                      : `${ENDPOINT_BLOG_POSTS}slug-unique/`,
                    {
                      slug: value,
                    }
                  );

                if (!res.data.is_unique) {
                  return Promise.reject(new Error(ERROR_BLOG_POST_SLUG_NOT_UNIQUE));
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
    </>
  );
};

export { Title };
