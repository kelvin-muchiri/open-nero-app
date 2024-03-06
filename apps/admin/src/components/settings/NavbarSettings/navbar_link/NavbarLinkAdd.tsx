import { notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_NAVBAR_LINKS,
  ENDPOINT_PAGES,
  URL_EDIT_NAVBAR_LINK,
  URL_NAVBAR_SETTINGS,
} from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { NavbarLinkMutationResponse } from '@nero/query-api-service';
import { GenericFormActions, SaveType } from '../../../GenericFormActions';
import { NavbarFormValues, NavbarLinkForm } from './NavbarLinkForm';
import { getNavbarLinksTreeData } from './utils';
import {
  useCreateNavbarLinkMutation,
  useGetDraftPagesQuery,
  useGetNavbarLinksQuery,
} from '../../../../services/api';

const NavbarLinkAdd = () => {
  const { data: links } = useGetNavbarLinksQuery(`${ENDPOINT_NAVBAR_LINKS}no-cache/`);
  const { data: pages } = useGetDraftPagesQuery({
    url: ENDPOINT_PAGES,
    params: { is_public: true },
  });
  const [createNavbar] = useCreateNavbarLinkMutation();
  const navigate = useNavigate();
  const parentLinkOptions = useCallback(() => getNavbarLinksTreeData(links || []), [links]);
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
  const onAddSuccess = useCallback(
    (res: NavbarLinkMutationResponse) => {
      notification.success({ message: SUCCESS_GENERIC });

      switch (saveType) {
        case 'SAVE':
          navigate(URL_NAVBAR_SETTINGS);
          break;

        case 'SAVE_CONTINUE_EDITING':
          navigate(`${URL_EDIT_NAVBAR_LINK}/${res.id}`);
          break;

        default:
          form.resetFields();
      }
    },
    [form, navigate, saveType]
  );

  // commit form data to backend
  const handleAdd = useCallback(
    (values: NavbarFormValues) => {
      setSubmitting(true);

      createNavbar({ url: ENDPOINT_NAVBAR_LINKS, data: values })
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
    [createNavbar, onAddSuccess]
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
      <NavbarLinkForm
        form={form}
        onSubmit={handleAdd}
        parentLinkOptions={parentLinkOptions()}
        linkToOptions={linkToOptions() || []}
      />
      <GenericFormActions
        onActionClick={handleFormAction}
        isSubmittingSaveType={isSubmitting ? saveType : undefined}
      />
    </>
  );
};

export { NavbarLinkAdd };
