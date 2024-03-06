import { notification, Result, Skeleton } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_PAPERS, URL_PAPERS } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { apiService, useGetPapersQuery, useUpdatePaperMutation } from '../../../../services/api';
import { GenericForm, GenericFormValues } from '../../GenericForm';

export interface PaperEditProps {
  paperId: string;
}

const PaperEdit: React.FC<PaperEditProps> = (props: PaperEditProps) => {
  const { paperId } = props;
  const {
    data: paperList,
    isLoading,
    error,
  } = useGetPapersQuery({
    url: `${ENDPOINT_PAPERS}no-cache/`,
  });
  const [updatePaper] = useUpdatePaperMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      updatePaper({
        url: ENDPOINT_PAPERS,
        data: values,
        id: paperId,
        axios: apiService.getAxiosInstance(),
        getPapersUrl: `${ENDPOINT_PAPERS}no-cache/`,
      })
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
    [updatePaper, navigate, paperId]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !paperList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const paper = paperList.find((paper) => paper.id == paperId);

  if (!paper) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const formProps = {
    onFinish: handleSubmit,
    initialValues: {
      name: paper.name,
      sort_order: paper.sort_order,
    },
  };

  return <GenericForm {...formProps} />;
};

export { PaperEdit };
