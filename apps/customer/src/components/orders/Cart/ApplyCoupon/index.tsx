import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Input, Button, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { ENDPOINT_APPLY_COUPON } from '../../../../configs/constants';
import {
  BUTTON_LABEL_APPLY_COUPON,
  ERROR_GENERIC,
  INPUT_LABEL_COUPON,
} from '../../../../configs/lang';
import { useApplyCouponMutation } from '../../../../services/api';

const { Text } = Typography;

interface ServerValidationErrors {
  non_field_errors?: string[];
}

export interface DefaultValue {
  couponCode: string;
  discount?: string;
}

export interface ApplyCouponProps {
  cartId: string;
  defaultValue?: DefaultValue;
}

const ApplyCoupon: React.FC<ApplyCouponProps> = (props: ApplyCouponProps) => {
  const [applyCoupon] = useApplyCouponMutation();
  const [success, setSuccess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [failedError, setFailedError] = useState('');
  const [value, setValue] = useState<string>('');
  const { defaultValue, cartId } = props;

  useEffect(() => {
    setValue(defaultValue?.couponCode || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!value) {
      setFailed(false);
      setFailedError('');
    }
  }, [value]);

  return (
    <Input.Group compact>
      <Input
        style={{ width: 'calc(100% - 80px)' }}
        value={value}
        placeholder={INPUT_LABEL_COUPON}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          applyCoupon({
            url: ENDPOINT_APPLY_COUPON,
            data: { coupon_code: value, cart_id: cartId },
          })
            .unwrap()
            .then(() => {
              setSuccess(true);
              setValue('');
            })
            .catch((error: FetchBaseQueryError) => {
              setSuccess(false);

              if (error.status == 400) {
                const err = error.data as ServerValidationErrors;
                if (err.non_field_errors) {
                  setFailedError(err['non_field_errors'][0]);
                }
              } else {
                setFailedError('');
              }
              setFailed(true);
            });
        }}
      >
        {BUTTON_LABEL_APPLY_COUPON}
      </Button>
      {defaultValue?.discount && <span className="text--meta">Save ${defaultValue?.discount}</span>}
      {success && <Text type="success">Success: The coupon was applied</Text>}
      {failed && <Text type="danger">{failedError ? failedError : ERROR_GENERIC}</Text>}
    </Input.Group>
  );
};

export { ApplyCoupon };
