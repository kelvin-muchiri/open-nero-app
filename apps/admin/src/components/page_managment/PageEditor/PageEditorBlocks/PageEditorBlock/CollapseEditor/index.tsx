import { Card } from 'antd';
import { CollapseBlock } from '../../../../pageSlice';
import { GenericTextEditor } from '../GenericTextEditor';
import { BlockEditMenu, BlockEditMenuProps } from '../BlockEditMenu';

export interface CollapseEditorProps extends Omit<BlockEditMenuProps, 'onSettings'> {
  block: CollapseBlock;
  onBlockChanged: (block: CollapseBlock) => void;
}

const CollapseEditor: React.FC<CollapseEditorProps> = (props: CollapseEditorProps) => {
  const {
    onMoveDown,
    onMoveUp,
    onBlockChanged,
    block,
    onDelete,
    showDelete,
    showMoveDown,
    showMoveUp,
  } = props;

  return (
    <div className="page-editor-block">
      <BlockEditMenu
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={onDelete}
        showDelete={showDelete}
        showMoveDown={showMoveDown}
        showMoveUp={showMoveUp}
      />

      <Card>
        <GenericTextEditor
          editorState={block.header}
          onEditorStateChange={(editorState) => {
            onBlockChanged({ ...block, header: editorState });
          }}
        />
        <GenericTextEditor
          editorState={block.body}
          onEditorStateChange={(editorState) => {
            onBlockChanged({ ...block, body: editorState });
          }}
        />
      </Card>
    </div>
  );
};

export { CollapseEditor };
