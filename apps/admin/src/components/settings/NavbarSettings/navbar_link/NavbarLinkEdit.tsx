import { notification, Result, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_NAVBAR_LINKS,
  ENDPOINT_PAGES,
  URL_ADD_NAVBAR_LINK,
  URL_NAVBAR_SETTINGS,
} from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import {
  useDeleteNavbarLinkMutation,
  useGetDraftPagesQuery,
  useGetNavbarLinksQuery,
  useGetSingleNavbarLinkQuery,
  useUpdateNavbarLinkMutation,
} from '../../../../services/api';
import { GenericFormActions, SaveType } from '../../../GenericFormActions';
import { NavbarFormValues, NavbarLinkForm } from './NavbarLinkForm';
import { getNavbarLinksTreeData } from './utils';

export interface NavbarLinkEditProps {
  id: string;
}

const NavbarLinkEdit: React.FC<NavbarLinkEditProps> = (props: NavbarLinkEditProps) => {
  const {
    data: link,
    error,
    isLoading,
  } = useGetSingleNavbarLinkQuery({
    url: ENDPOINT_NAVBAR_LINKS,
    id: props.id,
    action: 'no-cache',
  });
  const { data: links } = useGetNavbarLinksQuery(`${ENDPOINT_NAVBAR_LINKS}no-cache/`);
  const { data: pages } = useGetDraftPagesQuery({
    url: ENDPOINT_PAGES,
    params: { is_public: true },
  });
  const [updateNavbarLink] = useUpdateNavbarLinkMutation();
  const [deleteNavbarLink] = useDeleteNavbarLinkMutation();
  const navigate = useNavigate();
  // exclude link being edited and its children from parent options since
  // a link cannot have itself or its descendants as parent
  const parentLinkOptions = useCallback(
    () => getNavbarLinksTreeData(links || [], [props.id]),
    [links, props.id]
  );
  const linkToOptions = useCallback(
    () =>
      pages?.map((page) => {
        const { id, title } = page;
        return {
          key: id,
          value: id,
          title,
        };
      }),
    [pages]
  );
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');

  // take approriate action after successful submission
  const onUpdateSucess = useCallback(() => {
    notification.success({ message: SUCCESS_GENERIC });

    switch (saveType) {
      case 'SAVE':
        navigate(URL_NAVBAR_SETTINGS);
        break;

      case 'SAVE_ADD_ANOTHER':
        navigate(URL_ADD_NAVBAR_LINK);
        break;

      default:
        break;
    }
  }, [navigate, saveType]);

  // make API call to update
  const handleUpdate = useCallback(
    (values: NavbarFormValues) => {
      setSubmitting(true);

      updateNavbarLink({ url: ENDPOINT_NAVBAR_LINKS, data: values, id: props.id })
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
    [onUpdateSucess, props.id, updateNavbarLink]
  );

  /// make API call to delete
  const handleDelete = useCallback(() => {
    deleteNavbarLink({ url: ENDPOINT_NAVBAR_LINKS, id: props.id })
      .unwrap()
      .then(() => {
        notification.success({ message: SUCCESS_GENERIC });
        navigate(URL_NAVBAR_SETTINGS);
      })
      .catch(() => {
        notification.error({ message: ERROR_GENERIC });
      });
  }, [deleteNavbarLink, navigate, props.id]);

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

  if (error || !link) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const { title, link_to, parent } = link;
  const initialValues: NavbarFormValues = {
    title,
    link_to: link_to?.id,
    parent: parent?.id,
  };

  return (
    <>
      <NavbarLinkForm
        form={form}
        initialValues={initialValues}
        onSubmit={handleUpdate}
        parentLinkOptions={parentLinkOptions()}
        linkToOptions={linkToOptions() || []}
      />
      <GenericFormActions
        onActionClick={handleFormAction}
        isSubmittingSaveType={isSubmitting ? saveType : undefined}
        showDelete={true}
      />
    </>
  );
};

export { NavbarLinkEdit };
