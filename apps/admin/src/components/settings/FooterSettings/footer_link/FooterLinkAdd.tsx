import { notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_FOOTER_GROUPS,
  ENDPOINT_FOOTER_LINKS,
  ENDPOINT_PAGES,
  URL_EDIT_FOOTER_LINK,
  URL_FOOTER_SETTINGS,
} from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { FooterLinkMutationResponse } from '@nero/query-api-service';
import { GenericFormActions, GenericFormActionsProps, SaveType } from '../../../GenericFormActions';
import { FooterSettingsTabKeys, updateActiveTab } from '../reducers/footer-settings-slice';
import { FooterLinkForm, FooterLinkFormProps } from './FooterLinkForm';
import {
  useCreateFooterLinkMutation,
  useGetDraftPagesQuery,
  useGetFooterGroupsQuery,
} from '../../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';

const FooterLinkAdd = () => {
  const [createFooterLink] = useCreateFooterLinkMutation();
  const { data: pages } = useGetDraftPagesQuery({
    url: ENDPOINT_PAGES,
    params: { is_public: true },
  });
  const { data: groups } = useGetFooterGroupsQuery(`${ENDPOINT_FOOTER_GROUPS}no-cache/`);
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
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.footerSettings.activeTab);

  const onAddSuccess = useCallback(
    (res: FooterLinkMutationResponse) => {
      notification.success({ message: SUCCESS_GENERIC });

      if (activeTab != FooterSettingsTabKeys.FOOTER_LINKS) {
        // make sure that the active tab is footer links
        dispatch(updateActiveTab(FooterSettingsTabKeys.FOOTER_LINKS));
      }

      switch (saveType) {
        case 'SAVE':
          navigate(URL_FOOTER_SETTINGS);
          break;

        case 'SAVE_CONTINUE_EDITING':
          navigate(`${URL_EDIT_FOOTER_LINK}/${res.id}`);
          break;

        default:
          form.resetFields();
      }
    },
    [form, navigate, saveType, activeTab, dispatch]
  );

  const handleAdd: FooterLinkFormProps['onSubmit'] = useCallback(
    (values) => {
      setSubmitting(true);

      createFooterLink({ url: ENDPOINT_FOOTER_LINKS, data: values })
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
    [createFooterLink, onAddSuccess]
  );

  // submit form
  const handleFormAction = useCallback(
    (saveType: SaveType) => {
      setSaveType(saveType);
      form.submit();
    },
    [form]
  );

  const formActionProps: GenericFormActionsProps = {
    onActionClick: handleFormAction,
    isSubmittingSaveType: isSubmitting ? saveType : undefined,
  };

  const formProps: FooterLinkFormProps = {
    form,
    onSubmit: handleAdd,
    linkToOptions: linkToOptions() || [],
    groupOptions: groupOptions(),
  };

  return (
    <>
      <FooterLinkForm {...formProps} />
      <GenericFormActions {...formActionProps} />
    </>
  );
};

export { FooterLinkAdd };
