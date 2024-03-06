import { ContentBlock } from '../../pageSlice';
import { PageEditorBlock } from './PageEditorBlock';

export interface PageEditorBlocksProps {
  blocks: ContentBlock[];
  onMoveUp: (index: number, parentIndex?: number) => void;
  onMoveDown: (index: number, parentIndex?: number) => void;
  onDelete: (index: number, parentIndex?: number) => void;
  onBlockChanged: (block: ContentBlock, index: number, parentIndex?: number) => void;
}

const PageEditorBlocks: React.FC<PageEditorBlocksProps> = (props: PageEditorBlocksProps) => {
  const { blocks, onMoveUp, onMoveDown, onDelete, onBlockChanged } = props;

  return (
    <div className="page-editor__blocks">
      {blocks.map((block, index) => (
        <div key={index} className="page-editor__block">
          <PageEditorBlock
            index={index}
            block={block}
            showMoveUp={index != 0}
            showMoveDown={index != blocks.length - 1}
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

export { PageEditorBlocks };
