import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState } from 'draft-js';
import { HomeLandingPage } from '@nero/query-api-service';
import { RootState } from '../../store/store';
import { ButtonSize } from 'antd/lib/button';

export type PageBlockType = 'text' | 'image' | 'collapse' | 'grid' | 'button' | 'review';

export interface PageBlock {
  type: PageBlockType;
}

export interface TextBlock extends PageBlock {
  type: 'text';
  content: EditorState;
}

export interface ImageBlock extends PageBlock {
  type: 'image';
  src: string;
  alt?: string;
  wideWidth?: boolean;
  linkTo?: string;
  caption?: string;
  borderRadius?: string | number;
  text?: string;
  width?: string | number;
  height?: string | number;
}

export interface CollapseBlock extends PageBlock {
  type: 'collapse';
  header: EditorState;
  body: EditorState;
}

export type GridChild = TextBlock | ImageBlock | CollapseBlock | ButtonBlock | null;

export interface GridBlock extends PageBlock {
  type: 'grid';
  children: GridChild[];
}

export interface ButtonBlock extends PageBlock {
  type: 'button';
  name: string;
  size?: ButtonSize;
  linkTo: string;
}

export interface ReviewBlock extends PageBlock {
  type: 'review';
}

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | CollapseBlock
  | GridBlock
  | ButtonBlock
  | ReviewBlock;

export interface PageState {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  isPublic: boolean;
  isHome: boolean;
  landingPage: HomeLandingPage | null;
  draft: ContentBlock[];
}

export interface MoveUpPayload {
  currentIndex: number;
  parentIndex?: number;
}

export interface MoveDownPayload {
  currentIndex: number;
  parentIndex?: number;
}

export interface UpdateBlockPayload {
  block: ContentBlock;
  index: number;
  parentIndex?: number;
}

export interface RemoveBlockPayload {
  index: number;
  parentIndex?: number;
}

const initialState: PageState = {
  slug: '',
  title: '',
  seoTitle: '',
  seoDescription: '',
  isPublic: false,
  isHome: false,
  draft: [],
  landingPage: null,
};

export const addBlockUtil = (
  writableDraft: ContentBlock[],
  action: PayloadAction<ContentBlock>
) => {
  writableDraft.push(action.payload);
};

export const removeBlockUtil = (
  writableDraft: ContentBlock[],
  action: PayloadAction<RemoveBlockPayload>
) => {
  const { parentIndex, index } = action.payload;

  if (parentIndex != undefined) {
    const parent = writableDraft[parentIndex];

    if (parent && parent.type == 'grid') {
      parent.children[index] = null;
    }
  } else {
    writableDraft.splice(index, 1);
  }
};

export const moveUpUtil = (writableDraft: ContentBlock[], action: PayloadAction<MoveUpPayload>) => {
  const { currentIndex, parentIndex } = action.payload;

  if (currentIndex == 0) {
    return;
  }

  if (parentIndex != undefined) {
    const parent = writableDraft[parentIndex];

    if (parent && parent.type == 'grid') {
      const currentBlock = parent.children[currentIndex];
      const blockAbove = parent.children[currentIndex - 1];
      parent.children[currentIndex - 1] = currentBlock;
      parent.children[currentIndex] = blockAbove;
    }
  } else {
    const currentBlock = writableDraft[currentIndex];
    const blockAbove = writableDraft[currentIndex - 1];
    writableDraft[currentIndex - 1] = currentBlock;
    writableDraft[currentIndex] = blockAbove;
  }
};
export const moveDownUtil = (
  writableDraft: ContentBlock[],
  action: PayloadAction<MoveUpPayload>
) => {
  const { currentIndex, parentIndex } = action.payload;

  if (parentIndex != undefined) {
    const parent = writableDraft[parentIndex];

    if (parent && parent.type == 'grid' && currentIndex != parent.children.length - 1) {
      const currentBlock = parent.children[currentIndex];
      const blockBelow = parent.children[currentIndex + 1];
      parent.children[currentIndex + 1] = currentBlock;
      parent.children[currentIndex] = blockBelow;
    }
  } else if (currentIndex != writableDraft.length - 1) {
    const currentBlock = writableDraft[currentIndex];
    const blockBelow = writableDraft[currentIndex + 1];
    writableDraft[currentIndex + 1] = currentBlock;
    writableDraft[currentIndex] = blockBelow;
  }
};

export const updateBlockUtil = (
  writableDraft: ContentBlock[],
  action: PayloadAction<UpdateBlockPayload>
) => {
  const { index, block, parentIndex } = action.payload;

  if (parentIndex != undefined) {
    const parent = writableDraft[parentIndex];

    if (parent && parent.type == 'grid') {
      parent.children[index] = block as GridChild;
    }
  } else {
    writableDraft[index] = block;
  }
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    changePage: (state, action: PayloadAction<PageState>) => {
      return action.payload;
    },
    addBlock: (state, action: PayloadAction<ContentBlock>) => {
      addBlockUtil(state.draft, action);
    },
    removeBlock: (state, action: PayloadAction<RemoveBlockPayload>) => {
      removeBlockUtil(state.draft, action);
    },
    moveUp: (state: PageState, action: PayloadAction<MoveUpPayload>) => {
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

export const { changePage, addBlock, removeBlock, moveDown, moveUp, updateBlock, reset } =
  pageSlice.actions;

export const pageReducer = pageSlice.reducer;

export const selectBlock = (state: RootState, index: number, parentIndex?: number) => {
  if (parentIndex != undefined) {
    const parent = state.page.draft[parentIndex];

    if (!parent || parent.type != 'grid') {
      return undefined;
    }

    return parent.children[index];
  }

  return state.page.draft[index];
};
