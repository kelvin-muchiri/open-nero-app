import { notification, Result, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_BLOG_CATEGORIES,
  URL_ADD_BLOG_CATEGORY,
  URL_BLOG_CATEGORIES,
} from '../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../configs/lang';
import {
  useDeletePostCategoryMutation,
  useGetPostCategoriesQuery,
  useGetSinglePostCategoryQuery,
  useUpdatePostCategoryMutation,
} from '../../../services/api';
import { GenericFormActions, SaveType } from '../../GenericFormActions';
import { CategoryForm, CategoryFormValues } from './CategoryForm';
import { getCategoriesTreeData } from './utils';

export interface CategoryEditProps {
  id: string;
}

const CategoryEdit: React.FC<CategoryEditProps> = (props: CategoryEditProps) => {
  const {
    data: category,
    error,
    isLoading,
  } = useGetSinglePostCategoryQuery({
    url: ENDPOINT_BLOG_CATEGORIES,
    id: props.id,
    action: 'no-cache',
  });
  const { data: categories } = useGetPostCategoriesQuery({
    url: `${ENDPOINT_BLOG_CATEGORIES}no-cache/`,
  });
  const [updatePostCategory] = useUpdatePostCategoryMutation();
  const [deletePostCategory] = useDeletePostCategoryMutation();
  const navigate = useNavigate();
  // exclude link being edited and its children from parent options since
  // a link cannot have itself or its descendants as parent
  const parentLinkOptions = useCallback(
    () => getCategoriesTreeData(categories || [], [props.id]),
    [categories, props.id]
  );

  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');

  // take approriate action after successful submission
  const onUpdateSucess = useCallback(() => {
    notification.success({ message: SUCCESS_GENERIC });

    switch (saveType) {
      case 'SAVE':
        navigate(URL_BLOG_CATEGORIES);
        break;

      case 'SAVE_ADD_ANOTHER':
        navigate(URL_ADD_BLOG_CATEGORY);
        break;

      default:
        break;
    }
  }, [navigate, saveType]);

  // make API call to update
  const handleUpdate = useCallback(
    (values: CategoryFormValues) => {
      setSubmitting(true);

      updatePostCategory({
        url: ENDPOINT_BLOG_CATEGORIES,
        data: { ...values, parent: values.parent || null },
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
    [onUpdateSucess, props.id, updatePostCategory]
  );

  /// make API call to delete
  const handleDelete = useCallback(() => {
    deletePostCategory({ url: ENDPOINT_BLOG_CATEGORIES, id: props.id })
      .unwrap()
      .then(() => {
        notification.success({ message: SUCCESS_GENERIC });
        navigate(URL_BLOG_CATEGORIES);
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  }, [deletePostCategory, navigate, props.id]);

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

  if (error || !category) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const { name, slug, parent } = category;
  const initialValues: CategoryFormValues = {
    name,
    slug,
    parent: parent?.id,
  };

  return (
    <>
      <CategoryForm
        form={form}
        initialValues={initialValues}
        onSubmit={handleUpdate}
        parentLinkOptions={parentLinkOptions()}
        categoryId={props.id}
      />
      <GenericFormActions
        onActionClick={handleFormAction}
        isSubmittingSaveType={isSubmitting ? saveType : undefined}
        showDelete={true}
      />
    </>
  );
};

export { CategoryEdit };
