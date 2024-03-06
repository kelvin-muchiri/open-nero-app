import { COMPLETE, IN_PROGRESS, PAID, PENDING, UNPAID, VOID } from '../lang';
import {
  OrderItemStatus,
  OrderStatus,
  OrderItem,
  PaperListItem,
  PaperListItemDeadline,
  Subscription,
  SubscriptionStatus,
} from '@nero/query-api-service';
import { STORAGE_REMEMBER, STORAGE_USER_LOGGED_IN } from '@nero/auth';
import { format } from 'date-fns';
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';

/**
 * get order status tag color
 *
 * @param {OrderStatus} status order status
 * @returns {string} color
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PAID:
      return 'green';

    case OrderStatus.UNPAID:
      return 'red';

    default:
      return 'blue';
  }
};

/**
 * get order item status color
 *
 * @param {OrderItemStatus} status order item status
 * @returns {string} color
 */
export const getOrderItemStatusColor = (status: OrderItemStatus): string => {
  switch (status) {
    case OrderItemStatus.COMPLETE:
      return 'green';

    case OrderItemStatus.IN_PROGRESS:
      return 'orange';

    case OrderItemStatus.VOID:
      return 'red';

    default:
      return 'blue';
  }
};

/**
 * Parse order item status into a display string
 *
 * @param status
 * @returns
 */
export const parseOrderItemStatus = (status: OrderItemStatus): string => {
  switch (status) {
    case OrderItemStatus.COMPLETE:
      return COMPLETE;

    case OrderItemStatus.IN_PROGRESS:
      return IN_PROGRESS;

    case OrderItemStatus.VOID:
      return VOID;

    case OrderItemStatus.PENDING:
      return PENDING;

    default:
      return '';
  }
};

/**
 * Parse order status into a display string
 *
 * @param status
 * @returns
 */
export const parseOrderStatus = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PAID:
      return PAID;

    case OrderStatus.UNPAID:
      return UNPAID;

    default:
      return '';
  }
};

/**
 * Download paper from AWS S3 link provided by API
 */
export const downloadPaper = async (downloadLink: string) => {
  const response = await axios({
    url: downloadLink,
    method: 'GET',
    responseType: 'blob',
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  const filePath = downloadLink.split('?')[0];
  const filePathParts = filePath.split('/');
  const fileName = filePathParts[filePathParts.length - 1];
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
};

/**
 * get order item due date string
 *
 * @param item
 * @returns
 */
export const getDueDateValue = (item: OrderItem) => {
  if (item.order.status == OrderStatus.UNPAID) {
    return `${item.deadline} from date of payment`;
  }

  if (!item.due_date) return 'N/A';

  return formatDate(item.due_date);
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'EEE, dd MMM yyyy hh:mm a');
};

export const getDeadlineOptions = (
  selectedPaper: PaperListItem,
  levelId?: string
): PaperListItemDeadline[] => {
  if (selectedPaper.deadlines.length) {
    return selectedPaper.deadlines;
  }

  if (!levelId) {
    return [];
  }

  const level = selectedPaper.levels.find((level) => level.id == levelId);

  if (!level) {
    return [];
  }

  return level.deadlines;
};

export const handleRefreshTokenFailed = (logoutUrl: string) => {
  const isLoggedIn =
    localStorage.getItem(STORAGE_REMEMBER) || sessionStorage.getItem(STORAGE_USER_LOGGED_IN);

  if (isLoggedIn) {
    return (window.location.href = logoutUrl);
  }
};

/**
 * Returns true if a subscription is active, false otherwise
 *
 *
 * @param {Subscription} subscription
 * @returns {boolean}
 */
export const isSubscriptionActive = (subscription: Subscription) => {
  if (subscription.status == SubscriptionStatus.CANCELLED && !subscription.is_expired) {
    return true;
  }

  return subscription.status == SubscriptionStatus.ACTIVE;
};

/**
 * Scroll to the top of the page
 * @returns
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const createMarkup = (text: string) => {
  return {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    __html: DOMPurify.sanitize(text, null),
  };
};
