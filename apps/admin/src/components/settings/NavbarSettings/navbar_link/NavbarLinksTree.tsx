import { Button, Empty, Result, Skeleton, Tree, TreeProps, Space } from 'antd';
import { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ENDPOINT_NAVBAR_LINKS,
  URL_ADD_NAVBAR_LINK,
  URL_EDIT_NAVBAR_LINK,
} from '../../../../configs/constants';
import { ERROR_GENERIC, ADD_MENU_LINK } from '../../../../configs/lang';
import { useGetNavbarLinksQuery } from '../../../../services/api';
import { getParentNavbarLinksIds, getNavbarLinksTreeData } from './utils';

const NavbarLinksTree = () => {
  const {
    data: links,
    error,
    isLoading,
  } = useGetNavbarLinksQuery(`${ENDPOINT_NAVBAR_LINKS}no-cache/`);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setExpandedKeys(getParentNavbarLinksIds(links || []));
  }, [links]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  if (!links) {
    return <Empty />;
  }

  const onSelect: TreeProps['onSelect'] = (_, info) => {
    navigate(`${URL_EDIT_NAVBAR_LINK}/${info.node.key}`);
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
          navigate(URL_ADD_NAVBAR_LINK);
        }}
      >
        {ADD_MENU_LINK}
      </Button>
      <Tree
        showLine={{ showLeafIcon: false }}
        showIcon={false}
        expandedKeys={expandedKeys}
        onSelect={onSelect}
        treeData={getNavbarLinksTreeData(links || [])}
        onExpand={onExpand}
      />
    </Space>
  );
};

export { NavbarLinksTree };
