import { AxiosBaseQueryBuilderType } from '../axios-base-query';
import { CartTagTypes } from './cart';
import { PaginatedResponse } from './utils';

/* eslint-disable sonarjs/no-identical-functions */
export enum CouponTagTypes {
  COUPON = 'COUPON',
}

export enum CouponType {
  REGULAR = 1,
  FIRST_TIMER = 2,
}

export interface Coupon {
  id: string;
  code: string;
  coupon_type: CouponType;
  percent_off: number;
  minimum: number | null;
  start_date: string;
  end_date: string;
  is_expired: boolean;
}

export interface CouponListParams {
  page?: number;
}

export interface CouponMutation
  extends Pick<Coupon, 'code' | 'start_date' | 'end_date' | 'coupon_type'> {
  minimum?: number | string;
  percent_off: number | string;
}

export interface ApplyCouponRequestData {
  coupon_code: string;
  cart_id: string;
}

export const applyCoupon = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, { url: string; data: ApplyCouponRequestData }>({
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

export const getCoupons = (build: AxiosBaseQueryBuilderType) =>
  build.query<
    PaginatedResponse<Coupon>,
    {
      url: string;
      params?: CouponListParams;
    }
  >({
    query: (arg) => {
      const { url } = arg;

      return {
        url,
        method: 'get',
      };
    },
    providesTags: [CouponTagTypes.COUPON],
  });

export const createCoupon = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<Coupon, { url: string; data: CouponMutation }>({
    query: (arg) => {
      const { url, data } = arg;
      return {
        url,
        method: 'post',
        data: data,
      };
    },
    invalidatesTags: [CouponTagTypes.COUPON],
  });

export const getCoupon = (build: AxiosBaseQueryBuilderType) =>
  build.query<
    Coupon,
    {
      url: string;
      id: string;
    }
  >({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'get',
      };
    },
    providesTags: [CouponTagTypes.COUPON],
  });

export const updateCoupon = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<Coupon, { url: string; id: string; data: Partial<CouponMutation> }>({
    query: (arg) => {
      const { url, data, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'patch',
        data: data,
      };
    },
    invalidatesTags: [CouponTagTypes.COUPON],
  });

export const deleteCoupon = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<void, { url: string; id: string }>({
    query: (arg) => {
      const { url, id } = arg;

      return {
        url: `${url}${id}/`,
        method: 'delete',
      };
    },
    invalidatesTags: [CouponTagTypes.COUPON],
  });
