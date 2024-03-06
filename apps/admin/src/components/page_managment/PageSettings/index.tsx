import { useState, useEffect } from 'react';
import { Form, FormInstance, Switch } from 'antd';
import { IS_PUBLIC } from '../../../configs/lang';
import { changePage, PageState } from '../pageSlice';
import { Seo } from './seo';
import { Layout } from './layout';
import { Title } from './title';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

export interface PageSettingsFormValues {
  is_public: boolean;
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  is_home: boolean;
  display_landing_page: boolean;
  landing_page_title: string;
  landing_page_subtitle: string;
  landing_page_button_label: string;
  landing_page_display_calculator: boolean;
}

export interface PageSettingsProps {
  form: FormInstance;
  onFinish: () => void;
  pageId?: string;
}

const PageSettings: React.FC<PageSettingsProps> = (props: PageSettingsProps) => {
  const dispatch = useAppDispatch();
  const page: PageState = useAppSelector((state) => state.page);
  const [isHome, setHome] = useState<boolean>(false);
  const [displayLandingPage, setDisplayLandingPage] = useState<boolean>(false);
  const [landingPageBgImageUrl, setLandingPageBgImageUrl] = useState<string>();
  const { form, onFinish, pageId } = props;
  const { isPublic, slug, title, seoTitle, seoDescription, landingPage } = page;

  useEffect(() => {
    setHome(page.isHome);
  }, [page.isHome]);

  useEffect(() => {
    setDisplayLandingPage(!!landingPage);
  }, [landingPage]);

  useEffect(() => {
    setLandingPageBgImageUrl(landingPage?.backgroundImageUrl);
  }, [landingPage?.backgroundImageUrl]);

  const initialValues: PageSettingsFormValues = {
    is_public: isPublic,
    slug: slug,
    title: title,
    seo_title: seoTitle,
    seo_description: seoDescription,
    is_home: page.isHome,
    display_landing_page: !!landingPage,
    landing_page_title: landingPage?.title || '',
    landing_page_subtitle: landingPage?.subtitle || '',
    landing_page_button_label: landingPage?.buttonLabel || '',
    landing_page_display_calculator: !!landingPage?.displayCalculator,
  };

  return (
    <Form<PageSettingsFormValues>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        const {
          is_public,
          slug,
          title,
          seo_title,
          seo_description,
          is_home,
          display_landing_page,
          landing_page_title,
          landing_page_subtitle,
          landing_page_button_label,
          landing_page_display_calculator,
        } = values;

        dispatch(
          changePage({
            ...page,
            isPublic: is_public,
            slug,
            title,
            seoTitle: seo_title,
            seoDescription: seo_description,
            isHome: is_home,
            landingPage:
              is_home && display_landing_page
                ? {
                    title: landing_page_title,
                    subtitle: landing_page_subtitle,
                    buttonLabel: landing_page_button_label,
                    displayCalculator: landing_page_display_calculator,
                    backgroundImageUrl: landingPageBgImageUrl,
                  }
                : null,
          })
        );
        onFinish();
      }}
    >
      <Form.Item name="is_public" valuePropName="checked" label={IS_PUBLIC}>
        <Switch />
      </Form.Item>

      <Title pageId={pageId} />

      <Seo />

      <Layout
        isHome={isHome}
        displayLandingPage={displayLandingPage}
        onIsHomeChange={(value) => setHome(value)}
        onDisplayLandingPageChange={(value) => setDisplayLandingPage(value)}
        landingPageBgImageUrl={landingPageBgImageUrl}
        onLandingPageBgImageChange={(url) => {
          setLandingPageBgImageUrl(url);
        }}
      />
    </Form>
  );
};

export { PageSettings };
