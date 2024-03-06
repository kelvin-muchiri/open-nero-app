import { GenericCatalogListItem, GenericCatalogRequestData } from './catalog';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  current_page: number;
  total_pages: number;
  start_index: number;
  end_index: number;
  results: T[];
}

/**
 * Compare two strings for equality
 *
 * @param a
 * @param b
 * @returns
 */
export const compareStrings = (a: string, b: string): number => {
  const nameA = a.toUpperCase(); // ignore upper and lowercase
  const nameB = b.toUpperCase(); // ignore upper and lowercase

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

export const updateGenericCatalogDraftItem = (
  draft: GenericCatalogListItem[],
  data: Partial<GenericCatalogRequestData>,
  id: string
) => {
  const updated = draft.map((item) => {
    let sortOrder = item.sort_order;

    if (typeof data.sort_order == 'string' && !isNaN(parseInt(data.sort_order))) {
      sortOrder = parseInt(data.sort_order);
    } else if (typeof data.sort_order == 'number') {
      sortOrder = data.sort_order;
    }

    if (item.id == id) {
      return {
        ...item,
        ...data,
        sort_order: sortOrder,
      };
    }
    return item;
  });

  updated.sort((a, b) => {
    return a.sort_order - b.sort_order || compareStrings(a.name, b.name);
  });

  return updated;
};

export const deleteGenericCatalogDraftItem = (draft: GenericCatalogListItem[], id: string) => {
  const index = draft.findIndex((item) => item.id == id);
  const updated = draft.slice();

  if (index > -1) {
    updated.splice(index, 1);
  }

  updated.sort((a, b) => {
    return a.sort_order - b.sort_order || compareStrings(a.name, b.name);
  });

  return updated;
};
