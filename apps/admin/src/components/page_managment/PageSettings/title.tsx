import { Form, Input } from 'antd';
import { AxiosResponse } from 'axios';
import { ENDPOINT_PAGES, REGEX_SLUG } from '../../../configs/constants';
import {
  ERROR_SLUG_INVALID,
  ERROR_PAGE_SLUG_NOT_UNIQUE,
  ERROR_SLUG_REQUIRED,
  ERROR_PAGE_SLUG_RESERVED,
  TITLE,
  PAGE_TITLE_HELP,
  SLUG,
  SLUG_HELP,
  ERROR_PAGE_SLUG_MAX,
  ERROR_PAGE_TITLE_MAX,
  ERROR_TITLE_REQUIRED,
} from '../../../configs/lang';
import { apiService } from '../../../services/api';

export interface TitleProps {
  pageId?: string;
}

const Title: React.FC<TitleProps> = (props: TitleProps) => {
  const { pageId } = props;

  return (
    <>
      <Form.Item
        label={TITLE}
        name="title"
        tooltip={PAGE_TITLE_HELP}
        rules={[
          { required: true, message: ERROR_TITLE_REQUIRED },
          { max: 255, message: ERROR_PAGE_TITLE_MAX },
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
              let res: AxiosResponse<{ is_unique: boolean }>;
              const endpoint = pageId
                ? `${ENDPOINT_PAGES}${pageId}/slug-unique/`
                : `${ENDPOINT_PAGES}slug-unique/`;

              try {
                res = await apiService.getAxiosInstance().post(endpoint, {
                  slug: value,
                });
              } catch (error) {
                return Promise.resolve();
              }

              if (!res.data.is_unique) {
                return Promise.reject(new Error(ERROR_PAGE_SLUG_NOT_UNIQUE));
              }

              return Promise.resolve();
            },
          },
          {
            validator: async (_, value: string) => {
              if (!value) {
                return Promise.resolve();
              }

              if (['admin', 'api'].indexOf(value) >= 0) {
                return Promise.reject(new Error(ERROR_PAGE_SLUG_RESERVED));
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
