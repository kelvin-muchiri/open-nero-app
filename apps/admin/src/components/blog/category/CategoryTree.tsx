import { Button, Empty, Result, Skeleton, Space, Tree, TreeProps } from 'antd';
import { useState, Key, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_BLOG_CATEGORIES,
  URL_ADD_BLOG_CATEGORY,
  URL_EDIT_BLOG_CATEGORY,
} from '../../../configs/constants';
import { ADD_CATEGORY, ERROR_GENERIC } from '../../../configs/lang';
import { useGetPostCategoriesQuery } from '../../../services/api';
import { getParentCategoriesIds, getCategoriesTreeData } from './utils';

const CategoryTree = () => {
  const { data, error, isLoading } = useGetPostCategoriesQuery({
    url: `${ENDPOINT_BLOG_CATEGORIES}no-cache/`,
  });
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const navigate = useNavigate();
  const getParentIds = useCallback(() => getParentCategoriesIds(data || []), [data]);
  const getTreeData = useCallback(() => getCategoriesTreeData(data || []), [data]);

  useEffect(() => {
    setExpandedKeys(getParentIds());
  }, [getParentIds]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!data) {
    return <Empty />;
  }

  const onSelect: TreeProps['onSelect'] = (_, info) => {
    navigate(`${URL_EDIT_BLOG_CATEGORY}/${info.node.key}`);
  };

  const onExpand: TreeProps['onExpand'] = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button
        className="admin-table-header-actions"
        type="primary"
        onClick={() => {
          navigate(URL_ADD_BLOG_CATEGORY);
        }}
      >
        {ADD_CATEGORY}
      </Button>
      <Tree
        showLine={{ showLeafIcon: false }}
        showIcon={false}
        expandedKeys={expandedKeys}
        onSelect={onSelect}
        treeData={getTreeData()}
        onExpand={onExpand}
      />
    </Space>
  );
};

export { CategoryTree };
