import { DeadlineType } from '@nero/query-api-service';
import { notification } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_DEADLINES, URL_DEADLINES } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { useCreateDeadlineMutation } from '../../../../services/api';
import { DeadlineForm, DeadlineFormValues } from '../DeadlineForm';

const DeadlineAdd = () => {
  const [createDeadline] = useCreateDeadlineMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: DeadlineFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      createDeadline({
        url: ENDPOINT_DEADLINES,
        data: {
          ...values,
          deadline_type: values.deadline_type as DeadlineType,
        },
      })
        .unwrap()
        .then(() => {
          notification.success({ message: SUCCESS_GENERIC });
          navigate(URL_DEADLINES);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [createDeadline, navigate]
  );

  const formProps = {
    onFinish: handleSubmit,
  };

  return <DeadlineForm {...formProps} />;
};

export { DeadlineAdd };
