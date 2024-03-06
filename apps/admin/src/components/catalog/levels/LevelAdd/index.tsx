import { notification } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_LEVELS, URL_LEVELS } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { useCreateLevelMutation } from '../../../../services/api';
import { GenericForm, GenericFormValues } from '../../GenericForm';

const LevelAdd = () => {
  const [createLevel] = useCreateLevelMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      createLevel({ url: ENDPOINT_LEVELS, data: values })
        .unwrap()
        .then(() => {
          notification.success({ message: SUCCESS_GENERIC });
          navigate(URL_LEVELS);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [createLevel, navigate]
  );

  const formProps = {
    onFinish: handleSubmit,
  };

  return <GenericForm {...formProps} />;
};

export { LevelAdd };
