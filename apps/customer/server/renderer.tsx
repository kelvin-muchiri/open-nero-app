import * as path from 'path';
import * as fs from 'fs';
import Axios, { AxiosInstance } from 'axios';
import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { HelmetProvider } from 'react-helmet-async';
import { configureDefaultStore } from '../src/store/store';
import {
  getPage,
  getSiteConfigs,
  getCurrentSubscription,
  getBlogPost,
  getNavbarLinks,
} from './api';
import App from '../src/App';
import { URL_ACCOUNT, URL_CHANGE_PASSWORD, URL_ORDER_HISTORY } from '../src/configs/constants';
import { isSubscriptionActive } from '@nero/utils';
import { getAxiosInstance } from './utils';
import { ConfigState } from '../src/configs/configSlice';
import { Assets, MetaTagsHelmetProps } from '../src/Html';
import {
  BlogState,
  initialState as blogInitialState,
} from '../src/components/Blog/reducer/blogSlice';
import { PagesState, initialState as pagesInitialState } from '../src/pages/reducer/pages';
import { NavbarLink } from '@nero/query-api-service';

export interface StaticRouteMetaTags {
  [key: string]: MetaTagsHelmetProps;
}

const shouldFetchData = async (req: Request, axios: AxiosInstance) => {
  if (
    !req.path.startsWith(URL_ORDER_HISTORY) &&
    [URL_ACCOUNT, URL_CHANGE_PASSWORD].indexOf(req.path) < 0
  ) {
    const subscription = await getCurrentSubscription(axios);

    if (subscription == null) {
      return false;
    }

    return isSubscriptionActive(subscription);
  }

  return false;
};

/**
 * Get initial config state
 *
 * @param axios
 * @returns
 */
export const getInitialConfigState = async (
  axios: AxiosInstance
): Promise<ConfigState | undefined> => {
  let state: ConfigState | undefined = undefined;
  const configs = await getSiteConfigs(axios);

  if (configs) {
    const {
      name,
      primary_color,
      secondary_color,
      attachment_email,
      tawkto_widget_id,
      tawkto_property_id,
      contact_email,
      facebook_profile,
      twitter_profile,
      instagram_profile,
      site_id,
      primary_domain,
      theme,
      ga_measurement_id,
    } = configs;
    state = {
      siteName: name,
      primaryColor: primary_color,
      secondaryColor: secondary_color,
      attachmentEmail: attachment_email,
      tawktoPropertyId: tawkto_property_id,
      tawktoWigetId: tawkto_widget_id,
      contactEmail: contact_email,
      facebookProfile: facebook_profile,
      twitterProfile: twitter_profile,
      instagramProfile: instagram_profile,
      siteId: site_id,
      primaryDomain: primary_domain,
      theme,
      googleAnalyticsMeasurementId: ga_measurement_id,
    };
  }

  return state;
};

/**
 *
 * Get meta tags of page to be rendered
 *
 * @param req
 * @param blogState
 * @param pagesState
 * @returns
 */
const getPageMetaTags = (
  blogState?: BlogState,
  pagesState?: PagesState
): MetaTagsHelmetProps | undefined => {
  let metaTags: MetaTagsHelmetProps | undefined = undefined;

  if (pagesState && pagesState.pages.length) {
    const { seo_title, seo_description, title } = pagesState.pages[0];

    metaTags = {
      title: seo_title || title,
      metaDescription: seo_description || undefined,
      ogTitle: seo_title || title,
      ogDescription: seo_description || undefined,
    };
  } else if (blogState && blogState.post) {
    const { seo_title, seo_description, title } = blogState.post;

    metaTags = {
      title: seo_title || title,
      metaDescription: seo_description || undefined,
      ogTitle: seo_title || title,
      ogDescription: seo_description || undefined,
    };
  }

  return metaTags;
};

/**
 * Render HTML stream
 *
 * @param req
 * @param res
 * @param assets
 * @param config
 * @param pagesState
 * @param blogState
 */
