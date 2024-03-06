import { Button, Popconfirm } from 'antd';
import './style.css';
import {
  DELETE,
  LOADING,
  POPUP_CANCEL,
  POPUP_DELETE,
  POPUP_OK,
  SAVE,
  SAVE_ADD_ANOTHER,
  SAVE_CONTINUE_EDITING,
} from '../../configs/lang';

export type SaveType = 'SAVE' | 'SAVE_ADD_ANOTHER' | 'SAVE_CONTINUE_EDITING' | 'DELETE';

export interface GenericFormActionsProps {
  isSubmittingSaveType?: SaveType; // save type being submitted
  onActionClick: (saveType: SaveType) => void; // function to call when action is clicked
  showDelete?: boolean; // whether to show delete button or not
}

const GenericFormActions: React.FC<GenericFormActionsProps> = (props: GenericFormActionsProps) => {
  const { isSubmittingSaveType, onActionClick, showDelete } = props;

  const handleActionClick = (saveType: SaveType) => {
    onActionClick(saveType);
  };

  return (
    <div className="generic-form-actions">
      <div className="generic-form-actions__action">
        <Button
          type="primary"
          disabled={!!isSubmittingSaveType}
          onClick={() => handleActionClick('SAVE')}
        >
          {isSubmittingSaveType == 'SAVE' ? LOADING : SAVE}
        </Button>
      </div>
      <div className="generic-form-actions__action">
        <Button
          type="default"
          disabled={!!isSubmittingSaveType}
          onClick={() => handleActionClick('SAVE_ADD_ANOTHER')}
        >
          {isSubmittingSaveType == 'SAVE_ADD_ANOTHER' ? LOADING : SAVE_ADD_ANOTHER}
        </Button>
      </div>
      <div className="generic-form-actions__action">
        <Button
          type="default"
          disabled={!!isSubmittingSaveType}
          onClick={() => handleActionClick('SAVE_CONTINUE_EDITING')}
        >
          {isSubmittingSaveType == 'SAVE_CONTINUE_EDITING' ? LOADING : SAVE_CONTINUE_EDITING}
        </Button>
      </div>
      {!!showDelete && (
        <div className="generic-form-actions__action">
          <Popconfirm
            title={POPUP_DELETE}
            onConfirm={() => {
              handleActionClick('DELETE');
            }}
            okText={POPUP_OK}
            cancelText={POPUP_CANCEL}
          >
            <Button type="primary" danger>
              {DELETE}
            </Button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
};

export { GenericFormActions };
