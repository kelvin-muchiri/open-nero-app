import { AxiosRequestConfig } from 'axios';
import { AxiosBaseQueryBuilderType } from '../axios-base-query';

export enum SubscriptionTagTypes {
  CURRENT_SUBSCRIPTION = 'CURRENT_SUBSCRIPTION',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  SUSPENED = 'SUSPENDED',
  RETIRED = 'RETIRED',
}

export interface Subscription {
  is_on_trial: boolean;
  status: SubscriptionStatus;
  start_time: string;
  next_billing_time: string;
  is_expired: false;
}

export interface CurrentSubscription {
  subscription: Subscription | null;
}

export const getCurrentSubscription = (build: AxiosBaseQueryBuilderType) =>
  build.query<CurrentSubscription, { url: string; headers?: AxiosRequestConfig['headers'] }>({
    query: (args) => {
      const { url, headers } = args;
      return {
        url,
        method: 'get',
        headers,
      };
    },
    providesTags: [SubscriptionTagTypes.CURRENT_SUBSCRIPTION],
  });

export const cancelSubscription = (build: AxiosBaseQueryBuilderType) =>
  build.mutation<undefined, string>({
    query: (url) => {
      return {
        url,
        method: 'post',
        data: {},
      };
    },
    invalidatesTags: [SubscriptionTagTypes.CURRENT_SUBSCRIPTION],
  });
