import { DataNode } from 'antd/lib/tree';
import { TreeNode } from 'antd/lib/tree-select';

/**
 * build TreeSelect nodes
 *
 * @param {DataNode} data
 * @returns
 */
export const buildTreeSelectNode = (data: DataNode[]): React.ReactNode => {
  return data.map((datum) => {
    if (!datum.children?.length) {
      return <TreeNode key={datum.key} value={datum.key} title={datum.title} />;
    }

    return (
      <TreeNode key={datum.key} value={datum.key} title={datum.title}>
        {buildTreeSelectNode(datum.children)}
      </TreeNode>
    );
  });
};
