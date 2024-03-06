/* eslint-disable sonarjs/no-identical-functions */

import { AxiosBaseQueryBuilderType } from '../axios-base-query';
import { PaginatedResponse } from './utils';

export enum CustomerTagTypes {
  CUSTOMER = 'customer',
}

export interface CustomerListItem {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  is_email_verified: boolean;
  date_joined: string;
  last_login?: string;
}

export interface CustomerListParams extends Partial<CustomerListItem> {
  page?: number;
}

export const getCustomers = (build: AxiosBaseQueryBuilderType) =>
  build.query<PaginatedResponse<CustomerListItem>, { url: string; params?: CustomerListParams }>({
    query: (arg) => {
      const { url, params } = arg;

      return {
        url,
        method: 'get',
        params,
      };
    },
    providesTags: [CustomerTagTypes.CUSTOMER],
  });
