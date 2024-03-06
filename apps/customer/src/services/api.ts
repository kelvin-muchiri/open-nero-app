import { NeroAPIService } from '@nero/api-service';
import { neroAPIQuery } from '@nero/query-api-service';
import { handleRefreshTokenFailed } from '@nero/utils';
import { ENDPOINT_TOKEN_REFRESH, URL_LOGOUT } from '../configs/constants';
import { NERO_API_BASE_URL } from '../configs/envs';

export const apiService = NeroAPIService.getInstance(
  NERO_API_BASE_URL,
  ENDPOINT_TOKEN_REFRESH,
  () => {
    handleRefreshTokenFailed(URL_LOGOUT);
  }
);
export const queryService = neroAPIQuery(apiService.getAxiosInstance());
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateOrderMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useGetPapersQuery,
  useApplyCouponMutation,
  useGetSingleOrderQuery,
  useGetCoursesQuery,
  useGetPaperFormatsQuery,
  useGetSelfOrdersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetOrderItemQuery,
  useAddToCartMutation,
  useGetPaymentMethodsQuery,
  useGetCurrentSubscriptionQuery,
} = queryService;
