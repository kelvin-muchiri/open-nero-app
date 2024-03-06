export const NERO_API_BASE_URL =
  process.env.REACT_APP_NERO_API_BASE_URL ||
  (typeof window == 'undefined' ? '' : `${location.origin}/api/v1`);
export const GOOGLE_RECAPTCHA_SITE_KEY = process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY || '';
export const NODE_ENV = process.env.NODE_ENV || '';
