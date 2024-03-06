import {
  DeleteOutlined,
  DownOutlined,
  MoreOutlined,
  SettingOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Popover, Space } from 'antd';

export interface BlockEditMenuProps {
  showMoveUp: boolean;
  showMoveDown: boolean;
  showDelete?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete?: () => void;
  onSettings?: () => void;
}

const BlockEditMenu: React.FC<BlockEditMenuProps> = (props: BlockEditMenuProps) => {
  const { onMoveUp, onMoveDown, onDelete, onSettings, showDelete, showMoveDown, showMoveUp } =
    props;

  return (
    <div className="page-editor-block__options-menu">
      <Popover
        content={
          <Space className="options-menu" direction="vertical">
            {onSettings && <SettingOutlined onClick={() => onSettings()} />}
            {showMoveUp && <UpOutlined onClick={() => onMoveUp()} />}
            {showMoveDown && <DownOutlined onClick={() => onMoveDown()} />}
            {showDelete && <DeleteOutlined onClick={onDelete ? () => onDelete() : undefined} />}
          </Space>
        }
        placement="bottom"
      >
        <MoreOutlined style={{ fontSize: '16px' }} />
      </Popover>
    </div>
  );
};

export { BlockEditMenu };
