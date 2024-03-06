import { AxiosRequestConfig } from 'axios';
import { AxiosBaseQueryBuilderType } from '../axios-base-query';
import { Content } from './pages';
import { PaginatedResponse } from './utils';

/* eslint-disable sonarjs/no-identical-functions */

export enum BlogTagTypes {
  POST = 'BLOG_POST',
  IMAGE = 'BLOG_IMAGE',
  TAG = 'BLOG_TAG',
  CATEGORY = 'BLOG_CATEGORY',
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export type TagMutationRequestData = Omit<Tag, 'id'>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent: Pick<this, 'id' | 'name' | 'slug'> | null;
  children: Pick<this, 'id' | 'name' | 'slug' | 'children'>[];
}

export interface CategoryMutationRequestData extends Pick<Category, 'name' | 'slug'> {
  parent?: string | null;
  description?: string | null;
}

export interface CategoryMutationResponseData extends Omit<Category, 'children' | 'parent'> {
  parent: string | null;
}

export type CategoryListItem = Omit<Category, 'parent' | 'description'>;

export interface Post {
  title: string;
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
  featured_image: Pick<BlogImage, 'id' | 'image'> | null;
  is_published: boolean;
  is_featured: boolean;
  is_pinned: boolean;
  tags: Tag[];
  categories: Pick<Category, 'id' | 'name' | 'slug'>[];
  previous_post: Pick<this, 'title' | 'slug'> | null;
  next_post: Pick<this, 'title' | 'slug'> | null;
  content: Content;
  draft: Content;
}

export type PostListItem = Pick<
  Post,
  'title' | 'seo_description' | 'slug' | 'featured_image' | 'is_published'
>;

export type PostList = PaginatedResponse<PostListItem>;

export interface PostListParams {
  page?: number | string;
  is_published?: boolean;
  is_featured?: boolean;
  is_pinned?: boolean;
}

export interface PostMutationRequestData {
  title: string;
  slug: string;
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[];
  categories?: string[];
  featured_image?: string | null;
  is_featured?: boolean;
  is_pinned?: boolean;
  is_published?: boolean;
  draft: Content;
  publish?: boolean;
}

export interface PostMutationResponseData
  extends Omit<Post, 'tags' | 'categories' | 'previous_post' | 'next_post' | 'featured_image'> {
  tags: string[];
  categories: string[];
  featured_image: string | null;
}

export interface BlogImage {
  id: string;
  image: string;
  name: string;
}

export interface ImageMutationResponseData {
  id: string;
  image: string;
}

/** post queries  */

export const getPosts = (build: AxiosBaseQueryBuilderType) =>
  build.query<
    PostList,
    {
      url: string;
      params?: PostListParams;
      withCredentials?: AxiosRequestConfig['withCredentials'];
      headers?: AxiosRequestConfig['headers'];
    }
  >({
    query: (arg) => {
      const { url, params, withCredentials, headers } = arg;
      return {
        url: url,
        method: 'get',
        params,
        withCredentials,
        headers,
      };
    },
    providesTags: [BlogTagTypes.POST],
  });

export const getSinglePost = (build: AxiosBaseQueryBuilderType) =>
  build.query<
    Post,
    {
      url: string;
      slug: string;
      action?: string;
      withCredentials?: AxiosRequestConfig['withCredentials'];
      headers?: AxiosRequestConfig['headers'];
    }
  >({
    query: (arg) => {
      const { url, slug, action } = arg;
      return {
        url: `${url}${slug}/${action || ''}`,
        method: 'get',
      };
    },
    providesTags: (result, error, arg) => [{ type: BlogTagTypes.POST, slug: arg.slug }],
  });

export const createPost = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    PostMutationResponseData,
    {
      url: string;
      data: PostMutationRequestData;
    }
  >({
    query: (arg) => {
      const { url, data } = arg;

      return {
        url,
        method: 'post',
        data,
      };
    },
    invalidatesTags: [BlogTagTypes.POST],
  });

