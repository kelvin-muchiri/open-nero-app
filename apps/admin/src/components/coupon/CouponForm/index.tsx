import { DatePicker, Form, FormInstance, Input, InputNumber, Select } from 'antd';
import { AxiosResponse } from 'axios';
import { ENDPOINT_COUPONS } from '../../../configs/constants';
import { Moment } from 'moment';
import {
  CODE,
  COUPON_DURATION_HELP,
  COUPON_TYPE,
  DURATION,
  ERROR_COUPON_CODE_MAX_LENGTH,
  ERROR_COUPON_CODE_NOT_UNIQUE,
  ERROR_COUPON_CODE_REQUIRED,
  ERROR_COUPON_PERCENT_OFF_REQUIRED,
  ERROR_COUPON_TYPE_REQUIRED,
  ERROR_DURATION_REQUIRED,
  FIRST_TIMER,
  INPUT_HINT_SELECT,
  MINIMUM_ORDER_TOTAL,
  MINIMUM_ORDER_TOTAL_HELP,
  OPTIONAL,
  PERCENT_OFF,
  REGULAR,
} from '../../../configs/lang';
import { apiService } from '../../../services/api';
import { CouponType } from '@nero/query-api-service';

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface CouponFormValues {
  code: string;
  percent_off: number;
  coupon_type: CouponType;
  minimum?: number;
  duration: [Moment, Moment];
}

export interface CouponFormProps {
  initialValues?: CouponFormValues;
  onSubmit: (values: CouponFormValues) => void;
  form: FormInstance;
  couponId?: string;
}

const CouponForm: React.FC<CouponFormProps> = (props: CouponFormProps) => {
  const { initialValues, onSubmit, form, couponId } = props;

  return (
    <Form<CouponFormValues>
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={onSubmit}
    >
      <Form.Item
        validateTrigger="onBlur"
        name="code"
        label={CODE}
        rules={[
          { required: true, message: ERROR_COUPON_CODE_REQUIRED },
          { max: 8, message: ERROR_COUPON_CODE_MAX_LENGTH },
          {
            validator: async (_, value: string) => {
              if (!value) {
                return Promise.resolve();
              }

              try {
                const res: AxiosResponse<{ is_unique: boolean }> = await apiService
                  .getAxiosInstance()
                  .post(
                    couponId
                      ? `${ENDPOINT_COUPONS}${couponId}/code-unique/`
                      : `${ENDPOINT_COUPONS}code-unique/`,
                    {
                      code: value,
                    }
                  );

                if (!res.data.is_unique) {
                  return Promise.reject(new Error(ERROR_COUPON_CODE_NOT_UNIQUE));
                }
              } catch (error) {
                return Promise.resolve();
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input placeholder="e.g GIFT4YOU" />
      </Form.Item>
      <Form.Item
        name="percent_off"
        label={PERCENT_OFF}
        rules={[{ required: true, message: ERROR_COUPON_PERCENT_OFF_REQUIRED }]}
      >
        <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="e.g 20" />
      </Form.Item>
      <Form.Item
        name="coupon_type"
        label={COUPON_TYPE}
        rules={[{ required: true, message: ERROR_COUPON_TYPE_REQUIRED }]}
      >
        <Select placeholder={INPUT_HINT_SELECT}>
          <Option value={CouponType.REGULAR}>{REGULAR}</Option>
          <Option value={CouponType.FIRST_TIMER}>{FIRST_TIMER}</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="duration"
        label={DURATION}
        tooltip={COUPON_DURATION_HELP}
        rules={[{ required: true, message: ERROR_DURATION_REQUIRED }]}
      >
        <RangePicker
          showTime={{ format: 'HH:mm', showNow: true }}
          format="YYYY-MM-DD HH:mm"
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        name="minimum"
        label={`${MINIMUM_ORDER_TOTAL} (${OPTIONAL})`}
        tooltip={MINIMUM_ORDER_TOTAL_HELP}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

export { CouponForm };
