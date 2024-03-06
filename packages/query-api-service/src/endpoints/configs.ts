import { AxiosBaseQueryBuilderType } from '../axios-base-query';

export interface SiteConfigs {
  name: string;
  site_id: string;
  primary_color: string | null;
  secondary_color: string | null;
  attachment_email: string | null;
  tawkto_property_id: string | null;
  tawkto_widget_id: string | null;
  primary_domain: string | null;
  contact_email: string | null;
  twitter_profile: string | null;
  facebook_profile: string | null;
  instagram_profile: string | null;
  theme: string | null;
  ga_measurement_id: string | null;
}

export const getPublicSiteConfigs = (build: AxiosBaseQueryBuilderType) =>
  build.query<SiteConfigs, string>({
    query: (url) => {
      return {
        url: url,
        method: 'get',
      };
    },
  });
