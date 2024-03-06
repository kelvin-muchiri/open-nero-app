import { Navigate, RouteObject } from 'react-router-dom';
import {
  URL_LOGIN,
  URL_PAGES,
  URL_PAPERS,
  URL_ADD_PAPER,
  URL_ADD_LEVEL,
  URL_LEVELS,
  URL_DEADLINES,
  URL_ADD_DEADLINE,
  URL_PRICING,
  URL_EDIT_PAPER,
  URL_COURSES,
  URL_ADD_COURSE,
  URL_PAPER_FORMATS,
  URL_ADD_PAPER_FORMAT,
  URL_CUSTOMERS,
  ENDPOINT_ORDER_ITEMS,
  URL_EDIT_PAGE,
  URL_PREVIEW_PAGE,
  URL_PAGE_IMAGE_GALLERY,
  URL_ORDER_ITEMS,
  URL_ORDERS,
  URL_NAVBAR_SETTINGS,
  URL_ADD_NAVBAR_LINK,
  URL_EDIT_NAVBAR_LINK,
  URL_ADD_FOOTER_GROUP,
  URL_ADD_FOOTER_LINK,
  URL_EDIT_FOOTER_GROUP,
  URL_FOOTER_SETTINGS,
  URL_NEW_PAGE,
  URL_LOGOUT,
  URL_FORGOT_PASSWORD,
  URL_RESET_PASSWORD,
  PARAM_UIDB64,
  PARAM_TOKEN,
  URL_PAY_SUBSCRIPTION,
  URL_PAYMENT_SUCCESS,
  URL_PAYMENT_CANCELLED,
  URL_PAYMENT_FAILED,
  URL_SUBSCRIBE,
  URL_SUBSCRIPTION,
  URL_BLOG_POSTS,
  URL_BLOG_CATEGORIES,
  URL_ADD_BLOG_CATEGORY,
  URL_EDIT_BLOG_CATEGORY,
  URL_BLOG_TAGS,
  URL_ADD_BLOG_TAG,
  URL_EDIT_BLOG_TAG,
  PARAM_ID,
  URL_EDIT_FOOTER_LINK,
  URL_ADD_BLOG_POST,
  URL_EDIT_BLOG_POST,
  URL_CHANGE_PASSWORD,
  URL_COUPONS,
  URL_ADD_COUPON,
} from './configs/constants';
import {
  ADD_CATEGORY,
  ADD_COUPON,
  ADD_COURSE,
  ADD_DEADLINE,
  ADD_FOOTER_GROUP,
  ADD_FOOTER_LINK,
  ADD_LEVEL,
  ADD_MENU_LINK,
  ADD_PAPER,
  ADD_PAPER_FORMAT,
  ADD_TAG,
  CATEGORIES,
  CHANGE_PASSWORD,
  COUPONS,
  COURSES,
  CUSTOMERS,
  DEADLINES,
  EDIT_BLOG_POST,
  EDIT_CATEGORY,
  EDIT_COUPON,
  EDIT_COURSE,
  EDIT_DEADLINE,
  EDIT_FOOTER_GROUP,
  EDIT_FOOTER_LINK,
  EDIT_LEVEL,
  EDIT_MENU_LINK,
  EDIT_PAGE,
  EDIT_PAPER,
  EDIT_PAPER_FORMAT,
  EDIT_TAG,
  FOOTER_SETTINGS,
  FORGOT_PASSWORD,
  IMAGE_GALLERY,
  LEVELS,
  MENU_SETTINGS,
  NEW_PAGE,
  NEW_POST,
  ORDERS,
  ORDER_ITEMS,
  ORDER_NUMBER,
  PAGES,
  PAPERS,
  PAPER_FORMATS,
  POSTS,
  PRICING,
  RESET_PASSWORD,
  SUBSCRIPTION,
  TAGS,
} from './configs/lang';
import { PrivateRoute } from '@nero/components';
import { BreadcrumbComponentProps, BreadcrumbComponentType } from 'use-react-router-breadcrumbs';
import { Breadcrumb } from 'antd';
import React from 'react';
import { AdminLayout } from './layout/AdminLayout';
import { AdminLoginPage } from './pages/admin-login';
import { PageEditPage } from './pages/page-edit';
import { PaperAddPage } from './pages/paper-add';
import { PaperEditPage } from './pages/paper-edit';
import { LevelEditPage } from './pages/level-edit';
import { LevelAddPage } from './pages/level-add';
import { DeadlineAddPage } from './pages/deadline-add';
import { DeadlineEditPage } from './pages/deadline-edit';
import { PricingPage } from './pages/pricing';
import { CourseAddPage } from './pages/course-add';
import { CourseEditPage } from './pages/course-edit';
import { PaperFormatAddPage } from './pages/paper-format-add';
import { PaperFormatEditPage } from './pages/paper-format-edit';
import { OrderItemPage } from './pages/order-item';
import { AuthState } from '@nero/auth';
import { PagePreviewPage } from './pages/page-preview';
import { PageListPage } from './pages/page-list';
import { PaperListPage } from './pages/paper-list';
import { LevelListPage } from './pages/level-list';
import { DeadlineListPage } from './pages/deadline-list';
import { CourseListPage } from './pages/course-list';
import { PaperFormatListPage } from './pages/paper-format-list';
import { CustomerListPage } from './pages/customer-list';
import { OrderItemListPage } from './pages/order-item-list';
import { PageImageGalleryPage } from './pages/page-image-gallery';
import { OrderListPage } from './pages/order-list';
import { AdminOrderDetailPage } from './pages/order-detail';
import { NavbarSettingsPage } from './pages/navbar-settings';
import { NavbarLinkAddPage } from './pages/navbar-link-add';
import { NavbarLinkEditPage } from './pages/navbar-link-edit';
import { FooterGroupAddPage } from './pages/footer-group-add';
import { FooterGroupEditPage } from './pages/footer-group-edit';
import { FooterLinkAddPage } from './pages/footer-link-add';
import { FooterLinkEditPage } from './pages/footer-link-edit';
import { FooterSettingsPage } from './pages/footer-settings';
import { useGetOrderItemQuery } from './services/api';
import { AddPage } from './components/page_managment/PageAdd';
import { PreviewLayout } from './layout/PreviewLayout';
import { RefreshTokenFailed } from './pages/refresh-failed';
import { ForgotPasswordPage } from './pages/forgot-password';
import { ResetPasswordPage } from './pages/reset-password';
import { ResultLayout } from './layout/ResultLayout';
import { SubscriptionPaymentPage } from './pages/subscription_payment';
import { PaymentSuccessPage } from './pages/payment-success';
import { PaymentCancelledPage } from './pages/payment-cancelled';
import { PaymentFailedPage } from './pages/payment-failed';
import { SubscribePage } from './pages/subscribe';
import { SubscriptionPage } from './pages/subscription';
import { PostListPage } from './pages/blog/post-list';
import { BlogCategoryTreePage } from './pages/blog/category-tree';
import { BlogCategoryAddPage } from './pages/blog/category-add';
import { BlogCategoryEditPage } from './pages/blog/category-edit';
import { BlogTagListPage } from './pages/blog/tag-list';
import { BlogTagAddPage } from './pages/blog/tag-add';
import { BlogTagEditPage } from './pages/blog/tag-edit';
import { BlogPostAddPage } from './pages/blog/post-add';
import { BlogPostEditPage } from './pages/blog/post-edit';
import { ChangePasswordPage } from './pages/user/change-password';
import { CouponListPage } from './pages/coupon/coupon-list';
import { CouponAddPage } from './pages/coupon/coupon-add';
import { CouponEditPage } from './pages/coupon/coupon-edit';

