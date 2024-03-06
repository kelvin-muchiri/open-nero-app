import { AxiosBaseQueryBuilderType } from '../axios-base-query';

/* eslint-disable sonarjs/no-identical-functions */

export enum CartTagTypes {
  CART = 'cart',
}

export interface CartItemLevelResponse {
  id: string;
  name: string;
}

export interface CartItemCourseResponse {
  id: string;
  name: string;
}

export interface CartItemPaperResponse {
  id: string;
  name: string;
}

export interface CartItemDeadlineResponse {
  id: string;
  full_name: string;
}

export interface CartItemPaperFormatResponse {
  id: string;
  name: string;
}

export interface CartItemLanguageResponse {
  id: number;
  name: string;
}

export interface CartItemWriterTypeResponse {
  id: string;
  name: string;
  description?: string;
}

export interface CartItemAttachmentResponse {
  id: string;
  file_path: string;
  comment: string;
}

export interface CartItemResponse {
  id: string;
  topic: string;
  level?: CartItemLevelResponse;
  course: CartItemCourseResponse;
  paper: CartItemPaperResponse;
  paper_format: CartItemPaperFormatResponse;
  deadline: CartItemDeadlineResponse;
  language: CartItemLanguageResponse;
  pages: number;
  references: number;
  comment: string;
  quantity: number;
  price: string;
  total_price: string;
  writer_type?: CartItemWriterTypeResponse;
  attachments: CartItemAttachmentResponse[];
}

export interface CartResponseCoupon {
  code: string;
  is_expired: boolean;
}

export interface CartResponseBestMatchCoupon {
  code: string;
  discount: string;
}

export interface CartResponse {
  id: string;
  subtotal: string;
  total: string;
  discount: string;
  coupon?: CartResponseCoupon;
  items: CartItemResponse[];
  best_match_coupon: CartResponseBestMatchCoupon;
}

export interface CartItemRequestData {
  topic: string;
  level?: string;
  course: string;
  paper: string;
  paper_format: string;
  deadline: string;
  language: string | number;
  pages: string | number;
  references?: string | number;
  comment?: string;
  quantity: string | number;
}

export interface CartRequestData {
  items: CartItemRequestData[];
}

export interface CartItemRemoveRequestData {
  item: string;
}

export const getCart = (build: AxiosBaseQueryBuilderType) =>
  build.query<{ cart: CartResponse | null }, string>({
    query: (url) => ({
      url,
      method: 'get',
    }),
    providesTags: [CartTagTypes.CART],
  });

export const addToCart = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<CartResponse, { url: string; data: CartRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [CartTagTypes.CART],
  });

export const updateCartItem = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<CartResponse, { url: string; data: CartItemRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'put',
        data: data,
      };
    },
    invalidatesTags: [CartTagTypes.CART],
  });

export const removeCartItem = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<CartResponse, { url: string; data: CartItemRemoveRequestData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [CartTagTypes.CART],
  });
