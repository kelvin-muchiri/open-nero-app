import { ButtonSize } from 'antd/lib/button';
import { AxiosBaseQueryBuilderType } from '../axios-base-query';
import { PaginatedResponse } from './utils';

/* eslint-disable sonarjs/no-identical-functions */

export enum PageTagTypes {
  PAGE = 'page',
  DRAFT_PAGE = 'draft_page',
  UPLOADED_IMAGE = 'uploaded_image',
  NAVBAR_LINK = 'navbar_link',
  FOOTER_LINK = 'footer_link',
  FOOTER_GROUP = 'footer_group',
}

export interface Text {
  type: 'text';
  content: string;
}

export interface Image {
  type: 'image';
  src: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  wideWidth?: boolean;
  linkTo?: string;
  caption?: string;
  borderRadius?: string | number;
  text?: string;
}

export interface Collapse {
  type: 'collapse';
  header: string;
  body: string;
}

export interface Grid {
  type: 'grid';
  children: (Image | Text | Collapse | Button | null)[];
}

export interface Button {
  type: 'button';
  name: string;
  size?: ButtonSize;
  linkTo: string;
}

export interface Review {
  type: 'review';
}

export interface HomeLandingPage {
  title: string;
  subtitle: string;
  buttonLabel: string;
  displayCalculator: boolean;
  backgroundImageUrl?: string;
}

export type Content = (Text | Image | Collapse | Grid | Button | Review)[];

export interface Metadata {
  is_home?: boolean;
  is_sign_up?: boolean;
  is_sign_in?: boolean;
  is_blog?: boolean;
  landing_page?: HomeLandingPage | null;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  navbar_sort_order?: number;
  footer_sort_order?: number;
  metadata: Metadata;
  blocks: Content;
}

export interface DraftPage extends Page {
  draft: Content;
  is_public: boolean;
  is_active: boolean;
}

export interface PageRequestData
  extends Omit<
    DraftPage,
    'id' | 'blocks' | 'seo_title' | 'seo_description' | 'metadata' | 'is_active'
  > {
  seo_title?: string | null;
  seo_description?: string | null;
  publish?: boolean;
  metadata?: Metadata;
  is_active?: boolean;
}

export interface PageListParams {
  is_public?: boolean;
  slug?: string;
  metadata?: Omit<Metadata, 'landing_page'>;
}

export interface UploadedImage {
  id: string;
  image: string;
  name: string;
}

export interface UploadedImageParams {
  page?: number;
}

export interface NavbarLink {
  id: string;
  title: string;
  link_to?: Pick<Page, 'id' | 'title' | 'slug' | 'metadata'>;
  parent?: Pick<this, 'id' | 'title' | 'link_to'>;
  children: this[];
}

export interface NavbarLinkRequestPayload extends Pick<NavbarLink, 'title'> {
  parent?: string;
  link_to?: string;
}

export interface NavbarLinkMutationResponse extends NavbarLinkRequestPayload {
  id: string;
}

export interface FooterGroup {
  id: string;
  title: string;
  sort_order?: string | number;
  links: Pick<FooterLink, 'id' | 'title' | 'link_to'>[];
}

export interface FooterLink {
  id: string;
  title: string;
  link_to: Pick<Page, 'id' | 'title' | 'slug'>;
  group?: Pick<FooterGroup, 'id' | 'title'>;
  sort_order?: string | number;
}

export interface FooterLinkRequestPayload extends Pick<FooterLink, 'title' | 'sort_order'> {
  link_to: string;
  group?: string;
}

export interface FooterLinkMutationResponse extends FooterGroupRequestPayload {
  id: string;
}

export type FooterGroupRequestPayload = Pick<FooterGroup, 'title' | 'sort_order'>;

export interface FooterGroupMutationResponse extends FooterGroupRequestPayload {
  id: string;
}

/**
 * get pages without the `draft` field present
 *
 * @param build
 * @returns
 */
export const getPages = (build: AxiosBaseQueryBuilderType) =>
  build.query<Page[], { url: string; params?: PageListParams }>({
    query: (arg) => {
      const { url, params } = arg;
      return {
        url: url,
        method: 'get',
        params,
      };
    },
    providesTags: [PageTagTypes.PAGE],
  });

/**
 * get pages with the `draft` field present
 * @param build
 * @returns
 */
export const getDraftPages = (build: AxiosBaseQueryBuilderType) =>
  build.query<DraftPage[], { url: string; params?: PageListParams }>({
    query: (arg) => {
      const { url, params } = arg;
      return {
        url: url,
        method: 'get',
        params,
      };
    },
    providesTags: [PageTagTypes.DRAFT_PAGE],
  });

