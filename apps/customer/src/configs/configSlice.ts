import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  siteName: string;
  siteId: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  attachmentEmail: string | null;
  tawktoPropertyId: string | null;
  tawktoWigetId: string | null;
  contactEmail: string | null;
  twitterProfile: string | null;
  facebookProfile: string | null;
  instagramProfile: string | null;
  primaryDomain: string | null;
  theme: string | null;
  googleAnalyticsMeasurementId: string | null;
}

export const initialState: ConfigState = {
  siteName: '',
  siteId: '',
  primaryColor: null,
  secondaryColor: null,
  attachmentEmail: null,
  tawktoPropertyId: null,
  tawktoWigetId: null,
  contactEmail: null,
  twitterProfile: null,
  facebookProfile: null,
  instagramProfile: null,
  primaryDomain: null,
  theme: null,
  googleAnalyticsMeasurementId: null,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfigs: (state, action: PayloadAction<ConfigState>) => {
      return action.payload;
    },
  },
});

export const { setConfigs } = configSlice.actions;

export const configReducer = configSlice.reducer;
