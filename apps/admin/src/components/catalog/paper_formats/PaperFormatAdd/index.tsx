import { notification } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_PAPER_FORMATS, URL_PAPER_FORMATS } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { useCreatePaperFormatMutation } from '../../../../services/api';
import { GenericForm, GenericFormValues } from '../../GenericForm';

const PaperFormatAdd = () => {
  const [createPaperFormat] = useCreatePaperFormatMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      createPaperFormat({ url: ENDPOINT_PAPER_FORMATS, data: values })
        .unwrap()
        .then(() => {
          notification.success({ message: SUCCESS_GENERIC });
          navigate(URL_PAPER_FORMATS);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [createPaperFormat, navigate]
  );

  const formProps = {
    onFinish: handleSubmit,
  };

  return <GenericForm {...formProps} />;
};

export { PaperFormatAdd };
