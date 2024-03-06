import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum FooterSettingsTabKeys {
  FOOTER_LINKS = '1',
  FOOTER_GROUPS = '2',
}

export interface FooterSettingsState {
  activeTab: FooterSettingsTabKeys;
}

const initialState: FooterSettingsState = {
  activeTab: FooterSettingsTabKeys.FOOTER_LINKS,
};

export const footerSettingsSlice = createSlice({
  name: 'footerSettings',
  initialState,
  reducers: {
    updateActiveTab: (state, action: PayloadAction<FooterSettingsTabKeys>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { updateActiveTab } = footerSettingsSlice.actions;

export const footerSettingsReducer = footerSettingsSlice.reducer;
