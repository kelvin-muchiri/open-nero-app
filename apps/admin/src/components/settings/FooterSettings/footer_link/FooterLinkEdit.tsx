import { notification, Result, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_FOOTER_GROUPS,
  ENDPOINT_FOOTER_LINKS,
  ENDPOINT_PAGES,
  URL_ADD_FOOTER_LINK,
  URL_FOOTER_SETTINGS,
} from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import {
  useGetDraftPagesQuery,
  useGetFooterGroupsQuery,
  useGetFooterLinksQuery,
  useUpdateFooterLinkMutation,
} from '../../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { GenericFormActions, GenericFormActionsProps, SaveType } from '../../../GenericFormActions';
import { FooterSettingsTabKeys, updateActiveTab } from '../reducers/footer-settings-slice';
import { FooterLinkForm, FooterLinkFormProps } from './FooterLinkForm';

export interface FooterLinkEditProps {
  id: string;
}

const FooterLinkEdit: React.FC<FooterLinkEditProps> = (props: FooterLinkEditProps) => {
  const [updateFooterLink] = useUpdateFooterLinkMutation();
  const { data: pages } = useGetDraftPagesQuery({
    url: ENDPOINT_PAGES,
    params: { is_public: true },
  });
  const { data: groups } = useGetFooterGroupsQuery(`${ENDPOINT_FOOTER_GROUPS}no-cache/`);
  const {
    data: links,
    error,
    isLoading,
  } = useGetFooterLinksQuery(`${ENDPOINT_FOOTER_LINKS}no-cache/`);
  const navigate = useNavigate();
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
  const groupOptions = useCallback(
    () =>
      groups?.map((group) => {
        const { id, title } = group;
        return {
          key: id,
          value: id,
          title,
        };
      }),
    [groups]
  );
  const { id } = props;
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.footerSettings.activeTab);

  const onUpdateSucess = useCallback(() => {
    notification.success({ message: SUCCESS_GENERIC });

    if (activeTab != FooterSettingsTabKeys.FOOTER_LINKS) {
      // make sure that the active tab is footer link
      dispatch(updateActiveTab(FooterSettingsTabKeys.FOOTER_LINKS));
    }

    switch (saveType) {
      case 'SAVE':
        navigate(URL_FOOTER_SETTINGS);
        break;

      case 'SAVE_ADD_ANOTHER':
        navigate(URL_ADD_FOOTER_LINK);
        break;

      default:
        break;
    }
  }, [navigate, saveType, activeTab, dispatch]);

  const handleEdit: FooterLinkFormProps['onSubmit'] = useCallback(
    (values) => {
      setSubmitting(true);

      updateFooterLink({ url: ENDPOINT_FOOTER_LINKS, data: values, id })
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
    [updateFooterLink, onUpdateSucess, id]
  );
  // submit form
  const handleFormAction = useCallback(
    (saveType: SaveType) => {
      setSaveType(saveType);
      form.submit();
    },
    [form]
  );
  const getFooterLink = useCallback(() => links?.find((link) => link.id == id), [id, links]);

  if (isLoading) {
    return <Skeleton active />;
  }

  const footerLink = getFooterLink();

  if (error || !footerLink) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const { title, link_to, group, sort_order } = footerLink;
  const formProps: FooterLinkFormProps = {
    form: form,
    initialValues: {
      title,
      link_to: link_to.id,
      group: group?.id,
      sort_order,
    },
    onSubmit: handleEdit,
    linkToOptions: linkToOptions() || [],
    groupOptions: groupOptions(),
  };
  const formActionProps: GenericFormActionsProps = {
    onActionClick: handleFormAction,
    isSubmittingSaveType: isSubmitting ? saveType : undefined,
  };

  return (
    <>
      <FooterLinkForm {...formProps} />
      <GenericFormActions {...formActionProps} />
    </>
  );
};

export { FooterLinkEdit };
