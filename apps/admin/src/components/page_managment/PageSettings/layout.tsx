import { Form, Input, Switch } from 'antd';
import {
  BACKGROUND_IMAGE,
  BUTTON_LABEL,
  DISPLAY_CALCULATOR,
  DISPLAY_LANDING_PAGE,
  SET_AS_HOME_PAGE,
  SET_AS_HOME_PAGE_HELP,
  LANDING_PAGE_SUBTITLE,
  LANDING_PAGE_TITLE,
  DISPLAY_LANDINF_PAGE_HELP,
} from '../../../configs/lang';
import { PageImageUpload } from '../PageEditor/PageEditorBlocks/PageEditorBlock/PageImageEditor/PageImageUpload';

export interface LayoutProps {
  isHome: boolean;
  displayLandingPage: boolean;
  landingPageBgImageUrl?: string;
  onIsHomeChange: (value: boolean) => void;
  onDisplayLandingPageChange: (value: boolean) => void;
  onLandingPageBgImageChange: (imageUrl: string) => void;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const {
    onIsHomeChange: handleIsHome,
    isHome,
    displayLandingPage,
    onDisplayLandingPageChange,
    onLandingPageBgImageChange,
    landingPageBgImageUrl,
  } = props;

  return (
    <>
      <Form.Item
        name="is_home"
        valuePropName="checked"
        label={SET_AS_HOME_PAGE}
        tooltip={SET_AS_HOME_PAGE_HELP}
      >
        <Switch onChange={(checked) => handleIsHome(checked)} />
      </Form.Item>

      {isHome && (
        <Form.Item
          name="display_landing_page"
          valuePropName="checked"
          label={DISPLAY_LANDING_PAGE}
          tooltip={DISPLAY_LANDINF_PAGE_HELP}
        >
          <Switch onChange={(checked) => onDisplayLandingPageChange(checked)} />
        </Form.Item>
      )}

      {isHome && displayLandingPage && (
        <div className="page-setting-group">
          <Form.Item label={LANDING_PAGE_TITLE} name="landing_page_title">
            <Input />
          </Form.Item>

          <Form.Item label={LANDING_PAGE_SUBTITLE} name="landing_page_subtitle">
            <Input />
          </Form.Item>

          <Form.Item label={BACKGROUND_IMAGE}>
            <PageImageUpload
              previewUrl={landingPageBgImageUrl}
              onRemove={() => onLandingPageBgImageChange('')}
              onChange={(url) => onLandingPageBgImageChange(url)}
            />
          </Form.Item>

          <Form.Item label={BUTTON_LABEL} name="landing_page_button_label">
            <Input />
          </Form.Item>
          <Form.Item
            name="landing_page_display_calculator"
            valuePropName="checked"
            label={DISPLAY_CALCULATOR}
          >
            <Switch />
          </Form.Item>
        </div>
      )}
    </>
  );
};

export { Layout };
