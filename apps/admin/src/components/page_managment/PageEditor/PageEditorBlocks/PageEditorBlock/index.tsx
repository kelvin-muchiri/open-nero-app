import { ContentBlock } from '../../../pageSlice';
import { TextEditor } from './TextEditor';
import { PageImageEditor } from './PageImageEditor';
import { CollapseEditor } from './CollapseEditor';
import { GridEditor } from './GridEditor';
import { ButtonEditor } from './ButtonEditor';
import { ReviewEditor } from './ReviewEditor';

export interface PageEditorBlockProps {
  showImageWideWidthCheck?: boolean;
  block: ContentBlock;
  showMoveUp: boolean;
  showMoveDown: boolean;
  index: number;
  showDelete?: boolean;
  onMoveUp: (childIndex?: number) => void;
  onMoveDown: (childIndex?: number) => void;
  onDelete?: (childIndex?: number) => void;
  onBlockChanged: (block: ContentBlock, childIndex?: number) => void;
}

const PageEditorBlock: React.FC<PageEditorBlockProps> = (props: PageEditorBlockProps) => {
  const {
    onMoveUp,
    onMoveDown,
    onBlockChanged,
    block,
    showImageWideWidthCheck,
    onDelete,
    showDelete,
    showMoveDown,
    showMoveUp,
    index,
  } = props;

  return (
    <>
      {block.type == 'text' && (
        <TextEditor
          block={block}
          onMoveUp={() => onMoveUp()}
          onMoveDown={() => onMoveDown()}
          onDelete={onDelete ? () => onDelete() : undefined}
          onBlockChanged={(block) => onBlockChanged(block)}
          showDelete={showDelete}
          showMoveDown={showMoveDown}
          showMoveUp={showMoveUp}
        />
      )}
      {block.type == 'image' && (
        <PageImageEditor
          block={block}
          onMoveUp={() => onMoveUp()}
          onMoveDown={() => onMoveDown()}
          onDelete={onDelete ? () => onDelete() : undefined}
          onBlockChanged={(values) => onBlockChanged(values)}
          showImageWideWidthCheck={showImageWideWidthCheck}
          showDelete={showDelete}
          showMoveDown={showMoveDown}
          showMoveUp={showMoveUp}
        />
      )}
      {block.type == 'collapse' && (
        <CollapseEditor
          block={block}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
          onBlockChanged={onBlockChanged}
          showMoveDown={showMoveDown}
          showMoveUp={showMoveUp}
          showDelete={showDelete}
        />
      )}
      {block.type == 'grid' && (
        <GridEditor
          index={index}
          block={block}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
          onBlockChanged={onBlockChanged}
          showMoveDown={showMoveDown}
          showMoveUp={showMoveUp}
          showDelete={showDelete}
        />
      )}
      {block.type == 'button' && (
        <ButtonEditor
          block={block}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
          onBlockChanged={onBlockChanged}
          showMoveDown={showMoveDown}
          showMoveUp={showMoveUp}
          showDelete={showDelete}
        />
      )}
      {block.type == 'review' && (
        <ReviewEditor
          block={block}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
          onBlockChanged={onBlockChanged}
          showMoveDown={showMoveDown}
          showMoveUp={showMoveUp}
          showDelete={showDelete}
        />
      )}
    </>
  );
};

export { PageEditorBlock };
