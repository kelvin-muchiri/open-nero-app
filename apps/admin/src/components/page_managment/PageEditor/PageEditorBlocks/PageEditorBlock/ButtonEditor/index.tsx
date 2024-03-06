import { Button, Card, Col, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { BUTTON } from '../../../../../../configs/lang';
import { DrawerSettings } from '../../../../../DrawerSettings';
import { ButtonBlock } from '../../../../pageSlice';
import { BlockEditMenu, BlockEditMenuProps } from '../BlockEditMenu';
import { ButtonEditorForm } from './ButtonEditorForm';

export interface ButtonEditorProps extends Omit<BlockEditMenuProps, 'onSettings'> {
  block: ButtonBlock;
  onBlockChanged: (block: ButtonBlock) => void;
}

const ButtonEditor: React.FC<ButtonEditorProps> = (props: ButtonEditorProps) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [form] = useForm();
  const {
    block,
    onBlockChanged,
    onDelete,
    onMoveDown,
    onMoveUp,
    showDelete,
    showMoveDown,
    showMoveUp,
  } = props;

  const showDrawer = () => {
    setDrawerVisible(true);
  };
  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="page-editor-block">
      <DrawerSettings
        title={BUTTON}
        onClose={closeDrawer}
        visible={drawerVisible}
        onApply={() => form.submit()}
      >
        <ButtonEditorForm
          form={form}
          block={block}
          onSubmit={(values) => {
            onBlockChanged(values);
            setDrawerVisible(false);
          }}
        />
      </DrawerSettings>

      <BlockEditMenu
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={onDelete}
        onSettings={showDrawer}
        showDelete={showDelete}
        showMoveDown={showMoveDown}
        showMoveUp={showMoveUp}
      />
      <Card>
        <Row justify="space-around" align="middle">
          <Col span={4}>
            <Button type="primary" size={block.size}>
              {block.name}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export { ButtonEditor };
