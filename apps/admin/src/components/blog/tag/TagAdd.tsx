import { Tag } from '@nero/query-api-service';
import { notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_BLOG_TAGS, URL_BLOG_TAGS, URL_EDIT_BLOG_TAG } from '../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../configs/lang';
import { useCreatePostTagMutation } from '../../../services/api';
import { GenericFormActions, SaveType } from '../../GenericFormActions';
import { TagForm, TagFormValues } from './TagForm';

const TagAdd = () => {
  const [createTag] = useCreatePostTagMutation();
  const navigate = useNavigate();
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');

  // take approriate action after successful submission
  const onAddSuccess = useCallback(
    (res: Tag) => {
      notification.success({ message: SUCCESS_GENERIC });

      switch (saveType) {
        case 'SAVE':
          navigate(URL_BLOG_TAGS);
          break;

        case 'SAVE_CONTINUE_EDITING':
          navigate(`${URL_EDIT_BLOG_TAG}/${res.id}`);
          break;

        default:
          form.resetFields();
      }
    },
    [form, navigate, saveType]
  );

  // commit form data to backend
  const handleAdd = useCallback(
    (values: TagFormValues) => {
      setSubmitting(true);

      createTag({ url: ENDPOINT_BLOG_TAGS, data: values })
        .unwrap()
        .then((res) => {
          onAddSuccess(res);
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [createTag, onAddSuccess]
  );

  // submit form
  const handleFormAction = useCallback(
    (saveType: SaveType) => {
      setSaveType(saveType);
      form.submit();
    },
    [form]
  );

  return (
    <>
      <TagForm form={form} onSubmit={handleAdd} />
      <GenericFormActions
        onActionClick={handleFormAction}
        isSubmittingSaveType={isSubmitting ? saveType : undefined}
      />
    </>
  );
};

export { TagAdd };
