export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 255;
export const MAX_FULL_NAME_LENGTH = 71;

// internal urls
export const URL_HOME = '/';
export const URL_LOGOUT = '/logout';
export const URL_FORGOT_PASSWORD = '/forgot';
export const URL_RESET_PASSWORD = '/reset-password';
export const URL_VERIFY_EMAIL = '/verify-email';
export const URL_ORDER_HISTORY = '/past-orders';
export const URL_PLACE_ORDER = `${URL_ORDER_HISTORY}/place-order`;
export const URL_CART = `${URL_ORDER_HISTORY}/cart`;
export const URL_ACCOUNT = '/account';
export const URL_CHANGE_PASSWORD = '/change-password';
export const URL_DELETE_ACCOUNT = `${URL_ACCOUNT}/delete`;
export const URL_MAKE_PAYMENT = '/make-payment';
export const URL_PAYMENT_SUCCESS = '/payment-success';
export const URL_VERIFY_EMAIL_INTERCEPTOR = '/verify-email-continue';
export const URL_CHANGE_UNVERIFIED_EMAIL = '/change-unverified-email';
export const URL_NOT_FOUND = '/not-found';

// url params
export const PARAM_ORDER_ID = 'orderId';
export const PARAM_CART_ITEM_ID = 'itemId';
export const PARAM_UIDB64 = 'uidb64';
export const PARAM_TOKEN = 'token';
export const PARAM_ORDER_ITEM_ID = 'orderItemId';
export const PARAM_ID = 'id';

// api urls
export const ENDPOINT_REGISTER = '/users/customers/create/';
export const ENDPOINT_CHECK_EMAIL_EXISTS = '/users/check-exists/email/';
export const ENDPOINT_TOKEN_REFRESH = '/auth/token/refresh/';
export const ENDPOINT_PROFILE = '/users/profile/';
export const ENDPOINT_PAPERS = '/catalog/papers/';
export const ENDPOINT_COURSES = '/catalog/courses/';
export const ENDPOINT_PAPER_FORMATS = '/catalog/formats/';
export const ENDPOINT_CART = '/cart/';
export const ENDPOINT_CART_ITEM = '/cart/items/';
export const ENDPOINT_APPLY_COUPON = '/coupons/apply/';
export const ENDPOINT_DELETE_ACCOUNT = '/users/customers/delete-account/';
export const ENDPOINT_VERIFY_EMAIL = '/users/verify/email/';
export const ENDPOINT_PAYMENT_METHODS = '/payments/methods/';
export const ENDPOINT_PAGES = '/pages/';
export const ENDPOINT_ORDER_ITEMS = '/orders/items/';
export const ENDPOINT_PAPER_FILES = '/orders/paper-files/';
export const ENDPOINT_RESEND_EMAIL_VERIFICATION = '/users/verify/email/resend/';
export const ENDPOINT_PUBLIC_SITE_CONFIGS = '/site-configs/public-configs/';
export const ENDPOINT_GOOGLE_RECAPTCHA_VERIFY = '/auth/google-recaptcha/';
export const ENDPOINT_SELF_ORDERS = '/orders/self/';
export const ENDPOINT_NAVBAR_LINKS = '/pages/navbar-links/';
export const ENDPOINT_FOOTER_GROUPS = '/pages/footer-groups/';
export const ENDPOINT_FOOTER_LINKS = '/pages/footer-links/';
export const ENDPOINT_SUBSCRIPTION = '/subscription';
export const ENDPOINT_BLOG_POSTS = '/blog/posts/';
export const ENDPOINT_BLOG_TAGS = '/blog/tags/';
export const ENDPOINT_BLOG_CATEGORIES = '/blog/categories/';
export const ENDPOINT_BLOG_IMAGES = '/blog/images/';
