import { memo } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Tooltip, Button, Space, Row, Col } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { moveUp, moveDown, removeBlock, updateBlock, PageState, addBlock } from '../pageSlice';
import {
  PAGE,
  SAVE_DRAFT,
  PAGE_SETTINGS,
  PUBLISH,
  PUBLISH_HELP,
  SAVE_DRAFT_HELP,
  PREVIEW,
  PREVIEW_HELP,
} from '../../../configs/lang';
import { PageSettings } from '../PageSettings';
import { Link } from 'react-router-dom';
import { URL_PREVIEW_PAGE } from '../../../configs/constants';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { BlockAdd } from './BlockAdd';
import { PageEditorBlocks } from './PageEditorBlocks';
import { DrawerSettings } from '../../DrawerSettings';

export interface PageEditorProps {
  onSave: (data: PageState, publish?: boolean) => void;
  pageId?: string;
}

const PageEditor: React.FC<PageEditorProps> = (props: PageEditorProps) => {
  const page = useAppSelector((state) => state.page);
  const dispatch = useAppDispatch();
  const [optionsVisible, setOptionsVisible] = useState<boolean>();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [settingsForm] = useForm();

  const showDrawer = () => {
    setDrawerVisible(true);
  };
  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const { onSave } = props;

  return (
    <div className="page-editor">
      <DrawerSettings
        title={PAGE}
        onClose={closeDrawer}
        visible={drawerVisible}
        onApply={() => settingsForm.submit()}
      >
        <PageSettings
          form={settingsForm}
          onFinish={() => {
            closeDrawer();
          }}
          pageId={props.pageId}
        />
      </DrawerSettings>

      <Row>
        <Col md={24}>
          <Space className="page-editor__actions">
            <Tooltip title={SAVE_DRAFT_HELP} placement="top">
              <Button type="link" onClick={() => onSave(page)} size="small">
                {SAVE_DRAFT}
              </Button>
            </Tooltip>

            {props.pageId && (
              <Tooltip title={PREVIEW_HELP} placement="top">
                <Link
                  target={'_blank'}
                  to={`${URL_PREVIEW_PAGE}/${props.pageId}`}
                  className="ant-btn ant-btn-link ant-btn-sm"
                >
                  {PREVIEW}
                </Link>
              </Tooltip>
            )}

            <Tooltip title={PUBLISH_HELP} placement="top">
              <Button type="primary" size="small" onClick={() => onSave(page, true)}>
                {PUBLISH}
              </Button>
            </Tooltip>

            <Tooltip title={PAGE_SETTINGS} placement="top">
              <SettingOutlined onClick={showDrawer} style={{ fontSize: '16px' }} />
            </Tooltip>
          </Space>
        </Col>
        <h1 className="page-editor__heading">{page.title}</h1>
      </Row>

      <PageEditorBlocks
        blocks={page.draft}
        onMoveUp={(index, parentIndex) => {
          dispatch(moveUp({ currentIndex: index, parentIndex }));
        }}
        onMoveDown={(index, parentIndex) => {
          dispatch(moveDown({ currentIndex: index, parentIndex }));
        }}
        onDelete={(index, parentIndex) => {
          dispatch(removeBlock({ index, parentIndex }));
        }}
        onBlockChanged={(block, index, parentIndex) => {
          dispatch(
            updateBlock({
              index,
              parentIndex,
              block,
            })
          );
        }}
      />

      <BlockAdd
        optionsVisible={optionsVisible}
        onVisibleChange={(visible) => {
          setOptionsVisible(visible);
        }}
        onClick={(block) => {
          dispatch(addBlock(block));
          setOptionsVisible(false);
        }}
      />
    </div>
  );
};

export { PageEditor };

export const MemoizedPageEditor = memo(PageEditor);
