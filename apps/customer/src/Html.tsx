import { Helmet } from 'react-helmet-async';

export interface MetaTagsHelmetProps {
  title: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface Assets {
  'main.js': string;
  'main.css': string;
}

export interface HtmlProps {
  assets?: Assets;
  appTheme?: string;
  children: React.ReactNode;
  metaTags?: MetaTagsHelmetProps;
}

export const MetaTagsHelmet: React.FC<MetaTagsHelmetProps> = (props: MetaTagsHelmetProps) => {
  const { title, metaDescription, ogTitle, ogDescription } = props;

  return (
    <Helmet>
      <title>{title}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
    </Helmet>
  );
};

export const ThemeHelmet = ({ appTheme }: { appTheme?: string }) => {
  const theme = appTheme || 'default-1';

  return (
    <>
      <link
        rel="stylesheet"
        href="https://velamy.s3.eu-west-2.amazonaws.com/public/themes/default-base.css"
      />
      <link
        rel="stylesheet"
        href={`https://velamy.s3.eu-west-2.amazonaws.com/public/themes/${theme}.css`}
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Rubik:wght@700&display=swap"
      />
      {theme == 'default-1' && (
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap"
        />
      )}
      {['default-2', 'default-3', 'default-4'].indexOf(theme) >= 0 && (
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
        />
      )}
    </>
  );
};

export default function Html({ assets, children, appTheme, metaTags }: HtmlProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {metaTags && (
          <>
            <title>{metaTags.title}</title>
            {metaTags.metaDescription && (
              <meta name="description" content={metaTags.metaDescription} />
            )}
            {metaTags.ogTitle && <meta property="og:title" content={metaTags.ogTitle} />}
            {metaTags.ogDescription && (
              <meta property="og:description" content={metaTags.ogDescription} />
            )}
          </>
        )}
        {/* <link rel="shortcut icon" href="favicon.ico" /> */}
        {assets && <link rel="stylesheet" href={assets['main.css']} />}
        <ThemeHelmet appTheme={appTheme} />
      </head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<b>Enable JavaScript to run this app.</b>`,
          }}
        />
        {children}
        {assets && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__ASSET_MANIFEST = ${JSON.stringify(assets)};`,
            }}
          />
        )}
      </body>
    </html>
  );
}
