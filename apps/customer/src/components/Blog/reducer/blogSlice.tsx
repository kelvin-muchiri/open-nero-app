import { CategoryListItem, Post, PostList, Tag } from '@nero/query-api-service';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BlogState {
  postList?: PostList;
  post?: Post;
  featuredPosts?: PostList;
  tags: Tag[];
  categories: CategoryListItem[];
}

export const initialState: BlogState = {
  tags: [],
  categories: [],
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    updatePostList: (state, action: PayloadAction<PostList | undefined>) => {
      state.postList = action.payload;
    },
    updateFeaturedPosts: (state, action: PayloadAction<PostList | undefined>) => {
      state.featuredPosts = action.payload;
    },
    updatePost: (state, action: PayloadAction<Post | undefined>) => {
      state.post = action.payload;
    },
    updateCategories: (state, action: PayloadAction<CategoryListItem[]>) => {
      state.categories = action.payload;
    },
    updateTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
  },
});

export const { updatePostList, updateFeaturedPosts, updatePost, updateTags } = blogSlice.actions;

export const blogReducer = blogSlice.reducer;
