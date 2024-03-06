import Axios, { AxiosError, AxiosInstance } from 'axios';
import {
  ENDPOINT_BLOG_POSTS,
  ENDPOINT_NAVBAR_LINKS,
  ENDPOINT_PAGES,
  ENDPOINT_PUBLIC_SITE_CONFIGS,
  ENDPOINT_SUBSCRIPTION,
} from '../src/configs/constants';
import {
  SiteConfigs,
  Page,
  CurrentSubscription,
  Subscription,
  Post,
  PageListParams,
  NavbarLink,
} from '@nero/query-api-service';

/**
 * fetch single dynamic page
 *
 * @param axios
 * @returns
 */
export const getPage = async (axios: AxiosInstance, slug?: string) => {
  let pages: Page[] = [];

  try {
    const params: PageListParams = { is_public: true };

    if (slug) {
      params.slug = slug;
    } else {
      params.metadata = { is_home: true };
    }

    const res = await axios.get<Page[]>(ENDPOINT_PAGES, {
      params,
    });
    pages = res.data;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      handleAPIError(error);
      throw error;
    }
  }

  return pages;
};

/**
 * Fetch site configurations
 *
 * @param axios
 * @returns
 */
export const getSiteConfigs = async (axios: AxiosInstance): Promise<SiteConfigs | undefined> => {
  let configs: SiteConfigs | undefined = undefined;

  try {
    const res = await axios.get<SiteConfigs>(ENDPOINT_PUBLIC_SITE_CONFIGS);
    configs = res.data;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      handleAPIError(error);
      throw error;
    }
  }

  return configs;
};

export const getCurrentSubscription = async (axios: AxiosInstance) => {
  let subscription: Subscription | null = null;

  try {
    const res = await axios.get<CurrentSubscription>(ENDPOINT_SUBSCRIPTION);
    subscription = res.data.subscription;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      handleAPIError(error);
      throw error;
    }
  }

  return subscription;
};

export const getBlogPost = async (axios: AxiosInstance, id: string) => {
  let post: Post | undefined = undefined;

  try {
    const res = await axios.get<Post>(`${ENDPOINT_BLOG_POSTS}${id}/`);
    post = res.data;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      handleAPIError(error);
      throw error;
    }
  }

  return post;
};

/**
 * Get navbar links
 *
 * @param axios
 * @returns
 */
export const getNavbarLinks = async (axios: AxiosInstance) => {
  let links: NavbarLink[] = [];

  try {
    const res = await axios.get<NavbarLink[]>(ENDPOINT_NAVBAR_LINKS);
    links = res.data;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      handleAPIError(error);
      throw error;
    }
  }

  return links;
};

export const handleAPIError = (error: AxiosError) => {
  if (error.response) {
    console.log('Error response');
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log('Error request');
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log('Error config', error.config);
};
