import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AxiosBaseQueryBuilderType } from '../axios-base-query';
import { neroAPIQuery } from '../service';
import {
  deleteGenericCatalogDraftItem,
  updateGenericCatalogDraftItem,
  compareStrings,
} from './utils';

/* eslint-disable sonarjs/no-identical-functions */

export enum CatalogTagTypes {
  PAPER = 'paper',
  LEVEL = 'level',
  DEADLINE = 'deadline',
  COURSE = 'course',
  PAPER_FORMAT = 'paper_format',
}

export interface PaperListItemDeadline {
  id: string;
  full_name: string;
}

export interface PaperListItemLevel {
  id: string;
  name: string;
  deadlines: PaperListItemDeadline[];
}

export interface GenericCatalogListItem {
  id: string;
  name: string;
  sort_order: number;
}

export interface PaperListItem extends GenericCatalogListItem {
  levels: PaperListItemLevel[];
  deadlines: PaperListItemDeadline[];
}

export interface PaperListParams {
  service_only?: boolean;
}

export interface CalculatorData {
  level?: string;
  deadline: string;
  paper: string;
  writer_type?: string;
  pages: string | number;
}

export interface CalculatorResponse {
  subtotal: string;
  total: string;
  coupon_code?: string;
}

export interface GenericCatalogRequestData {
  name: string;
  sort_order?: string | number;
}

export interface DeadlineListItem {
  id: string;
  full_name: string;
  value: number;
  deadline_type: DeadlineType;
  sort_order: number;
}

export enum DeadlineType {
  HOUR = 1,
  DAY = 2,
}

export interface DeadlineRequestData {
  value: number | string;
  deadline_type: DeadlineType;
  sort_order: number | string;
}

/** papers */
export const getPapers = (build: AxiosBaseQueryBuilderType) =>
  build.query<
    PaperListItem[],
    {
      url: string;
      params?: PaperListParams;
      withCredentials?: AxiosRequestConfig['withCredentials'];
      headers?: AxiosRequestConfig['headers'];
    }
  >({
    query: (arg) => {
      const { url, params, withCredentials, headers } = arg;

      return {
        url,
        method: 'get',
        params,
        withCredentials,
        headers,
      };
    },
    providesTags: [CatalogTagTypes.PAPER],
  });

export const createPaper = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; data: GenericCatalogRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [CatalogTagTypes.PAPER],
  });

