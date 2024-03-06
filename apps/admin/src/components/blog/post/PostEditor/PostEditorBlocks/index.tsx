import { ContentBlock } from '../../../../page_managment/pageSlice';
import { PostEditorBlock } from './PostEditorBlock';

export interface PostEditorBlocksProps {
  blocks: ContentBlock[];
  onMoveUp: (index: number, parentIndex?: number) => void;
  onMoveDown: (index: number, parentIndex?: number) => void;
  onDelete: (index: number, parentIndex?: number) => void;
  onBlockChanged: (block: ContentBlock, index: number, parentIndex?: number) => void;
}

const PostEditorBlocks: React.FC<PostEditorBlocksProps> = (props: PostEditorBlocksProps) => {
  const { blocks, onMoveUp, onMoveDown, onDelete, onBlockChanged } = props;

  return (
    <div className="page-editor__blocks">
      {blocks.map((block, index) => (
        <div key={index} className="page-editor__block">
          <PostEditorBlock
            index={index}
            block={block}
            showMoveDown={index != blocks.length - 1}
            showMoveUp={index != 0}
            showDelete={true}
            showImageWideWidthCheck={true}
            onMoveUp={(childIndex) => {
              let currentIndex = index;
              let parentIndex: number | undefined = undefined;

              if (childIndex != undefined) {
                currentIndex = childIndex;
                parentIndex = index;
              }

              onMoveUp(currentIndex, parentIndex);
            }}
            onMoveDown={(childIndex) => {
              let currentIndex = index;
              let parentIndex: number | undefined = undefined;

              if (childIndex != undefined) {
                currentIndex = childIndex;
                parentIndex = index;
              }

              onMoveDown(currentIndex, parentIndex);
            }}
            onDelete={(childIndex) => {
              let currentIndex = index;
              let parentIndex: number | undefined = undefined;

              if (childIndex != undefined) {
                currentIndex = childIndex;
                parentIndex = index;
              }

              onDelete(currentIndex, parentIndex);
            }}
            onBlockChanged={(values, childIndex) => {
              let currentIndex = index;
              let parentIndex: number | undefined = undefined;

              if (childIndex != undefined) {
                currentIndex = childIndex;
                parentIndex = index;
              }

              onBlockChanged(values, currentIndex, parentIndex);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export { PostEditorBlocks };
