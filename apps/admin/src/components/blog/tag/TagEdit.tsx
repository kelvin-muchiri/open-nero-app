import { notification, Result, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT_BLOG_TAGS, URL_ADD_BLOG_TAG, URL_BLOG_TAGS } from '../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../configs/lang';
import {
  useDeletePostTagMutation,
  useGetPostTagsQuery,
  useUpdatePostTagMutation,
} from '../../../services/api';
import { GenericFormActions, SaveType } from '../../GenericFormActions';
import { TagForm, TagFormValues } from './TagForm';

export interface TagEditProps {
  id: string;
}

const TagEdit: React.FC<TagEditProps> = (props: TagEditProps) => {
  const { data, isLoading, error } = useGetPostTagsQuery({ url: `${ENDPOINT_BLOG_TAGS}no-cache/` });
  const [updateTag] = useUpdatePostTagMutation();
  const [deleteTag] = useDeletePostTagMutation();
  const navigate = useNavigate();
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');

  // take approriate action after successful submission
  const onUpdateSucess = useCallback(() => {
    notification.success({ message: SUCCESS_GENERIC });

    switch (saveType) {
      case 'SAVE':
        navigate(URL_BLOG_TAGS);
        break;

      case 'SAVE_ADD_ANOTHER':
        navigate(URL_ADD_BLOG_TAG);
        break;

      default:
        break;
    }
  }, [navigate, saveType]);

  // make API call to update
  const handleUpdate = useCallback(
    (values: TagFormValues) => {
      setSubmitting(true);

      updateTag({
        url: ENDPOINT_BLOG_TAGS,
        data: values,
        id: props.id,
      })
        .unwrap()
        .then(() => {
          onUpdateSucess();
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [onUpdateSucess, props.id, updateTag]
  );

  /// make API call to delete
  const handleDelete = useCallback(() => {
    deleteTag({ url: ENDPOINT_BLOG_TAGS, id: props.id })
      .unwrap()
      .then(() => {
        notification.success({ message: SUCCESS_GENERIC });
        navigate(URL_BLOG_TAGS);
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  }, [deleteTag, navigate, props.id]);

  // submit form
  const handleFormAction = useCallback(
    (saveType: SaveType) => {
      if (saveType == 'DELETE') {
        handleDelete();
        return;
      }

      setSaveType(saveType);
      form.submit();
    },
    [form, handleDelete]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error || !data) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const tag = data.find((e) => e.id == props.id);

  if (!tag) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const { name, slug } = tag;
  const initialValues: TagFormValues = {
    name,
    slug,
  };

  return (
    <>
      <TagForm form={form} initialValues={initialValues} onSubmit={handleUpdate} tagId={props.id} />
      <GenericFormActions
        onActionClick={handleFormAction}
        isSubmittingSaveType={isSubmitting ? saveType : undefined}
        showDelete={true}
      />
    </>
  );
};

export { TagEdit };
