export const NERO_API_BASE_URL =
  process.env.REACT_APP_NERO_API_BASE_URL ||
  (typeof window == 'undefined' ? '' : `${location.origin}/api/v1`);
export const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || '';
export const PAYPAL_BASIC_PLAN_ID = process.env.REACT_APP_PAYPAL_BASIC_PLAN_ID || '';
export const PAYPAL_BASIC_PLAN_WITH_TRIAL_ID =
  process.env.REACT_APP_PAYPAL_BASIC_PLAN_WITH_TRIAL_ID || '';
