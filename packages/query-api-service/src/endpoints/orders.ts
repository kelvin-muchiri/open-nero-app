import { AxiosBaseQueryBuilderType } from '../axios-base-query';
import { CartTagTypes } from './cart';
import { PaginatedResponse } from './utils';

/* eslint-disable sonarjs/no-identical-functions */

export enum OrderTagTypes {
  SELF_ORDER = 'order',
  ORDER_ITEM = 'order_item',
  ORDER = 'order',
}

export enum OrderStatus {
  PAID = 1,
  UNPAID = 2,
  REFUNDED = 3,
  DECLINED = 4,
  PARTIALLY_REFUNDED = 5,
}

export enum OrderItemStatus {
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETE = 3,
  VOID = 4,
}

// interface for order list query params
export interface OrderListParams {
  page?: number;
}

export interface OrderOwner {
  id: string;
  full_name: string;
  email: string;
}

export interface Order {
  id: string | number;
  owner: OrderOwner | null;
  status: OrderStatus;
  is_complete: boolean;
  created_at: string;
  earliest_due: string | null;
  coupon: OrderCoupon | null;
  balance: string | number;
  amount_payable: string | number;
  original_amount_payable: string | number;
  items: OrderItem[];
}

export interface OrderListItem
  extends Pick<
    Order,
    'id' | 'owner' | 'status' | 'is_complete' | 'created_at' | 'earliest_due' | 'amount_payable'
  > {
  no_of_items: number | string;
}

export type SelfOrderListItem = Pick<
  Order,
  'id' | 'status' | 'is_complete' | 'created_at' | 'earliest_due'
>;

export interface OrderCoupon {
  code: string;
  discount: string | number;
}

export interface OrderAttachment {
  id: string;
  file_path: string;
  comment?: string;
}

export interface PaperRating {
  rating: number | string;
  comment: string | null;
}

export interface OrderPaper {
  id: string;
  file_name: string;
  comment?: string;
  rating: PaperRating;
}

export interface OrderItemOrder {
  id: number;
  owner: OrderItemListItemOwner;
  status: OrderStatus;
}

export interface OrderItem {
  id: string | number;
  order: OrderItemOrder;
  topic: string;
  level: string;
  course: string;
  paper: string;
  paper_format: string;
  deadline: string;
  language: string;
  pages: number;
  references: number;
  quantity: number;
  comment: string | null;
  due_date: string | null;
  status: OrderItemStatus;
  days_left: number | null;
  price: number | string;
  total_price: number | string;
  writer_type: string | null;
  writer_type_price: string | null;
  attachments: OrderAttachment[];
  papers: OrderPaper[];
  is_overdue: boolean;
  created_at: string;
}

export interface CreateOrderResponse {
  id: string | number;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderData {
  cart: string;
}

export interface OrderItemListItemOwner {
  id: string;
  full_name: string;
  email: string;
}

export interface OrderItemListParams {
  topic?: string;
  is_overdue?: boolean;
  status?: number;
  order_id?: number;
  page?: number;
  new?: boolean;
}

export interface OrderItemRequestData {
  status: OrderItemStatus;
}

export interface OrderStats {
  all: number;
  new: number;
  overdue: number;
  complete: number;
}

export const getSelfOrders = (build: AxiosBaseQueryBuilderType) =>
  build.query<
    PaginatedResponse<SelfOrderListItem>,
    { params?: OrderListParams | void; url: string }
  >({
    query: (arg) => {
      const { params, url } = arg;

      return {
        url: url,
        method: 'get',
        params: params,
      };
    },
    providesTags: [OrderTagTypes.SELF_ORDER],
  });

export const createSelfOrder = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<CreateOrderResponse, { url: string; data: CreateOrderData }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [OrderTagTypes.SELF_ORDER, CartTagTypes.CART],
  });

export const getOrderItems = (build: AxiosBaseQueryBuilderType) =>
  build.query<PaginatedResponse<OrderItem>, { url: string; params?: OrderItemListParams }>({
    query: (arg) => {
      const { params, url } = arg;

      return {
        url: url,
        method: 'get',
        params: params,
      };
    },
    providesTags: [OrderTagTypes.ORDER_ITEM],
  });

export const getOrderItem = (build: AxiosBaseQueryBuilderType) =>
  build.query<OrderItem, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'get',
      };
    },
    providesTags: (result, error, arg) => [{ type: OrderTagTypes.ORDER_ITEM, id: arg.id }],
  });

export const updateOrderItem = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<OrderItem, { url: string; data: Partial<OrderItemRequestData>; id: string }>({
    query: (arg) => {
      const { url, id, data } = arg;

      return {
        url: `${url}${id}/`,
        method: 'patch',
        data,
      };
    },
    invalidatesTags: (result, error, arg) => [
      { type: OrderTagTypes.ORDER_ITEM, id: arg.id },
      OrderTagTypes.ORDER_ITEM,
    ],
  });

export const getOrderStats = (build: AxiosBaseQueryBuilderType) =>
  build.query<OrderStats, string>({
    query: (url) => {
      return {
        url: url,
        method: 'get',
      };
    },
  });

export const getOrders = (build: AxiosBaseQueryBuilderType) =>
  build.query<PaginatedResponse<OrderListItem>, { params?: OrderListParams | void; url: string }>({
    query: (arg) => {
      const { params, url } = arg;

      return {
        url: url,
        method: 'get',
        params: params,
      };
    },
    providesTags: [OrderTagTypes.ORDER],
  });

export const getSingleOrder = (build: AxiosBaseQueryBuilderType) =>
  build.query<Order, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;
      return {
        url: `${url}${id}/`,
        method: 'get',
      };
    },
    providesTags: (result, error, arg) => [{ type: OrderTagTypes.ORDER, id: arg.id }],
  });

export const updateOrder = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<Order, { url: string; data: Partial<Order>; id: string | number }>({
    query: (arg) => {
      const { url, id, data } = arg;

      return {
        url: `${url}${id}/`,
        method: 'patch',
        data,
      };
    },
    invalidatesTags: (result, error, arg) => [
      { type: OrderTagTypes.ORDER, id: arg.id },
      OrderTagTypes.ORDER,
      OrderTagTypes.ORDER_ITEM,
    ],
  });
