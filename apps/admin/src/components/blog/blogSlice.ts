import { Post } from '@nero/query-api-service';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addBlockUtil,
  ContentBlock,
  MoveDownPayload,
  moveDownUtil,
  MoveUpPayload,
  moveUpUtil,
  RemoveBlockPayload,
  removeBlockUtil,
  UpdateBlockPayload,
  updateBlockUtil,
} from '../page_managment/pageSlice';

export interface PostState {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  tags: string[];
  categories: string[];
  draft: ContentBlock[];
  featuredImage: Post['featured_image'] | null;
}

const initialState: PostState = {
  slug: '',
  title: '',
  seoTitle: '',
  seoDescription: '',
  isPublished: false,
  isFeatured: false,
  isPinned: false,
  tags: [],
  categories: [],
  draft: [],
  featuredImage: null,
};
export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    changeBlog: (state, action: PayloadAction<PostState>) => {
      return action.payload;
    },
    addBlock: (state, action: PayloadAction<ContentBlock>) => {
      addBlockUtil(state.draft, action);
    },
    removeBlock: (state, action: PayloadAction<RemoveBlockPayload>) => {
      removeBlockUtil(state.draft, action);
    },
    moveUp: (state, action: PayloadAction<MoveUpPayload>) => {
      moveUpUtil(state.draft, action);
    },
    moveDown: (state, action: PayloadAction<MoveDownPayload>) => {
      moveDownUtil(state.draft, action);
    },
    updateBlock: (state, action: PayloadAction<UpdateBlockPayload>) => {
      updateBlockUtil(state.draft, action);
    },
  },
});

export const { changeBlog, addBlock, removeBlock, moveDown, moveUp, updateBlock, reset } =
  blogSlice.actions;

export const blogReducer = blogSlice.reducer;