export const updatePaper = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    {
      url: string;
      data: Partial<GenericCatalogRequestData>;
      id: string;
      axios: AxiosInstance;
      getPapersUrl: string;
    }
  >({
    query: (arg) => {
      const { url, data, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    // optimistic update
    async onQueryStarted({ data, id, axios, getPapersUrl }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData('getPapers', { url: getPapersUrl }, (draft) => {
          const updated = draft.map((paper) => {
            if (paper.id == id) {
              let sortOrder = paper.sort_order;

              if (typeof data.sort_order == 'string' && !isNaN(parseInt(data.sort_order))) {
                sortOrder = parseInt(data.sort_order);
              } else if (typeof data.sort_order == 'number') {
                sortOrder = data.sort_order;
              }

              return {
                ...paper,
                ...data,
                sort_order: sortOrder,
              };
            }
            return paper;
          });

          updated.sort((a, b) => a.sort_order - b.sort_order || compareStrings(a.name, b.name));

          return updated;
        })
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

export const deletePaper = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<void, { url: string; id: string; axios: AxiosInstance; getPapersUrl: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    // optimistic update
    async onQueryStarted({ id, axios, getPapersUrl }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData('getPapers', { url: getPapersUrl }, (draft) => {
          const index = draft.findIndex((paper) => paper.id == id);
          const updated = draft.slice();

          if (index > -1) {
            updated.splice(index, 1);
          }

          updated.sort((a, b) => {
            return a.sort_order - b.sort_order || compareStrings(a.name, b.name);
          });

          return updated;
        })
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

/** academic levels **/
export const getLevels = (build: AxiosBaseQueryBuilderType) =>
  build.query<GenericCatalogListItem[], string>({
    query: (url) => {
      return {
        url,
        method: 'get',
      };
    },
    providesTags: [CatalogTagTypes.LEVEL],
  });

export const createLevel = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; data: GenericCatalogRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [CatalogTagTypes.LEVEL],
  });

export const updateLevel = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    {
      url: string;
      data: Partial<GenericCatalogRequestData>;
      id: string;
      axios: AxiosInstance;
      getLevelsUrl: string;
    }
  >({
    query: (arg) => {
      const { url, data, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    // optimistic update
    async onQueryStarted({ data, id, getLevelsUrl, axios }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData('getLevels', getLevelsUrl, (draft) => {
          return updateGenericCatalogDraftItem(draft, data, id);
        })
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

export const deleteLevel = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    { url: string; id: string; axios: AxiosInstance; getLevelsUrl: string }
  >({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    // optimistic update
    async onQueryStarted({ id, getLevelsUrl, axios }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData('getLevels', getLevelsUrl, (draft) => {
          return deleteGenericCatalogDraftItem(draft, id);
        })
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

/** deadlines **/
export const getDeadlines = (build: AxiosBaseQueryBuilderType) =>
  build.query<DeadlineListItem[], { url: string }>({
    query: (arg) => {
      const { url } = arg;

      return {
        url,
        method: 'get',
      };
    },
    providesTags: [CatalogTagTypes.DEADLINE],
  });

export const createDeadline = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; data: DeadlineRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [CatalogTagTypes.DEADLINE],
  });

export const updateDeadline = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    {
      url: string;
      data: Partial<DeadlineRequestData>;
      id: string;
      axios: AxiosInstance;
      getDeadlinesUrl: string;
    }
  >({
    query: (arg) => {
      const { url, data, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    // optimistic update
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async onQueryStarted({ data, id, getDeadlinesUrl, axios }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData(
          'getDeadlines',
          { url: getDeadlinesUrl },
          (draft) => {
            const updated = draft.map((deadline) => {
              if (deadline.id == id) {
                let sortOrder = deadline.sort_order;
                let value = deadline.value;

                if (typeof data.sort_order == 'string' && !isNaN(parseInt(data.sort_order))) {
                  sortOrder = parseInt(data.sort_order);
                } else if (typeof data.sort_order == 'number') {
                  sortOrder = data.sort_order;
                }

                if (typeof data.value == 'string' && !isNaN(parseInt(data.value))) {
                  value = parseInt(data.value);
                } else if (typeof data.value == 'number') {
                  value = data.value;
                }

                const deadlineType = data.deadline_type || deadline.deadline_type;
                const suffix = value > 1 ? 's' : '';
                const fullName =
                  deadlineType == DeadlineType.HOUR
                    ? `${value} Hour${suffix}`
                    : `${value} Day${suffix}`;

                return {
                  ...deadline,
                  sort_order: sortOrder,
                  value,
                  deadline_type: deadlineType,
                  full_name: fullName,
                };
              }
              return deadline;
            });

            updated.sort((a, b) => {
              return a.sort_order - b.sort_order || a.value - b.value;
            });

            return updated;
          }
        )
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

export const deleteDeadline = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    { url: string; id: string; axios: AxiosInstance; getDeadlinesUrl: string }
  >({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    // optimistic update
    async onQueryStarted({ id, getDeadlinesUrl, axios }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData(
          'getDeadlines',
          { url: getDeadlinesUrl },
          (draft) => {
            const index = draft.findIndex((deadline) => deadline.id == id);
            const updated = draft.slice();

            if (index > -1) {
              updated.splice(index, 1);
            }

            updated.sort((a, b) => {
              return a.sort_order - b.sort_order || a.value - b.value;
            });

            return updated;
          }
        )
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

/** courses */

export const getCourses = (build: AxiosBaseQueryBuilderType) =>
  build.query<GenericCatalogListItem[], string>({
    query: (url) => {
      return {
        url,
        method: 'get',
      };
    },
    providesTags: [CatalogTagTypes.COURSE],
  });

export const createCourse = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; data: GenericCatalogRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [CatalogTagTypes.COURSE],
  });

export const updateCourse = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    {
      url: string;
      data: Partial<GenericCatalogRequestData>;
      id: string;
      axios: AxiosInstance;
      getCoursesUrl: string;
    }
  >({
    query: (arg) => {
      const { url, data, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    // optimistic update
    async onQueryStarted({ data, id, getCoursesUrl, axios }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData('getCourses', getCoursesUrl, (draft) => {
          return updateGenericCatalogDraftItem(draft, data, id);
        })
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

export const deleteCourse = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    { url: string; id: string; axios: AxiosInstance; getCoursesUrl: string }
  >({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    // optimistic update
    async onQueryStarted({ id, getCoursesUrl, axios }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData('getCourses', getCoursesUrl, (draft) => {
          return deleteGenericCatalogDraftItem(draft, id);
        })
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

/** paper formats */
export const getPaperFormats = (build: AxiosBaseQueryBuilderType) =>
  build.query<GenericCatalogListItem[], string>({
    query: (url) => {
      return {
        url,
        method: 'get',
      };
    },
    providesTags: [CatalogTagTypes.PAPER_FORMAT],
  });

export const createPaperFormat = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; data: GenericCatalogRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [CatalogTagTypes.PAPER_FORMAT],
  });

export const updatePaperFormat = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    {
      url: string;
      data: Partial<GenericCatalogRequestData>;
      id: string;
      axios: AxiosInstance;
      getPaperFormatsUrl: string;
    }
  >({
    query: (arg) => {
      const { url, data, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    // optimistic update
    async onQueryStarted({ data, id, getPaperFormatsUrl, axios }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData('getPaperFormats', getPaperFormatsUrl, (draft) => {
          return updateGenericCatalogDraftItem(draft, data, id);
        })
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

export const deletePaperFormat = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    undefined,
    { url: string; id: string; axios: AxiosInstance; getPaperFormatsUrl: string }
  >({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    // optimistic update
    async onQueryStarted({ id, getPaperFormatsUrl, axios }, { dispatch, queryFulfilled }) {
      const result = dispatch(
        neroAPIQuery(axios).util.updateQueryData('getPaperFormats', getPaperFormatsUrl, (draft) => {
          return deleteGenericCatalogDraftItem(draft, id);
        })
      );
      try {
        await queryFulfilled;
      } catch {
        // incase query was not fullfilled undo
        result.undo();
      }
    },
  });

/** calculator */
export const calculator = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    CalculatorResponse,
    {
      url: string;
      data: CalculatorData;
      withCredentials?: AxiosRequestConfig['withCredentials'];
      headers?: AxiosRequestConfig['headers'];
    }
  >({
    query: (arg) => {
      const { url, data, withCredentials, headers } = arg;
      return {
        url,
        method: 'post',
        data: data,
        withCredentials,
        headers,
      };
    },
  });