export const createPage = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<DraftPage, { url: string; data: PageRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [PageTagTypes.DRAFT_PAGE],
  });

export const updatePage = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<DraftPage, { url: string; data: PageRequestData; id: string }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'patch',
        data: data,
      };
    },
    invalidatesTags: [PageTagTypes.DRAFT_PAGE],
  });

export const deletePage = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, string>({
    query: (url) => {
      return {
        url,
        method: 'delete',
      };
    },
    invalidatesTags: [PageTagTypes.DRAFT_PAGE],
  });

export const getUploadedImages = (build: AxiosBaseQueryBuilderType) =>
  build.query<PaginatedResponse<UploadedImage>, { url: string; params?: UploadedImageParams }>({
    query: (arg) => {
      const { url, params } = arg;
      return {
        url: url,
        method: 'get',
        params,
      };
    },
    providesTags: [PageTagTypes.UPLOADED_IMAGE],
  });

export const createUploadedImage = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    {
      id: string;
      image: string;
    },
    { url: string; data: FormData }
  >({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    },
    invalidatesTags: [PageTagTypes.UPLOADED_IMAGE],
  });

export const deleteUploadedImage = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    invalidatesTags: [PageTagTypes.UPLOADED_IMAGE],
  });

export const getNavbarLinks = (build: AxiosBaseQueryBuilderType) =>
  build.query<NavbarLink[], string>({
    query: (url) => {
      return {
        url: url,
        method: 'get',
      };
    },
    providesTags: [PageTagTypes.NAVBAR_LINK],
  });

export const getSingleNavbarLink = (build: AxiosBaseQueryBuilderType) =>
  build.query<NavbarLink, { url: string; id: string; action?: string }>({
    query: (arg) => {
      const { url, id, action } = arg;

      return {
        url: `${url}${id}/${action || ''}`,
        method: 'get',
      };
    },
    providesTags: (result, error, arg) => [{ type: PageTagTypes.NAVBAR_LINK, id: arg.id }],
  });

export const createNavbarLink = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<NavbarLinkMutationResponse, { url: string; data: NavbarLinkRequestPayload }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [PageTagTypes.NAVBAR_LINK],
  });

export const updateNavbarLink = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    NavbarLinkMutationResponse,
    { url: string; data: Partial<NavbarLinkRequestPayload>; id: string }
  >({
    query: (arg) => {
      const { url, data, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    invalidatesTags: (result, error, arg) => [
      { type: PageTagTypes.NAVBAR_LINK, id: arg.id },
      PageTagTypes.NAVBAR_LINK,
    ],
  });

export const deleteNavbarLink = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    invalidatesTags: [PageTagTypes.NAVBAR_LINK],
  });

export const getFooterLinks = (build: AxiosBaseQueryBuilderType) =>
  build.query<FooterLink[], string>({
    query: (url) => {
      return {
        url: url,
        method: 'get',
      };
    },
    providesTags: [PageTagTypes.FOOTER_LINK],
  });

export const createFooterLink = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<FooterLinkMutationResponse, { url: string; data: FooterLinkRequestPayload }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [PageTagTypes.FOOTER_LINK],
  });

export const updateFooterLink = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    FooterLinkMutationResponse,
    { url: string; data: Partial<FooterLinkRequestPayload>; id: string }
  >({
    query: (arg) => {
      const { url, data, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    invalidatesTags: [PageTagTypes.FOOTER_LINK],
  });

export const deleteFooterLink = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    invalidatesTags: [PageTagTypes.FOOTER_LINK],
  });

export const getFooterGroups = (build: AxiosBaseQueryBuilderType) =>
  build.query<FooterGroup[], string>({
    query: (url) => {
      return {
        url: url,
        method: 'get',
      };
    },
    providesTags: [PageTagTypes.FOOTER_GROUP],
  });

export const createFooterGroup = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<FooterGroupMutationResponse, { url: string; data: FooterGroupRequestPayload }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [PageTagTypes.FOOTER_GROUP],
  });

export const updateFooterGroup = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    FooterGroupMutationResponse,
    { url: string; data: Partial<FooterGroupRequestPayload>; id: string }
  >({
    query: (arg) => {
      const { url, data, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    invalidatesTags: [PageTagTypes.FOOTER_GROUP, PageTagTypes.FOOTER_LINK],
  });

export const deleteFooterGroup = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    invalidatesTags: [PageTagTypes.FOOTER_GROUP, PageTagTypes.FOOTER_LINK],
  });
