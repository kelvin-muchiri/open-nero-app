import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import {
  URL_ORDER_HISTORY,
  PARAM_ORDER_ID,
  URL_PLACE_ORDER,
  URL_CART,
  PARAM_CART_ITEM_ID,
  URL_ACCOUNT,
  URL_CHANGE_PASSWORD,
  URL_DELETE_ACCOUNT,
  URL_FORGOT_PASSWORD,
  PARAM_UIDB64,
  PARAM_TOKEN,
  URL_RESET_PASSWORD,
  URL_VERIFY_EMAIL,
  URL_MAKE_PAYMENT,
  URL_PAYMENT_SUCCESS,
  PARAM_ORDER_ITEM_ID,
  ENDPOINT_ORDER_ITEMS,
  URL_CHANGE_UNVERIFIED_EMAIL,
  URL_VERIFY_EMAIL_INTERCEPTOR,
  URL_LOGOUT,
  URL_NOT_FOUND,
} from './configs/constants';
import {
  ACCOUNT,
  CART,
  DELETE_ACCOUNT,
  EDIT,
  FORGOT_PASSWORD,
  HISTORY,
  ORDER_NUMBER,
  PASSWORD,
  PLACE_ORDER,
  RESET_PASSWORD,
} from './configs/lang';
import { PrivateRoute } from '@nero/components';
import { BreadcrumbComponentProps, BreadcrumbComponentType } from 'use-react-router-breadcrumbs';
import { Breadcrumb } from 'antd';
import React, { lazy } from 'react';
import { AuthState } from '@nero/auth';
import { useGetOrderItemQuery } from './services/api';
import { GuestLayout } from './layout/GuestLayout';
import { CustomerLayout } from './layout/CustomerLayout';
import { ResultLayout } from './layout/ResultLayout';
import { NotFoundPage } from './pages/not-found';

// Route-based code splitting. Read more
// https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting
const AccountPage = lazy(() => import('./pages/account'));
const ChangePasswordPage = lazy(() => import('./pages/change-password'));
const DeleteAccountPage = lazy(() => import('./pages/delete-account'));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password'));
const ResetPasswordPage = lazy(() => import('./pages/reset-password'));
const VerifyEmailPage = lazy(() => import('./pages/verify-email'));
const PaymentPage = lazy(() => import('./pages/payment'));
const PaymentSuccessPage = lazy(() => import('./pages/payment-success'));
const ChangeUnverifiedEmailPage = lazy(() => import('./pages/change-unverified-email'));
const VerifyEmailInterceptorPage = lazy(() => import('./pages/verify-email-interceptor'));
const OrderHistoryPage = lazy(() => import('./pages/order-history'));
const OrderDetailPage = lazy(() => import('./pages/order-detail'));
const CartPage = lazy(() => import('./pages/cart'));
const RefreshTokenFailed = lazy(() => import('./pages/refresh-failed'));
const OrderPage = lazy(() => import('./pages/order'));

export interface CustomRouteObject extends RouteObject {
  breadcrumb?: string | BreadcrumbComponentType;
  children?: CustomRouteObject[];
}

export const OrderDetailBreadCrumb: BreadcrumbComponentType<typeof PARAM_ORDER_ID> = ({
  match,
}: BreadcrumbComponentProps) => {
  return (
    <Breadcrumb.Item>
      {ORDER_NUMBER} {match.params.orderId}
    </Breadcrumb.Item>
  );
};

export const OrderItemDetailBreadCrumb: BreadcrumbComponentType<typeof PARAM_ORDER_ITEM_ID> = ({
  match,
}: BreadcrumbComponentProps) => {
  const { data } = useGetOrderItemQuery({
    url: ENDPOINT_ORDER_ITEMS,
    id: match.params.orderItemId || '',
  });
  return <Breadcrumb.Item>{data?.topic}</Breadcrumb.Item>;
};

const applyGuestLayout = (Element: React.FC) => {
  return (
    <GuestLayout>
      <Element />
    </GuestLayout>
  );
};

const applyCustomerLayout = (Element: React.FC, auth: AuthState) => {
  const { isAuthenticated, isLoading, user } = auth;

  if (isLoading) {
    return (
      <CustomerLayout>
        <Element />
      </CustomerLayout>
    );
  }

  if (user?.profile_type != 'CUSTOMER') {
    return <Navigate to="/" />;
  }

  return (
    <CustomerLayout>
      <PrivateRoute
        component={<Element />}
        isAuthenticated={isAuthenticated}
        authenticationPath="/"
      />
    </CustomerLayout>
  );
};

export const routes = (auth: AuthState): CustomRouteObject[] => [
  {
    path: URL_LOGOUT,
    element: applyGuestLayout(RefreshTokenFailed),
  },
  {
    path: URL_FORGOT_PASSWORD,
    breadcrumb: FORGOT_PASSWORD,
    element: applyGuestLayout(ForgotPasswordPage),
  },
  {
    path: `${URL_RESET_PASSWORD}/:${PARAM_UIDB64}/:${PARAM_TOKEN}`,
    breadcrumb: RESET_PASSWORD,
    element: applyGuestLayout(ResetPasswordPage),
  },
  {
    path: `${URL_VERIFY_EMAIL}/:${PARAM_UIDB64}/:${PARAM_TOKEN}`,
    breadcrumb: RESET_PASSWORD,
    element: applyGuestLayout(VerifyEmailPage),
  },
  {
    path: URL_ORDER_HISTORY,
    breadcrumb: HISTORY,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: applyCustomerLayout(OrderHistoryPage, auth),
      },
      {
        path: `${URL_ORDER_HISTORY}/:${PARAM_ORDER_ID}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        breadcrumb: OrderDetailBreadCrumb,
        element: applyCustomerLayout(OrderDetailPage, auth),
      },
      {
        path: URL_PLACE_ORDER,
        breadcrumb: PLACE_ORDER,
        element: applyCustomerLayout(OrderPage, auth),
      },
      {
        path: `${URL_PLACE_ORDER}/:${PARAM_CART_ITEM_ID}`,
        breadcrumb: EDIT,
        element: applyCustomerLayout(OrderPage, auth),
      },
      {
        path: URL_CART,
        breadcrumb: CART,
        element: applyCustomerLayout(CartPage, auth),
      },
    ],
  },
  {
    path: URL_ACCOUNT,
    breadcrumb: ACCOUNT,
    element: <Outlet />,
    children: [
      { index: true, element: applyCustomerLayout(AccountPage, auth) },
      {
        path: URL_DELETE_ACCOUNT,
        breadcrumb: DELETE_ACCOUNT,
        element: applyCustomerLayout(DeleteAccountPage, auth),
      },
    ],
  },
  {
    path: URL_CHANGE_PASSWORD,
    breadcrumb: PASSWORD,
    element: applyCustomerLayout(ChangePasswordPage, auth),
  },
  {
    path: URL_MAKE_PAYMENT,
    element: (
      <ResultLayout>
        <PaymentPage />
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
    path: URL_VERIFY_EMAIL_INTERCEPTOR,
    element: (
      <ResultLayout>
        <VerifyEmailInterceptorPage />
      </ResultLayout>
    ),
  },
  {
    path: URL_CHANGE_UNVERIFIED_EMAIL,
    element: (
      <ResultLayout>
        <ChangeUnverifiedEmailPage />
      </ResultLayout>
    ),
  },
  {
    path: URL_NOT_FOUND,
    element: (
      <ResultLayout>
        <NotFoundPage />
      </ResultLayout>
    ),
  },
];
