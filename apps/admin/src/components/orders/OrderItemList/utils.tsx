import { SEARCH_ITEM_STATUS } from '../../../configs/constants';
import { OrderItemListParams, OrderItemStatus } from '@nero/query-api-service';

/**
 * Parse order list query params
 *
 * @param {URLSearchParams} params
 * @returns {OrderItemListParams} api filters
 */
export const parseQueryParams = (params: URLSearchParams): OrderItemListParams => {
  const apiParams: OrderItemListParams = {};
  const statusParam = params.get(SEARCH_ITEM_STATUS);

  if (statusParam) {
    if (statusParam == 'new') {
      apiParams.new = true;
    }

    if (statusParam == 'complete') {
      apiParams.status = OrderItemStatus.COMPLETE;
    }

    if (statusParam == 'overdue') {
      apiParams.is_overdue = true;
    }
  }

  return apiParams;
};
