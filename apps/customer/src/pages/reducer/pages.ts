import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FooterGroup, FooterLink, NavbarLink, Page } from '@nero/query-api-service';

export interface PagesState {
  pages: Page[];
  navbarLinks: NavbarLink[];
  footerGroups: FooterGroup[];
  footerLinks: FooterLink[];
}

export const initialState: PagesState = {
  pages: [],
  navbarLinks: [],
  footerGroups: [],
  footerLinks: [],
};

export const dynamicPagesSlice = createSlice({
  name: 'dynamicPages',
  initialState,
  reducers: {
    addDynamicPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload;
    },
    addNavbarLinks: (state, action: PayloadAction<NavbarLink[]>) => {
      state.navbarLinks = action.payload;
    },
    addFooterLinks: (state, action: PayloadAction<FooterLink[]>) => {
      state.footerLinks = action.payload;
    },
    addFooterGroups: (state, action: PayloadAction<FooterGroup[]>) => {
      state.footerGroups = action.payload;
    },
  },
});

export const { addDynamicPages, addFooterLinks, addNavbarLinks, addFooterGroups } =
  dynamicPagesSlice.actions;

export const dynamicPagesReducer = dynamicPagesSlice.reducer;