export const updatePost = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    PostMutationResponseData,
    { url: string; slug: string; data: Partial<PostMutationRequestData> }
  >({
    query: (arg) => {
      const { url, data } = arg;

      return {
        url: `${url}${arg.slug}/`,
        method: 'patch',
        data,
      };
    },
    invalidatesTags: (result, error, arg) => [
      { type: BlogTagTypes.POST, slug: arg.slug },
      BlogTagTypes.POST,
    ],
  });

export const deletePost = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<void, { url: string; slug: string }>({
    query: (args) => {
      const { url, slug } = args;

      return {
        url: `${url}${slug}/`,
        method: 'delete',
      };
    },
    invalidatesTags: (result, error, arg) => [
      { type: BlogTagTypes.POST, slug: arg.slug },
      BlogTagTypes.POST,
    ],
  });

/** image queries */

export const getImages = (build: AxiosBaseQueryBuilderType) =>
  build.query<PaginatedResponse<BlogImage>, { url: string; params?: { page?: number } }>({
    query: (arg) => {
      const { url, params } = arg;
      return {
        url: url,
        method: 'get',
        params,
      };
    },
    providesTags: [BlogTagTypes.IMAGE],
  });

export const createImage = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<ImageMutationResponseData, { url: string; image: File }>({
    query: (arg) => {
      const { url, image } = arg;

      const fd = new FormData();
      fd.append('image', image);

      return {
        url,
        method: 'post',
        data: fd,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    },
    invalidatesTags: [BlogTagTypes.IMAGE],
  });

export const deleteImage = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<void, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    invalidatesTags: [BlogTagTypes.IMAGE],
  });

/** tag queries */
export const getTags = (build: AxiosBaseQueryBuilderType) =>
  build.query<
    Tag[],
    {
      url: string;
      params?: { name?: string };
      withCredentials?: AxiosRequestConfig['withCredentials'];
      headers?: AxiosRequestConfig['headers'];
    }
  >({
    query: (arg) => {
      const { url, params, withCredentials, headers } = arg;
      return {
        url: url,
        method: 'get',
        params,
        withCredentials,
        headers,
      };
    },
    providesTags: [BlogTagTypes.TAG],
  });

export const createTag = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<Tag, { url: string; data: TagMutationRequestData }>({
    query: (arg) => {
      const { url, data } = arg;

      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [BlogTagTypes.TAG],
  });

export const updateTag = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<Tag, { url: string; id: string; data: Partial<TagMutationRequestData> }>({
    query: (arg) => {
      const { url, data, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    invalidatesTags: [BlogTagTypes.TAG],
  });

export const deleteTag = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<void, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    invalidatesTags: [BlogTagTypes.TAG],
  });

/** category queries */

export const getCategories = (build: AxiosBaseQueryBuilderType) =>
  build.query<
    CategoryListItem[],
    {
      url: string;
      params?: { name?: string };
      withCredentials?: AxiosRequestConfig['withCredentials'];
      headers?: AxiosRequestConfig['headers'];
    }
  >({
    query: (arg) => {
      const { url, params, withCredentials, headers } = arg;
      return {
        url: url,
        method: 'get',
        params,
        withCredentials,
        headers,
      };
    },
    providesTags: [BlogTagTypes.CATEGORY],
  });

export const getSingleCategory = (build: AxiosBaseQueryBuilderType) =>
  build.query<Category, { url: string; id: string; action?: string }>({
    query: (arg) => {
      const { url, id, action } = arg;

      return {
        url: `${url}${id}/${action || ''}`,
        method: 'get',
      };
    },
    providesTags: (result, error, arg) => [{ type: BlogTagTypes.CATEGORY, id: arg.id }],
  });

export const createCategory = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<CategoryMutationResponseData, { url: string; data: CategoryMutationRequestData }>({
    query: (arg) => {
      const { url, data } = arg;

      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [BlogTagTypes.CATEGORY],
  });

export const updateCategory = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<
    CategoryMutationResponseData,
    { url: string; id: string; data: Partial<CategoryMutationRequestData> }
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
      { type: BlogTagTypes.CATEGORY, slug: arg.id },
      BlogTagTypes.CATEGORY,
    ],
  });

export const deleteCategory = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<void, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    invalidatesTags: (result, error, arg) => [
      { type: BlogTagTypes.CATEGORY, slug: arg.id },
      BlogTagTypes.CATEGORY,
    ],
  });
