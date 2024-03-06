import { Coupon } from '@nero/query-api-service';
import { notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_COUPONS, URL_COUPONS } from '../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../configs/lang';
import { useCreateCouponMutation } from '../../../services/api';
import { GenericFormActions, SaveType } from '../../GenericFormActions';
import { CouponForm, CouponFormValues } from '../CouponForm';

const CouponAdd = () => {
  const [createCoupon] = useCreateCouponMutation();
  const navigate = useNavigate();
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');

  // take approriate action after successful submission
  const onAddSuccess = useCallback(
    (res: Coupon) => {
      notification.success({ message: SUCCESS_GENERIC });

      switch (saveType) {
        case 'SAVE':
          navigate(URL_COUPONS);
          break;

        case 'SAVE_CONTINUE_EDITING':
          navigate(`${URL_COUPONS}/${res.id}`);
          break;

        default:
          form.resetFields();
      }
    },
    [form, navigate, saveType]
  );

  // commit form data to backend
  const handleAdd = useCallback(
    (values: CouponFormValues) => {
      setSubmitting(true);
      const {
        code,
        coupon_type,
        minimum,
        duration: [start_date, end_date],
        percent_off,
      } = values;

      createCoupon({
        url: ENDPOINT_COUPONS,
        data: {
          code,
          coupon_type,
          minimum,
          percent_off,
          start_date: start_date.format(),
          end_date: end_date.format(),
        },
      })
        .unwrap()
        .then((res) => {
          onAddSuccess(res);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [createCoupon, onAddSuccess]
  );

  // submit form
  const handleFormAction = useCallback(
    (saveType: SaveType) => {
      setSaveType(saveType);
      form.submit();
    },
    [form]
  );

  return (
    <>
      <CouponForm form={form} onSubmit={handleAdd} />
      <GenericFormActions
        onActionClick={handleFormAction}
        isSubmittingSaveType={isSubmitting ? saveType : undefined}
      />
    </>
  );
};

export { CouponAdd };
