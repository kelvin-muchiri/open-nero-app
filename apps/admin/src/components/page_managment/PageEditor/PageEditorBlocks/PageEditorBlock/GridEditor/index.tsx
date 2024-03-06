import { Card, Col, Row } from 'antd';
import { PageEditorBlock } from '..';
import { ContentBlock, GridBlock } from '../../../../pageSlice';
import { BlockEditMenu, BlockEditMenuProps } from '../BlockEditMenu';
import { GridBlockAdd } from './GridBlockAdd';

export interface GridEditorProps
  extends Pick<BlockEditMenuProps, 'showDelete' | 'showMoveDown' | 'showMoveUp'> {
  block: GridBlock;
  index: number;
  onMoveUp: (childIndex?: number) => void;
  onMoveDown: (childIndex?: number) => void;
  onDelete?: (childIndex?: number) => void;
  onBlockChanged: (block: ContentBlock, childIndex?: number) => void;
}

const GridEditor: React.FC<GridEditorProps> = (props: GridEditorProps) => {
  const {
    showMoveDown,
    showMoveUp,
    onMoveDown,
    onMoveUp,
    block,
    onBlockChanged,
    showDelete,
    onDelete,
    index,
  } = props;

  return (
    <div className="page-editor-block">
      <BlockEditMenu
        onMoveUp={() => onMoveUp()}
        onMoveDown={() => onMoveDown()}
        showMoveDown={showMoveDown}
        showMoveUp={showMoveUp}
        showDelete={showDelete}
        onDelete={onDelete ? () => onDelete() : undefined}
      />

      <Card>
        <Row gutter={15}>
          <Col md={12} xs={24}>
            {block.children[0] == null ? (
              <GridBlockAdd parentIndex={index} index={0} />
            ) : (
              <PageEditorBlock
                index={0}
                block={block.children[0]}
                showMoveDown={true}
                showMoveUp={false}
                showDelete={true}
                onMoveUp={() => {
                  onMoveUp(0);
                }}
                onMoveDown={() => {
                  onMoveDown(0);
                }}
                onBlockChanged={(values) => {
                  onBlockChanged(values, 0);
                }}
                onDelete={() => {
                  if (onDelete) {
                    onDelete(0);
                  }
                }}
              />
            )}
          </Col>

          <Col md={12} xs={24}>
            {block.children[1] == null ? (
              <GridBlockAdd parentIndex={index} index={1} />
            ) : (
              <PageEditorBlock
                index={1}
                block={block.children[1]}
                showMoveDown={false}
                showMoveUp={true}
                showDelete={true}
                onMoveUp={() => {
                  onMoveUp(1);
                }}
                onMoveDown={() => {
                  onMoveDown(1);
                }}
                onBlockChanged={(values) => {
                  onBlockChanged(values, 1);
                }}
                onDelete={() => {
                  if (onDelete) {
                    onDelete(1);
                  }
                }}
              />
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export { GridEditor };
