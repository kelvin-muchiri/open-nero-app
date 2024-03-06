import { Button, Drawer, Space } from 'antd';
import { APPLY, CANCEL } from '../../configs/lang';

export interface DrawerSettingsProps {
  title: string;
  visible: boolean;
  children: React.ReactNode;
  onApply: () => void;
  onClose: () => void;
}

const DrawerSettings: React.FC<DrawerSettingsProps> = (props: DrawerSettingsProps) => {
  const { children, title, visible, onClose, onApply } = props;

  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      visible={visible}
      maskClosable={false}
      extra={
        <Space>
          <Button type="text" onClick={onClose}>
            {CANCEL}
          </Button>
          <Button type="primary" onClick={onApply}>
            {APPLY}
          </Button>
        </Space>
      }
    >
      {children}
    </Drawer>
  );
};

export { DrawerSettings };
