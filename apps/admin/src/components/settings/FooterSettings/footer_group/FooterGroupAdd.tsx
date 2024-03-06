import { notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_FOOTER_GROUPS,
  URL_EDIT_FOOTER_GROUP,
  URL_FOOTER_SETTINGS,
} from '../../../../configs/constants';
import { ERROR_GENERIC, SUCCESS_GENERIC } from '../../../../configs/lang';
import { FooterGroupMutationResponse } from '@nero/query-api-service';
import { GenericFormActions, GenericFormActionsProps, SaveType } from '../../../GenericFormActions';
import { FooterSettingsTabKeys, updateActiveTab } from '../reducers/footer-settings-slice';
import { FooterGroupForm, FooterGroupFormProps } from './FooterGroupForm';
import { useCreateFooterGroupMutation } from '../../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';

const FooterGroupAdd = () => {
  const [createFooterGroup] = useCreateFooterGroupMutation();
  const navigate = useNavigate();
  const [form] = useForm();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>('SAVE');
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.footerSettings.activeTab);

  const onAddSuccess = useCallback(
    (res: FooterGroupMutationResponse) => {
      notification.success({ message: SUCCESS_GENERIC });

      if (activeTab != FooterSettingsTabKeys.FOOTER_GROUPS) {
        // make sure that the active tab is footer group
        dispatch(updateActiveTab(FooterSettingsTabKeys.FOOTER_GROUPS));
      }

      switch (saveType) {
        case 'SAVE':
          navigate(URL_FOOTER_SETTINGS);
          break;

        case 'SAVE_CONTINUE_EDITING':
          navigate(`${URL_EDIT_FOOTER_GROUP}/${res.id}`);
          break;

        default:
          form.resetFields();
      }
    },
    [form, navigate, saveType, activeTab, dispatch]
  );

  const handleAdd: FooterGroupFormProps['onSubmit'] = useCallback(
    (values) => {
      setSubmitting(true);

      createFooterGroup({ url: ENDPOINT_FOOTER_GROUPS, data: values })
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
    [createFooterGroup, onAddSuccess]
  );

  // submit form
  const handleFormAction = useCallback(
    (saveType: SaveType) => {
      setSaveType(saveType);
      form.submit();
    },
    [form]
  );

  const formProps: FooterGroupFormProps = {
    onSubmit: handleAdd,
    form,
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

export { FooterGroupAdd };
