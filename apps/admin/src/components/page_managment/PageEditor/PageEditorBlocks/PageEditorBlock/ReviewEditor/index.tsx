import { Card, Rate } from 'antd';
import { ReviewBlock } from '../../../../pageSlice';
import { BlockEditMenu, BlockEditMenuProps } from '../BlockEditMenu';

export interface ReviewEditorProps extends Omit<BlockEditMenuProps, 'onSettings'> {
  block: ReviewBlock;
  onBlockChanged: (block: ReviewBlock) => void;
}

const ReviewEditor: React.FC<ReviewEditorProps> = (props: ReviewEditorProps) => {
  const { onMoveDown, onMoveUp, onDelete, showDelete, showMoveDown, showMoveUp } = props;

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
        <Rate value={3.5} disabled={true} />
      </Card>
    </div>
  );
};

export { ReviewEditor };
