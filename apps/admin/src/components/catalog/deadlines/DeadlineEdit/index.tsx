import { DeadlineType } from '@nero/query-api-service';
import { notification, Result, Skeleton } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_DEADLINES, URL_DEADLINES } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import {
  apiService,
  useGetDeadlinesQuery,
  useUpdateDeadlineMutation,
} from '../../../../services/api';
import { DeadlineForm, DeadlineFormProps, DeadlineFormValues } from '../DeadlineForm';

export interface DeadlineEditProps {
  deadlineId: string;
}

const DeadlineEdit: React.FC<DeadlineEditProps> = (props: DeadlineEditProps) => {
  const { deadlineId } = props;
  const {
    data: deadlineList,
    isLoading,
    error,
  } = useGetDeadlinesQuery({
    url: ENDPOINT_DEADLINES,
  });
  const [updateDeadline] = useUpdateDeadlineMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: DeadlineFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      updateDeadline({
        url: ENDPOINT_DEADLINES,
        data: {
          ...values,
          deadline_type: values.deadline_type as DeadlineType,
        },
        id: deadlineId,
        axios: apiService.getAxiosInstance(),
        getDeadlinesUrl: ENDPOINT_DEADLINES,
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
    [updateDeadline, navigate, deadlineId]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !deadlineList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const deadline = deadlineList.find((deadline) => deadline.id == deadlineId);

  if (!deadline) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const formProps: DeadlineFormProps = {
    onFinish: handleSubmit,
    initialValues: {
      value: deadline.value,
      deadline_type: deadline.deadline_type,
      sort_order: deadline.sort_order,
    },
  };

  return <DeadlineForm {...formProps} />;
};

export { DeadlineEdit };
