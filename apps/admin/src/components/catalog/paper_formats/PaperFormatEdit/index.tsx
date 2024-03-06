import { notification, Result, Skeleton } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_PAPER_FORMATS, URL_PAPER_FORMATS } from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import {
  apiService,
  useGetPaperFormatsQuery,
  useUpdatePaperFormatMutation,
} from '../../../../services/api';
import { GenericForm, GenericFormValues } from '../../GenericForm';

export interface PaperFormatEditProps {
  paperFormatId: string;
}

const PaperFormatEdit: React.FC<PaperFormatEditProps> = (props: PaperFormatEditProps) => {
  const { paperFormatId } = props;
  const {
    data: paperFormatList,
    isLoading,
    error,
  } = useGetPaperFormatsQuery(`${ENDPOINT_PAPER_FORMATS}no-cache/`);
  const [updatePaperFormat] = useUpdatePaperFormatMutation();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: GenericFormValues, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
      setSubmitting(true);

      updatePaperFormat({
        url: ENDPOINT_PAPER_FORMATS,
        data: values,
        id: paperFormatId,
        axios: apiService.getAxiosInstance(),
        getPaperFormatsUrl: `${ENDPOINT_PAPER_FORMATS}no-cache/`,
      })
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
    [updatePaperFormat, navigate, paperFormatId]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !paperFormatList) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const paperFormat = paperFormatList.find((paperFormat) => paperFormat.id == paperFormatId);

  if (!paperFormat) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const formProps = {
    onFinish: handleSubmit,
    initialValues: {
      name: paperFormat.name,
      sort_order: paperFormat.sort_order,
    },
  };

  return <GenericForm {...formProps} />;
};

export { PaperFormatEdit };
