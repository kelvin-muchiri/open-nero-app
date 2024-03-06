import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import ReactGA from 'react-ga4';
import './App.css';
import { useAuth } from '@nero/auth';
import { DynamicPage } from '@nero/components';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import {
  ENDPOINT_PAGES,
  ENDPOINT_PROFILE,
  ENDPOINT_PUBLIC_SITE_CONFIGS,
  ENDPOINT_SUBSCRIPTION,
  PARAM_ID,
} from './configs/constants';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { routes } from './routes';
import { NotFoundPage } from './pages/not-found';
import { useCallback, useEffect } from 'react';
import { initialState, setConfigs } from './configs/configSlice';
import { GuestLayout } from './layout/GuestLayout';
import { apiService, queryService, useGetCurrentSubscriptionQuery } from './services/api';
import { Page, SiteConfigs } from '@nero/query-api-service';
import { ResultLayout } from './layout/ResultLayout';
import { addDynamicPages } from './pages/reducer/pages';
import {
  useGetURLBlog,
  useGetURLSignIn,
  useGetURLSignUp,
  useSetThemeColors,
} from './helpers/hooks';
import { SiteUnavailablePage } from './pages/site-unavailable';
import { isSubscriptionActive } from '@nero/utils';
import Html, { Assets, MetaTagsHelmet, MetaTagsHelmetProps, ThemeHelmet } from './Html';
import { PageLoader } from './components/PageLoader';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import BlogPage from './pages/blog/blog';
import BlogPostPage from './pages/blog/blog-post';

const renderPage = (page: Page, urlSignIn: string, urlSignUp: string) => {
  if (page.metadata.is_sign_up) {
    return <RegisterPage urlSignIn={urlSignIn} />;
  }

  if (page.metadata.is_sign_in) {
    return <LoginPage urlSignUp={urlSignUp} />;
  }

  if (page.metadata.is_blog) {
    return <BlogPage />;
  }

  return <DynamicPage page={page} neroQuery={queryService} loginURL={urlSignIn} />;
};

function App() {
  useAuth(apiService, ENDPOINT_PROFILE);
  const auth = useAppSelector((state) => state.auth);
  const pages = useAppSelector((state) => state.dynamicPages.pages);
  const staticRoutes = routes(auth);
  const urlSignIn = useGetURLSignIn();
  const urlSignUp = useGetURLSignUp();
  const urlBlog = useGetURLBlog();
  const dynamicRoutes = pages.map((page) => {
    return {
      path: page.metadata.is_home ? '/' : `/${page.slug}`,
      breadcrumb: page.title,
      element: (
        <GuestLayout>
          <div className="bg-white full-height">
            {!page.metadata?.landing_page &&
              !page.metadata?.is_blog &&
              !page.metadata?.is_sign_in &&
              !page.metadata?.is_sign_up && (
                <h1 className="text-center ptb-40 large-text nero-page-title">{page.title}</h1>
              )}
            <MetaTagsHelmet
              title={page.seo_title || page.title}
              metaDescription={page.seo_description || undefined}
              ogTitle={page.seo_title || page.title}
              ogDescription={page.seo_description || undefined}
            />
            {renderPage(page, urlSignIn, urlSignUp)}
          </div>
        </GuestLayout>
      ),
    };
  });

  if (urlBlog != '/') {
    dynamicRoutes.push({
      path: `${urlBlog}/:${PARAM_ID}`,
      breadcrumb: '',
      element: (
        <GuestLayout>
          <BlogPostPage />
        </GuestLayout>
      ),
    });
  }

  useSetThemeColors();

  return useRoutes([
    ...(dynamicRoutes || []),
    ...staticRoutes,
    pages.length
      ? {
          path: '*',
          element: (
            <ResultLayout>
              <NotFoundPage />
            </ResultLayout>
          ),
        }
      : {},
  ]);
}

