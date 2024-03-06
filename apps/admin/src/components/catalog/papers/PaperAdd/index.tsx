import { notification } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_PAPERS, URL_PAPERS } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { useCreatePaperMutation } from '../../../../services/api';
import { GenericForm, GenericFormValues } from '../../GenericForm';

const PaperAdd = () => {
  const [createPaper] = useCreatePaperMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      createPaper({ url: ENDPOINT_PAPERS, data: values })
        .unwrap()
        .then(() => {
          notification.success({ message: SUCCESS_GENERIC });
          navigate(URL_PAPERS);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [createPaper, navigate]
  );

  const formProps = {
    onFinish: handleSubmit,
  };

  return <GenericForm {...formProps} />;
};

export { PaperAdd };
