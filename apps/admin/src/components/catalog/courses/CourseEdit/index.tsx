import { notification, Result, Skeleton } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_COURSES, URL_COURSES } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { apiService, useGetCoursesQuery, useUpdateCourseMutation } from '../../../../services/api';
import { GenericForm, GenericFormValues } from '../../GenericForm';

export interface CourseEditProps {
  courseId: string;
}

const CourseEdit: React.FC<CourseEditProps> = (props: CourseEditProps) => {
  const { courseId } = props;
  const { data: courseList, isLoading, error } = useGetCoursesQuery(`${ENDPOINT_COURSES}no-cache/`);
  const [updateCourse] = useUpdateCourseMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      updateCourse({
        url: ENDPOINT_COURSES,
        data: values,
        id: courseId,
        axios: apiService.getAxiosInstance(),
        getCoursesUrl: `${ENDPOINT_COURSES}no-cache/`,
      })
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
    [updateCourse, navigate, courseId]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !courseList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const course = courseList.find((course) => course.id == courseId);

  if (!course) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const formProps = {
    onFinish: handleSubmit,
    initialValues: {
      name: course.name,
      sort_order: course.sort_order,
    },
  };

  return <GenericForm {...formProps} />;
};

export { CourseEdit };
