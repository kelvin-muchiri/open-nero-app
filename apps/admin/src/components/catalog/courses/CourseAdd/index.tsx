import { notification } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_COURSES, URL_COURSES } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { useCreateCourseMutation } from '../../../../services/api';
import { GenericForm, GenericFormValues } from '../../GenericForm';

const CourseAdd = () => {
  const [createCourse] = useCreateCourseMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      createCourse({ url: ENDPOINT_COURSES, data: values })
        .unwrap()
        .then(() => {
          notification.success({ message: SUCCESS_GENERIC });
          navigate(URL_COURSES);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [createCourse, navigate]
  );

  const formProps = {
    onFinish: handleSubmit,
  };

  return <GenericForm {...formProps} />;
};

export { CourseAdd };
