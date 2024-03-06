import { Card } from 'antd';
import { TextBlock } from '../../../../pageSlice';
import { GenericTextEditor } from '../GenericTextEditor';
import { BlockEditMenu, BlockEditMenuProps } from '../BlockEditMenu';

export interface TextEditorProps extends Omit<BlockEditMenuProps, 'onSettings'> {
  block: TextBlock;
  onBlockChanged: (block: TextBlock) => void;
}

const TextEditor: React.FC<TextEditorProps> = (props: TextEditorProps) => {
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
          editorState={block.content}
          onEditorStateChange={(editorState) => {
            onBlockChanged({ ...block, content: editorState });
          }}
        />
      </Card>
    </div>
  );
};

export { TextEditor };
