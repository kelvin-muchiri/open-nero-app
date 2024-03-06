import { notification, Result, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_FOOTER_GROUPS,
  URL_ADD_FOOTER_GROUP,
  URL_FOOTER_SETTINGS,
} from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { useGetFooterGroupsQuery, useUpdateFooterGroupMutation } from '../../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { GenericFormActions, GenericFormActionsProps, SaveType } from '../../../GenericFormActions';
import { FooterSettingsTabKeys, updateActiveTab } from '../reducers/footer-settings-slice';
import { FooterGroupForm, FooterGroupFormProps } from './FooterGroupForm';

export interface FootGroupEditProps {
  id: string;
}

const FooterGroupEdit: React.FC<FootGroupEditProps> = (props: FootGroupEditProps) => {
  const {
    data: groups,
    error,
    isLoading,
  } = useGetFooterGroupsQuery(`${ENDPOINT_FOOTER_GROUPS}no-cache/`);
  const [updateFooterGroup] = useUpdateFooterGroupMutation();
  const { id } = props;
  const getGroup = useCallback(() => groups?.find((group) => group.id == id), [groups, id]);
  const navigate = useNavigate();
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.footerSettings.activeTab);

  const onUpdateSucess = useCallback(() => {
    notification.success({ message: SUCCESS_GENERIC });

    if (activeTab != FooterSettingsTabKeys.FOOTER_GROUPS) {
      // make sure that the active tab is footer group
      dispatch(updateActiveTab(FooterSettingsTabKeys.FOOTER_GROUPS));
    }

    switch (saveType) {
      case 'SAVE':
        navigate(URL_FOOTER_SETTINGS);
        break;

      case 'SAVE_ADD_ANOTHER':
        navigate(URL_ADD_FOOTER_GROUP);
        break;

      default:
        break;
    }
  }, [navigate, saveType, activeTab, dispatch]);

  const handleUpdate: FooterGroupFormProps['onSubmit'] = useCallback(
    (values) => {
      setSubmitting(true);

      updateFooterGroup({ url: ENDPOINT_FOOTER_GROUPS, data: values, id })
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
    [updateFooterGroup, id, onUpdateSucess]
  );

  // submit form
  const handleFormAction = useCallback(
    (saveType: SaveType) => {
      setSaveType(saveType);
      form.submit();
    },
    [form]
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  const group = getGroup();

  if (error || !group) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const formProps: FooterGroupFormProps = {
    form: form,
    initialValues: {
      title: group.title,
      sort_order: group.sort_order,
    },
    onSubmit: handleUpdate,
  };
  const formActionProps: GenericFormActionsProps = {
    onActionClick: handleFormAction,
    isSubmittingSaveType: isSubmitting ? saveType : undefined,
  };

  return (
    <>
      <FooterGroupForm {...formProps} />
      <GenericFormActions {...formActionProps} />
    </>
  );
};

export { FooterGroupEdit };