export interface CustomRouteObject extends RouteObject {
  breadcrumb?: string | BreadcrumbComponentType;
  children?: CustomRouteObject[];
}

export const OrderDetailBreadCrumb: BreadcrumbComponentType<typeof PARAM_ID> = ({
  match,
}: BreadcrumbComponentProps) => {
  return (
    <Breadcrumb.Item>
      {ORDER_NUMBER} {match.params.id}
    </Breadcrumb.Item>
  );
};

export const OrderItemDetailBreadCrumb: BreadcrumbComponentType<typeof PARAM_ID> = ({
  match,
}: BreadcrumbComponentProps) => {
  const { data } = useGetOrderItemQuery({
    url: ENDPOINT_ORDER_ITEMS,
    id: match.params.id || '',
  });
  return <Breadcrumb.Item>{data?.topic}</Breadcrumb.Item>;
};

const applyAdminLayout = (Element: React.FC, auth: AuthState) => {
  const { isAuthenticated, isLoading, user } = auth;

  if (isLoading) {
    return (
      <AdminLayout>
        <Element />
      </AdminLayout>
    );
  }

  if (user?.profile_type != 'STAFF') {
    return <Navigate to={URL_LOGIN} />;
  }

  return (
    <AdminLayout>
      <PrivateRoute
        component={<Element />}
        isAuthenticated={isAuthenticated}
        authenticationPath={URL_LOGIN}
      />
    </AdminLayout>
  );
};

