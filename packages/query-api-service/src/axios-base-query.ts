import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export type AxiosBaseQueryType = BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
    withCredentials?: AxiosRequestConfig['withCredentials'];
  },
  unknown,
  unknown
>;

export type AxiosBaseQueryBuilderType = EndpointBuilder<AxiosBaseQueryType, string, string>;

/**
 * Custom redux toolkit base query for Nero API
 *
 * @returns
 */
export const axiosBaseQuery =
  (axios: AxiosInstance): AxiosBaseQueryType =>
  async ({ url, method, data, params, headers, withCredentials }) => {
    try {
      const result: AxiosResponse = await axios({
        url,
        method,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        params,
        headers,
        withCredentials,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };
