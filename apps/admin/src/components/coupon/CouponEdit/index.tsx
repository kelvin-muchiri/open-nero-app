import { notification, Result, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { ENDPOINT_COUPONS, URL_ADD_COUPON, URL_COUPONS } from '../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../configs/lang';
import {
  useDeleteCouponMutation,
  useGetSingleCouponQuery,
  useUpdateCouponMutation,
} from '../../../services/api';
import { GenericFormActions, SaveType } from '../../GenericFormActions';
import { CouponForm, CouponFormValues } from '../CouponForm';

export interface CouponEditProps {
  id: string;
}

const CouponEdit: React.FC<CouponEditProps> = (props: CouponEditProps) => {
  const { id } = props;
  const {
    data: coupon,
    error,
    isLoading,
  } = useGetSingleCouponQuery({
    url: ENDPOINT_COUPONS,
    id: props.id,
  });
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const navigate = useNavigate();
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');

  // take approriate action after successful submission
  const onUpdateSucess = useCallback(() => {
    notification.success({ message: SUCCESS_GENERIC });

    switch (saveType) {
      case 'SAVE':
        navigate(URL_COUPONS);
        break;

      case 'SAVE_ADD_ANOTHER':
        navigate(URL_ADD_COUPON);
        break;

      default:
        break;
    }
  }, [navigate, saveType]);

  // make API call to update
  const handleUpdate = useCallback(
    (values: CouponFormValues) => {
      setSubmitting(true);
      const {
        code,
        coupon_type,
        minimum,
        duration: [start_date, end_date],
        percent_off,
      } = values;

      updateCoupon({
        url: ENDPOINT_COUPONS,
        data: {
          code,
          coupon_type,
          minimum,
          percent_off,
          start_date: start_date.format(),
          end_date: end_date.format(),
        },
        id,
      })
        .unwrap()
        .then(() => {
          onUpdateSucess();
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [onUpdateSucess, id, updateCoupon]
  );

  /// make API call to delete
  const handleDelete = useCallback(() => {
    deleteCoupon({ url: ENDPOINT_COUPONS, id })
      .unwrap()
      .then(() => {
        notification.success({ message: SUCCESS_GENERIC });
        navigate(URL_COUPONS);
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  }, [deleteCoupon, navigate, id]);

  // submit form
  const handleFormAction = useCallback(
    (saveType: SaveType) => {
      if (saveType == 'DELETE') {
        handleDelete();
        return;
      }

      setSaveType(saveType);
      form.submit();
    },
    [form, handleDelete]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !coupon) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const { code, minimum, coupon_type, percent_off, start_date, end_date } = coupon;
  const initialValues: CouponFormValues = {
    code,
    minimum: minimum || undefined,
    coupon_type,
    percent_off,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    duration: [moment(start_date) as Moment, moment(end_date) as Moment],
  };

  return (
    <>
      <CouponForm form={form} initialValues={initialValues} onSubmit={handleUpdate} couponId={id} />
      <GenericFormActions
        onActionClick={handleFormAction}
        isSubmittingSaveType={isSubmitting ? saveType : undefined}
        showDelete={true}
      />
    </>
  );
};

export { CouponEdit };
