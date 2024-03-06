import { DataNode } from 'antd/lib/tree';
import { NavbarLink } from '@nero/query-api-service';

/**
 * parse the links into tree data
 *
 * @param {NavbarLink} links navbar links to parse
 * @param {string[]} exclude ids of navbar links to include
 * @returns {DataNode[]} tree node data
 */
export const getNavbarLinksTreeData = (links: NavbarLink[], exclude: string[] = []): DataNode[] => {
  const treeData: DataNode[] = [];

  links.forEach((link) => {
    const { id, children, title } = link;

    if (exclude.indexOf(link.id) < 0) {
      treeData.push({
        key: id,
        title,
        children: getNavbarLinksTreeData(children, exclude),
      });
    }
  });

  return treeData;
};

/**
 * get all ids of parent links
 *
 * @param {NavbarLink[]} links navbar links
 * @returns {string[]} ids of parent links
 */
export const getParentNavbarLinksIds = (links: NavbarLink[]): string[] => {
  let ids: string[] = [];

  links.forEach((link) => {
    if (link.children.length) {
      ids = [link.id, ...getParentNavbarLinksIds(link.children)];
    }
  });

  return ids;
};