export interface AppWrapperProps {
  assets?: Assets;
  children?: React.ReactNode;
  metaTags?: MetaTagsHelmetProps;
  development?: boolean;
}

export default function AppWrapper({ assets, metaTags, development }: AppWrapperProps) {
  const { data, isLoading: isSubscriptionLoading } = useGetCurrentSubscriptionQuery({
    url: ENDPOINT_SUBSCRIPTION,
    headers: { 'X-Ignore-Credentials': true },
  });
  const config = useAppSelector((state) => state.config);
  const dispatch = useAppDispatch();
  const isSiteAvailable = useCallback(() => {
    if (!data) {
      return false;
    }

    const { subscription } = data;

    if (!subscription) {
      return false;
    }

    return isSubscriptionActive(subscription);
  }, [data]);

  useEffect(() => {
    if (!isSiteAvailable()) {
      return;
    }

    // Fallback to fetch data if server side rendering fails or
    // when app runs without server side rendering
    if (!config?.siteName) {
      apiService
        .getAxiosInstance()
        .get<SiteConfigs>(ENDPOINT_PUBLIC_SITE_CONFIGS, {
          withCredentials: false,
          headers: { 'X-Ignore-Credentials': true },
        })
        .then((res) => {
          const {
            name,
            primary_color,
            secondary_color,
            site_id,
            attachment_email,
            tawkto_property_id,
            tawkto_widget_id,
            contact_email,
            facebook_profile,
            twitter_profile,
            instagram_profile,
            primary_domain,
            theme,
            ga_measurement_id,
          } = res.data;

          dispatch(
            setConfigs({
              siteName: name,
              primaryColor: primary_color,
              secondaryColor: secondary_color,
              siteId: site_id,
              attachmentEmail: attachment_email,
              tawktoPropertyId: tawkto_property_id,
              tawktoWigetId: tawkto_widget_id,
              contactEmail: contact_email,
              facebookProfile: facebook_profile,
              twitterProfile: twitter_profile,
              instagramProfile: instagram_profile,
              primaryDomain: primary_domain,
              theme,
              googleAnalyticsMeasurementId: ga_measurement_id,
            })
          );
        })
        .catch(() => {
          dispatch(setConfigs(initialState));
        });
    }
    // we fetch dynamic pages
    apiService
      .getAxiosInstance()
      .get<Page[]>(ENDPOINT_PAGES, {
        params: { is_public: true },
        withCredentials: false,
        headers: { 'X-Ignore-Credentials': true },
      })
      .then((res) => {
        dispatch(addDynamicPages(res.data));
      })
      .catch(() => {
        dispatch(addDynamicPages([]));
      });
  }, [config?.siteName, dispatch, isSiteAvailable]);

  useEffect(() => {
    if (config.googleAnalyticsMeasurementId) {
      // eslint-disable-next-line
      ReactGA.initialize(config.googleAnalyticsMeasurementId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if site is unavailable, we display the site unavailable page,
  // we also use typeof window != 'undefined' to ensure we do not run on the server side,
  // we also only run if SSR did not return config data. If config data is present, then
  // site is available and we do not need to run the check
  if (
    !config.siteName &&
    !isSubscriptionLoading &&
    !isSiteAvailable() &&
    typeof window != 'undefined'
  ) {
    return <SiteUnavailablePage />;
  }

  const app = (
    <>
      {config.tawktoPropertyId && config.tawktoWigetId && (
        <TawkMessengerReact propertyId={config.tawktoPropertyId} widgetId={config.tawktoWigetId} />
      )}
      <Suspense fallback={<PageLoader />}>
        <App />
      </Suspense>
    </>
  );

  if (development) {
    // we are not server side rendering
    return (
      <>
        <ThemeHelmet />
        {app}
      </>
    );
  }
  // we are running server side rendering
  return (
    <Html assets={assets} appTheme={config.theme || undefined} metaTags={metaTags}>
      {app}
    </Html>
  );
}
