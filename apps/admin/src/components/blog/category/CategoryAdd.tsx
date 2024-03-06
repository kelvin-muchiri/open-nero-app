import { CategoryMutationResponseData } from '@nero/query-api-service';
import { notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_BLOG_CATEGORIES,
  URL_BLOG_CATEGORIES,
  URL_EDIT_BLOG_CATEGORY,
} from '../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../configs/lang';
import { useCreatePostCategoryMutation, useGetPostCategoriesQuery } from '../../../services/api';
import { GenericFormActions, SaveType } from '../../GenericFormActions';
import { CategoryForm, CategoryFormValues } from './CategoryForm';
import { getCategoriesTreeData } from './utils';

const CategoryAdd = () => {
  const { data } = useGetPostCategoriesQuery({ url: `${ENDPOINT_BLOG_CATEGORIES}no-cache/` });
  const [createCategory] = useCreatePostCategoryMutation();
  const navigate = useNavigate();
  const parentLinkOptions = useCallback(() => getCategoriesTreeData(data || []), [data]);
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');

  // take approriate action after successful submission
  const onAddSuccess = useCallback(
    (res: CategoryMutationResponseData) => {
      notification.success({ message: SUCCESS_GENERIC });

      switch (saveType) {
        case 'SAVE':
          navigate(URL_BLOG_CATEGORIES);
          break;

        case 'SAVE_CONTINUE_EDITING':
          navigate(`${URL_EDIT_BLOG_CATEGORY}/${res.id}`);
          break;

        default:
          form.resetFields();
      }
    },
    [form, navigate, saveType]
  );

  // commit form data to backend
  const handleAdd = useCallback(
    (values: CategoryFormValues) => {
      setSubmitting(true);

      createCategory({ url: ENDPOINT_BLOG_CATEGORIES, data: values })
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
    [createCategory, onAddSuccess]
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
      <CategoryForm form={form} onSubmit={handleAdd} parentLinkOptions={parentLinkOptions()} />
      <GenericFormActions
        onActionClick={handleFormAction}
        isSubmittingSaveType={isSubmitting ? saveType : undefined}
      />
    </>
  );
};

export { CategoryAdd };