const render = (
  req: Request,
  res: Response,
  assets: Assets,
  config?: ConfigState,
  pagesState?: PagesState,
  blogState?: BlogState
) => {
  const store = configureDefaultStore({
    config,
    dynamicPages: pagesState,
    blog: blogState,
  });
  const helmetContext = { helmet: {} };
  const metaTags = getPageMetaTags(blogState, pagesState);
  const app = (
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={req.url}>
          <App assets={assets} metaTags={metaTags} />
        </StaticRouter>
      </HelmetProvider>
    </Provider>
  );
  let didError = false;
  const stream = renderToPipeableStream(app, {
    bootstrapScriptContent: `window.__PRELOADED_STATE__ = ${
      // eslint-disable-next-line
      serialize(store.getState())
    }`,
    // eslint-disable-next-line
    bootstrapScripts: [assets['main.js']],
    onShellReady() {
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onError(x) {
      didError = true;
      console.error(x);
    },
  });
};

/**
 * Tenants can have more than one domain. If the current domain is not the primary
 * domain, return false, true otherwise
 *
 * @param req
 * @param res
 * @param config
 * @returns
 */
export const isDomainPrimary = (req: Request, config: ConfigState): boolean => {
  const { primaryDomain } = config;

  return !!(primaryDomain && req.hostname == primaryDomain);
};

/**
 * Get initial pages state
 *
 * @param req
 * @param axios
 * @returns
 */
export const getInitialPagesState = async (
  req: Request,
  axios: AxiosInstance
): Promise<PagesState> => {
  const state = { ...pagesInitialState };
  state.navbarLinks = await getNavbarLinks(axios);

  if (req.path.split('/').length <= 2) {
    const slug = req.path == '/' ? undefined : req.path.replace('/', '');
    state.pages = await getPage(axios, slug);
  }

  return state;
};

/**
 * Get initial blog state
 * @param req
 * @param axios
 * @returns
 */
export const getInitialBlogState = async (
  req: Request,
  axios: AxiosInstance,
  navbarLinks: NavbarLink[]
): Promise<BlogState | undefined> => {
  const state = { ...blogInitialState };
  const urlParts = req.path.split('/');

  if (urlParts.length == 3) {
    const link = navbarLinks.find((link) => link.link_to?.metadata.is_blog);
    const isBlog = link?.link_to && urlParts[1] == link.link_to?.slug;

    if (isBlog) {
      state.post = await getBlogPost(axios, urlParts[2]);
    }
  }

  return state;
};

/**
 * Handle server side rendering
 *
 * @param req
 * @param res
 * @returns
 */
export const serverRenderer = async (req: Request, res: Response) => {
  const axios = getAxiosInstance(req);
  let config: ConfigState | undefined = undefined;

  try {
    config = await getInitialConfigState(axios);
  } catch (err) {
    config = undefined;
  }

  if (config && !isDomainPrimary(req, config)) {
    // If the current domain is not
    // the primary domain, we redirect to the primary domain
    const { primaryDomain } = config;
    res.set('location', `${req.protocol}://${primaryDomain}${req.originalUrl}`);
    return res.status(301).send();
  }

  let blogState: BlogState | undefined = undefined;
  let pagesState: PagesState | undefined = undefined;
  const shouldFetch = await shouldFetchData(req, axios);

  if (shouldFetch) {
    try {
      pagesState = await getInitialPagesState(req, axios);
      blogState = await getInitialBlogState(req, axios, pagesState.navbarLinks);
    } catch (err) {
      if (Axios.isAxiosError(err) && err?.response?.status) {
        return res.status(err.response.status).send();
      }
    }
  }

  fs.readFile(path.resolve('./build/asset-manifest.json'), (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, Something went wrong!');
    }
    // eslint-disable-next-line
    const files = JSON.parse(data as any)['files'];
    // eslint-disable-next-line
    const assets = { 'main.js': files['main.js'], 'main.css': files['main.css'] } as Assets;
    render(req, res, assets, config, pagesState, blogState);
  });
};
