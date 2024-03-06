import { CategoryListItem } from '@nero/query-api-service';
import { DataNode } from 'antd/lib/tree';

/**
 * get all ids of parent categories
 *
 * @param {Category[]} categories categories
 * @returns {string[]} ids of parent categories
 */
export const getParentCategoriesIds = (categories: CategoryListItem[]): string[] => {
  let ids: string[] = [];

  categories.forEach((cat) => {
    if (cat.children.length) {
      ids = [cat.id, ...getParentCategoriesIds(cat.children)];
    }
  });

  return ids;
};

/**
 * parse the links into tree data
 *
 * @param {Category[]} links navbar links to parse
 * @param {string[]} exclude ids of categories to include
 * @returns {DataNode[]} tree node data
 */
export const getCategoriesTreeData = (
  categories: CategoryListItem[],
  exclude: string[] = []
): DataNode[] => {
  const treeData: DataNode[] = [];

  categories.forEach((cat) => {
    const { id, children, name } = cat;

    if (exclude.indexOf(cat.id) < 0) {
      treeData.push({
        key: id,
        title: name,
        children: getCategoriesTreeData(children, exclude),
      });
    }
  });

  return treeData;
};
