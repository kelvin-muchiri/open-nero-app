import { PageEditorBlockProps } from '../../../../../page_managment/PageEditor/PageEditorBlocks/PageEditorBlock';
import { ButtonEditor } from '../../../../../page_managment/PageEditor/PageEditorBlocks/PageEditorBlock/ButtonEditor';
import { CollapseEditor } from '../../../../../page_managment/PageEditor/PageEditorBlocks/PageEditorBlock/CollapseEditor';
import { TextEditor } from '../../../../../page_managment/PageEditor/PageEditorBlocks/PageEditorBlock/TextEditor';
import { GridEditor } from './GridEditor';
import { PostImageEditor } from './PostImageEditor';

export type PostEditorBlockProps = PageEditorBlockProps;

const PostEditorBlock: React.FC<PostEditorBlockProps> = (props: PostEditorBlockProps) => {
  const {
    onMoveUp,
    onMoveDown,
    onDelete,
    onBlockChanged,
    block,
    showImageWideWidthCheck,
    showMoveDown,
    showMoveUp,
    showDelete,
    index,
  } = props;

  return (
    <>
      {block.type == 'text' && (
        <TextEditor
          block={block}
          showMoveDown={showMoveDown}
          showMoveUp={showMoveUp}
          showDelete={showDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
          onBlockChanged={onBlockChanged}
        />
      )}
      {block.type == 'image' && (
        <PostImageEditor
          block={block}
          showMoveDown={showMoveDown}
          showMoveUp={showMoveUp}
          showDelete={showDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
          onBlockChanged={onBlockChanged}
          showImageWideWidthCheck={showImageWideWidthCheck}
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
    </>
  );
};

export { PostEditorBlock };
