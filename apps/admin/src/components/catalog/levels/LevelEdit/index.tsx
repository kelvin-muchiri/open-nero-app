import { notification, Result, Skeleton } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_LEVELS, URL_LEVELS } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { apiService, useGetLevelsQuery, useUpdateLevelMutation } from '../../../../services/api';
import { GenericForm, GenericFormValues } from '../../GenericForm';

export interface LevelEditProps {
  levelId: string;
}

const LevelEdit: React.FC<LevelEditProps> = (props: LevelEditProps) => {
  const { levelId } = props;
  const { data: levelList, isLoading, error } = useGetLevelsQuery(ENDPOINT_LEVELS);
  const [updateLevel] = useUpdateLevelMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      updateLevel({
        url: ENDPOINT_LEVELS,
        data: values,
        id: levelId,
        axios: apiService.getAxiosInstance(),
        getLevelsUrl: ENDPOINT_LEVELS,
      })
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
    [updateLevel, navigate, levelId]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !levelList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const level = levelList.find((level) => level.id == levelId);

  if (!level) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const formProps = {
    onFinish: handleSubmit,
    initialValues: {
      name: level.name,
      sort_order: level.sort_order,
    },
  };

  return <GenericForm {...formProps} />;
};

export { LevelEdit };
