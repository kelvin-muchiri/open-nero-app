import { PlusOutlined } from '@ant-design/icons';
import { Button, Popover, Space, Tooltip } from 'antd';
import { ButtonSize } from 'antd/lib/button';
import { BUTTON, COLLAPSE, GRID, IMAGE, NEW_BLOCK, REVIEWS, TEXT } from '../../../configs/lang';
import { ContentBlock, PageBlockType } from '../pageSlice';
import { convertHTMLToDraftJs } from './PageEditorBlocks/PageEditorBlock/GenericTextEditor/utils';

export interface BlockAddProps {
  options?: PageBlockType[];
  optionsVisible?: boolean;
  size?: ButtonSize;
  onClick: (block: ContentBlock) => void;
  onVisibleChange?: (visible: boolean) => void;
}

const BlockAdd: React.FC<BlockAddProps> = (props: BlockAddProps) => {
  const { onClick, optionsVisible, onVisibleChange, options, size } = props;
  const enabledOptions = options || ['text', 'image', 'button', 'collapse', 'grid', 'review'];

  return (
    <Popover
      placement="bottom"
      content={
        <Space direction="vertical">
          {enabledOptions.map((option) => {
            switch (option) {
              case 'text':
                return (
                  <Button
                    type="text"
                    onClick={() => {
                      onClick({
                        type: 'text',
                        content: convertHTMLToDraftJs('<p>Text</p>'),
                      });
                    }}
                  >
                    {TEXT}
                  </Button>
                );
              case 'image':
                return (
                  <Button
                    type="text"
                    onClick={() => {
                      onClick({
                        type: 'image',
                        src: '',
                        width: 350,
                        height: 300,
                      });
                    }}
                  >
                    {IMAGE}
                  </Button>
                );
              case 'button':
                return (
                  <Button
                    type="text"
                    onClick={() => {
                      onClick({
                        type: 'button',
                        linkTo: '',
                        name: 'Button',
                      });
                    }}
                  >
                    {BUTTON}
                  </Button>
                );
              case 'collapse':
                return (
                  <Button
                    type="text"
                    onClick={() => {
                      onClick({
                        type: 'collapse',
                        header: convertHTMLToDraftJs('<p>Title</p>'),
                        body: convertHTMLToDraftJs('<p>Body</p>'),
                      });
                    }}
                  >
                    {COLLAPSE}
                  </Button>
                );
              case 'grid':
                return (
                  <Button
                    type="text"
                    onClick={() => {
                      onClick({
                        type: 'grid',
                        children: [null, null],
                      });
                    }}
                  >
                    {GRID}
                  </Button>
                );
              case 'review':
                return (
                  <Button
                    type="text"
                    onClick={() => {
                      onClick({
                        type: 'review',
                      });
                    }}
                  >
                    {REVIEWS}
                  </Button>
                );
            }
          })}
        </Space>
      }
      trigger="click"
      visible={optionsVisible}
      onVisibleChange={onVisibleChange}
    >
      <Tooltip title={NEW_BLOCK} placement="top">
        <Button type="primary" shape="circle" icon={<PlusOutlined />} size={size} />
      </Tooltip>
    </Popover>
  );
};

export { BlockAdd };