const applyPreviewLayout = (Element: React.FC, auth: AuthState) => {
  const { isAuthenticated, isLoading, user } = auth;

  if (isLoading) {
    return (
      <PreviewLayout>
        <Element />
      </PreviewLayout>
    );
  }

  if (user?.profile_type != 'STAFF') {
    return <Navigate to={URL_LOGIN} />;
  }

  return (
    <PreviewLayout>
      <PrivateRoute
        component={<Element />}
        isAuthenticated={isAuthenticated}
        authenticationPath={URL_LOGIN}
      />
    </PreviewLayout>
  );
};

export const routes = (auth: AuthState): CustomRouteObject[] => [
  {
    path: URL_LOGIN,
    element: <AdminLoginPage />,
  },
  {
    path: URL_LOGOUT,
    element: <RefreshTokenFailed />,
  },
  {
    path: URL_FORGOT_PASSWORD,
    breadcrumb: FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: `${URL_RESET_PASSWORD}/:${PARAM_UIDB64}/:${PARAM_TOKEN}`,
    breadcrumb: RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
  {
    path: URL_PAGES,
    breadcrumb: PAGES,
    element: applyAdminLayout(PageListPage, auth),
  },
  {
    path: URL_NEW_PAGE,
    breadcrumb: NEW_PAGE,
    element: applyAdminLayout(AddPage, auth),
  },
  {
    path: `${URL_EDIT_PAGE}/:${PARAM_ID}`,
    breadcrumb: EDIT_PAGE,
    element: applyAdminLayout(PageEditPage, auth),
  },
  {
    path: `${URL_PREVIEW_PAGE}/:${PARAM_ID}`,
    element: applyPreviewLayout(PagePreviewPage, auth),
  },
  {
    path: URL_PAPERS,
    breadcrumb: PAPERS,
    element: applyAdminLayout(PaperListPage, auth),
  },
  {
    path: URL_ADD_PAPER,
    breadcrumb: ADD_PAPER,
    element: applyAdminLayout(PaperAddPage, auth),
  },
  {
    path: `${URL_EDIT_PAPER}/:${PARAM_ID}`,
    breadcrumb: EDIT_PAPER,
    element: applyAdminLayout(PaperEditPage, auth),
  },
  {
    path: `${URL_PRICING}/:${PARAM_ID}`,
    breadcrumb: PRICING,
    element: applyAdminLayout(PricingPage, auth),
  },
  {
    path: URL_LEVELS,
    breadcrumb: LEVELS,
    element: applyAdminLayout(LevelListPage, auth),
  },
  {
    path: URL_ADD_LEVEL,
    breadcrumb: ADD_LEVEL,
    element: applyAdminLayout(LevelAddPage, auth),
  },
  {
    path: `${URL_LEVELS}/:${PARAM_ID}`,
    breadcrumb: EDIT_LEVEL,
    element: applyAdminLayout(LevelEditPage, auth),
  },
  {
    path: URL_DEADLINES,
    breadcrumb: DEADLINES,
    element: applyAdminLayout(DeadlineListPage, auth),
  },
  {
    path: URL_ADD_DEADLINE,
    breadcrumb: ADD_DEADLINE,
    element: applyAdminLayout(DeadlineAddPage, auth),
  },
  {
    path: `${URL_DEADLINES}/:${PARAM_ID}`,
    breadcrumb: EDIT_DEADLINE,
    element: applyAdminLayout(DeadlineEditPage, auth),
  },
  {
    path: URL_COURSES,
    breadcrumb: COURSES,
    element: applyAdminLayout(CourseListPage, auth),
  },
  {
    path: URL_ADD_COURSE,
    breadcrumb: ADD_COURSE,
    element: applyAdminLayout(CourseAddPage, auth),
  },
  {
    path: `${URL_COURSES}/:${PARAM_ID}`,
    breadcrumb: EDIT_COURSE,
    element: applyAdminLayout(CourseEditPage, auth),
  },
  {
    path: URL_PAPER_FORMATS,
    breadcrumb: PAPER_FORMATS,
    element: applyAdminLayout(PaperFormatListPage, auth),
  },
  {
    path: URL_ADD_PAPER_FORMAT,
    breadcrumb: ADD_PAPER_FORMAT,
    element: applyAdminLayout(PaperFormatAddPage, auth),
  },
  {
    path: `${URL_PAPER_FORMATS}/:${PARAM_ID}`,
    breadcrumb: EDIT_PAPER_FORMAT,
    element: applyAdminLayout(PaperFormatEditPage, auth),
  },
  {
    path: URL_CUSTOMERS,
    breadcrumb: CUSTOMERS,
    element: applyAdminLayout(CustomerListPage, auth),
  },
  {
    path: URL_ORDER_ITEMS,
    breadcrumb: ORDER_ITEMS,
    element: applyAdminLayout(OrderItemListPage, auth),
  },
  {
    path: `${URL_ORDER_ITEMS}/:${PARAM_ID}`,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    breadcrumb: OrderItemDetailBreadCrumb,
    element: applyAdminLayout(OrderItemPage, auth),
  },
  {
    path: URL_PAGE_IMAGE_GALLERY,
    breadcrumb: IMAGE_GALLERY,
    element: applyAdminLayout(PageImageGalleryPage, auth),
  },
  {
    path: URL_ORDERS,
    breadcrumb: ORDERS,
    element: applyAdminLayout(OrderListPage, auth),
  },
  {
    path: `${URL_ORDERS}/:${PARAM_ID}`,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    breadcrumb: OrderDetailBreadCrumb,
    element: applyAdminLayout(AdminOrderDetailPage, auth),
  },
  {
    path: URL_NAVBAR_SETTINGS,
    breadcrumb: MENU_SETTINGS,
    element: applyAdminLayout(NavbarSettingsPage, auth),
  },
  {
    path: URL_ADD_NAVBAR_LINK,
    breadcrumb: ADD_MENU_LINK,
    element: applyAdminLayout(NavbarLinkAddPage, auth),
  },
  {
    path: `${URL_EDIT_NAVBAR_LINK}/:${PARAM_ID}`,
    breadcrumb: EDIT_MENU_LINK,
    element: applyAdminLayout(NavbarLinkEditPage, auth),
  },
  {
    path: URL_FOOTER_SETTINGS,
    breadcrumb: FOOTER_SETTINGS,
    element: applyAdminLayout(FooterSettingsPage, auth),
  },
  {
    path: URL_ADD_FOOTER_GROUP,
    breadcrumb: ADD_FOOTER_GROUP,
    element: applyAdminLayout(FooterGroupAddPage, auth),
  },
  {
    path: `${URL_EDIT_FOOTER_GROUP}/:${PARAM_ID}`,
    breadcrumb: EDIT_FOOTER_GROUP,
    element: applyAdminLayout(FooterGroupEditPage, auth),
  },
  {
    path: URL_ADD_FOOTER_LINK,
    breadcrumb: ADD_FOOTER_LINK,
    element: applyAdminLayout(FooterLinkAddPage, auth),
  },
  {
    path: `${URL_EDIT_FOOTER_LINK}/:${PARAM_ID}`,
    breadcrumb: EDIT_FOOTER_LINK,
    element: applyAdminLayout(FooterLinkEditPage, auth),
  },
  {
    path: URL_SUBSCRIPTION,
    breadcrumb: SUBSCRIPTION,
    element: applyAdminLayout(SubscriptionPage, auth),
  },
  {
    path: URL_BLOG_POSTS,
    breadcrumb: POSTS,
    element: applyAdminLayout(PostListPage, auth),
  },
  {
    path: URL_ADD_BLOG_POST,
    breadcrumb: NEW_POST,
    element: applyAdminLayout(BlogPostAddPage, auth),
  },
  {
    path: `${URL_EDIT_BLOG_POST}/:${PARAM_ID}`,
    breadcrumb: EDIT_BLOG_POST,
    element: applyAdminLayout(BlogPostEditPage, auth),
  },
  {
    path: URL_BLOG_CATEGORIES,
    breadcrumb: CATEGORIES,
    element: applyAdminLayout(BlogCategoryTreePage, auth),
  },
  {
    path: URL_ADD_BLOG_CATEGORY,
    breadcrumb: ADD_CATEGORY,
    element: applyAdminLayout(BlogCategoryAddPage, auth),
  },
  {
    path: `${URL_EDIT_BLOG_CATEGORY}/:${PARAM_ID}`,
    breadcrumb: EDIT_CATEGORY,
    element: applyAdminLayout(BlogCategoryEditPage, auth),
  },
  {
    path: URL_BLOG_TAGS,
    breadcrumb: TAGS,
    element: applyAdminLayout(BlogTagListPage, auth),
  },
  {
    path: URL_ADD_BLOG_TAG,
    breadcrumb: ADD_TAG,
    element: applyAdminLayout(BlogTagAddPage, auth),
  },
  {
    path: `${URL_EDIT_BLOG_TAG}/:${PARAM_ID}`,
    breadcrumb: EDIT_TAG,
    element: applyAdminLayout(BlogTagEditPage, auth),
  },
  {
    path: URL_CHANGE_PASSWORD,
    breadcrumb: CHANGE_PASSWORD,
    element: applyAdminLayout(ChangePasswordPage, auth),
  },
  {
    path: URL_COUPONS,
    breadcrumb: COUPONS,
    element: applyAdminLayout(CouponListPage, auth),
  },
  {
    path: URL_ADD_COUPON,
    breadcrumb: ADD_COUPON,
    element: applyAdminLayout(CouponAddPage, auth),
  },
  {
    path: `${URL_COUPONS}/:${PARAM_ID}`,
    breadcrumb: EDIT_COUPON,
    element: applyAdminLayout(CouponEditPage, auth),
  },
  {
    path: URL_PAY_SUBSCRIPTION,
    element: (
      <ResultLayout>
        <SubscriptionPaymentPage />
      </ResultLayout>
    ),
  },
  {
    path: URL_PAYMENT_SUCCESS,
    element: (
      <ResultLayout>
        <PaymentSuccessPage />
      </ResultLayout>
    ),
  },
  {
    path: URL_PAYMENT_CANCELLED,
    element: (
      <ResultLayout>
        <PaymentCancelledPage />
      </ResultLayout>
    ),
  },
  {
    path: URL_PAYMENT_FAILED,
    element: (
      <ResultLayout>
        <PaymentFailedPage />
      </ResultLayout>
    ),
  },
  {
    path: URL_SUBSCRIBE,
    element: (
      <ResultLayout>
        <SubscribePage />
      </ResultLayout>
    ),
  },
];
