import { NeroAPIService } from '@nero/api-service';
import { neroAPIQuery } from '@nero/query-api-service';
import { handleRefreshTokenFailed } from '@nero/utils';
import { AxiosError } from 'axios';
import { ENDPOINT_TOKEN_REFRESH, URL_LOGOUT, URL_SUBSCRIPTION } from '../configs/constants';
import { NERO_API_BASE_URL } from '../configs/envs';

export enum PermissionError {
  SUBSCRIPTION_INACTIVE = 'Inactive subscription',
}

export interface PermissionErrorResponse {
  detail: string;
}

const handlePermissionError = (error: AxiosError) => {
  if (error.response) {
    const permissionError = error.response.data as PermissionErrorResponse;

    if (permissionError.detail == PermissionError.SUBSCRIPTION_INACTIVE) {
      return (window.location.href = `/admin${URL_SUBSCRIPTION}`);
    }
  }
};

export const apiService = NeroAPIService.getInstance(
  NERO_API_BASE_URL,
  ENDPOINT_TOKEN_REFRESH,
  () => {
    handleRefreshTokenFailed(`/admin${URL_LOGOUT}`);
  },
  handlePermissionError
);
export const queryService = neroAPIQuery(apiService.getAxiosInstance());
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetOrderItemQuery,
  useUpdateOrderItemMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useCreateDeadlineMutation,
  useGetDeadlinesQuery,
  useUpdateDeadlineMutation,
  useDeleteDeadlineMutation,
  useCreateLevelMutation,
  useGetLevelsQuery,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
  useCreatePaperFormatMutation,
  useGetPaperFormatsQuery,
  useUpdatePaperFormatMutation,
  useDeletePaperFormatMutation,
  useGetPapersQuery,
  useUpdatePaperMutation,
  useDeletePaperMutation,
  useGetCustomersQuery,
  useGetUploadedImagesQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useGetOrderStatsQuery,
  useGetOrderItemsQuery,
  useGetOrdersQuery,
  useDeleteUploadedImageMutation,
  useCreatePageMutation,
  useGetDraftPagesQuery,
  useUpdatePageMutation,
  useCreateUploadedImageMutation,
  useDeletePageMutation,
  useCreateFooterGroupMutation,
  useGetFooterGroupsQuery,
  useUpdateFooterGroupMutation,
  useDeleteFooterGroupMutation,
  useCreateFooterLinkMutation,
  useGetFooterLinksQuery,
  useDeleteFooterLinkMutation,
  useUpdateFooterLinkMutation,
  useGetNavbarLinksQuery,
  useCreateNavbarLinkMutation,
  useUpdateNavbarLinkMutation,
  useDeleteNavbarLinkMutation,
  useGetSingleNavbarLinkQuery,
  useGetPublicSiteConfigsQuery,
  useGetCurrentSubscriptionQuery,
  useCancelSubscriptionMutation,
  useCreatePaperMutation,
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostTagsQuery,
  useGetSinglePostQuery,
  useCreatePostTagMutation,
  useUpdatePostTagMutation,
  useDeletePostTagMutation,
  useGetPostCategoriesQuery,
  useGetSinglePostCategoryQuery,
  useCreatePostCategoryMutation,
  useUpdatePostCategoryMutation,
  useDeletePostCategoryMutation,
  useCreateBlogImageMutation,
  useDeleteBlogImageMutation,
  useGetBlogImagesQuery,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useGetSingleCouponQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = queryService;
