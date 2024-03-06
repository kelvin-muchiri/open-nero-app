import { SettingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Tooltip } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { memo, useCallback, useState } from 'react';
import { ENDPOINT_BLOG_CATEGORIES, ENDPOINT_BLOG_TAGS } from '../../../../configs/constants';
import {
  POST,
  POST_SETTINGS,
  PUBLISH,
  PUBLISH_HELP,
  SAVE_DRAFT,
  SAVE_DRAFT_HELP,
} from '../../../../configs/lang';
import { useGetPostCategoriesQuery, useGetPostTagsQuery } from '../../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { DrawerSettings } from '../../../DrawerSettings';
import { BlockAdd } from '../../../page_managment/PageEditor/BlockAdd';
import {
  addBlock,
  changeBlog,
  moveDown,
  moveUp,
  PostState,
  removeBlock,
  updateBlock,
} from '../../blogSlice';
import { getCategoriesTreeData } from '../../category/utils';
import { PostForm } from '../PostForm';
import { PostEditorBlocks } from './PostEditorBlocks';

export interface PostEditorProps {
  onSave: (data: PostState, publish?: boolean) => void;
  postId?: string;
}

const PostEditor: React.FC<PostEditorProps> = (props: PostEditorProps) => {
  const blog = useAppSelector((state) => state.blog);
  const [optionsVisible, setOptionsVisible] = useState<boolean>();
  const dispatch = useAppDispatch();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [settingsForm] = useForm();
  const { data: tags } = useGetPostTagsQuery({ url: `${ENDPOINT_BLOG_TAGS}no-cache/` });
  const { data: categories } = useGetPostCategoriesQuery({
    url: `${ENDPOINT_BLOG_CATEGORIES}no-cache/`,
  });
  const getTagOptions = useCallback(() => {
    return (
      tags?.map((tag) => {
        const { id, name } = tag;
        return {
          key: id,
          value: id,
          title: name,
        };
      }) ?? []
    );
  }, [tags]);
  const getCategoryOptions = useCallback(
    () => getCategoriesTreeData(categories || []),
    [categories]
  );

  const showDrawer = () => {
    setDrawerVisible(true);
  };
  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const { postId, onSave } = props;

  return (
    <div className="page-editor">
      <DrawerSettings
        title={POST}
        onClose={closeDrawer}
        visible={drawerVisible}
        onApply={() => settingsForm.submit()}
      >
        <PostForm
          form={settingsForm}
          initialValues={{
            title: blog.title,
            slug: blog.slug,
            seo_title: blog.seoTitle,
            seo_description: blog.seoDescription,
            is_featured: blog.isFeatured,
            is_pinned: blog.isPinned,
            is_published: blog.isPublished,
            featured_image: blog.featuredImage,
            tags: blog.tags,
            categories: blog.categories,
          }}
          tagOptions={getTagOptions()}
          categoryOptions={getCategoryOptions()}
          onSubmit={(values) => {
            const {
              title,
              slug,
              seo_title,
              seo_description,
              is_published,
              is_featured,
              is_pinned,
              featured_image,
              tags,
              categories,
            } = values;
            dispatch(
              changeBlog({
                ...blog,
                title,
                slug,
                seoTitle: seo_title,
                seoDescription: seo_description,
                isPublished: is_published ?? false,
                isFeatured: is_featured ?? false,
                isPinned: is_pinned ?? false,
                featuredImage: featured_image ?? null,
                tags: tags ?? [],
                categories: categories ?? [],
              })
            );
            closeDrawer();
          }}
          postId={postId}
        />
      </DrawerSettings>

      <Row>
        <Col md={24}>
          <Space className="page-editor__actions">
            <Tooltip title={SAVE_DRAFT_HELP} placement="top">
              <Button type="link" onClick={() => onSave(blog)} size="small">
                {SAVE_DRAFT}
              </Button>
            </Tooltip>

            <Tooltip title={PUBLISH_HELP} placement="top">
              <Button type="primary" size="small" onClick={() => onSave(blog, true)}>
                {PUBLISH}
              </Button>
            </Tooltip>

            <Tooltip title={POST_SETTINGS} placement="top">
              <SettingOutlined onClick={showDrawer} style={{ fontSize: '16px' }} />
            </Tooltip>
          </Space>
        </Col>
        <h1 className="page-editor__heading">{blog.title}</h1>
      </Row>

      <PostEditorBlocks
        blocks={blog.draft}
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
        options={['text', 'image', 'button', 'grid', 'collapse']}
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

export { PostEditor };

export const MemoizedPostEditor = memo(PostEditor);
