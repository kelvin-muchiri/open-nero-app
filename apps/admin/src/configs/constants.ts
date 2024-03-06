// colors
export const COLOR_IN_PROGRESS = '#d46b08';
export const COLOR_COMPLETE = '#389e0d';
export const COLOR_VOID = '#cf1322';

// regex
export const REGEX_SLUG = /^[a-z0-9](-?[a-z0-9])*$/;

// admin urls
export const URL_LOGIN = '/';
export const URL_LOGOUT = '/logout';
export const URL_FORGOT_PASSWORD = '/forgot-password';
export const URL_RESET_PASSWORD = '/reset-password';
export const URL_USERS = '/users';
export const URL_PAGES = '/pages';
export const URL_NEW_PAGE = URL_PAGES + '/add';
export const URL_EDIT_PAGE = URL_PAGES + '/edit';
export const URL_PAPERS = '/papers';
export const URL_ADD_PAPER = URL_PAPERS + '/add';
export const URL_LEVELS = '/academic-levels';
export const URL_ADD_LEVEL = URL_LEVELS + '/add';
export const URL_DEADLINES = '/deadlines';
export const URL_ADD_DEADLINE = URL_DEADLINES + '/add';
export const URL_PRICING = URL_PAPERS + '/pricing';
export const URL_EDIT_PAPER = URL_PAPERS + '/edit';
export const URL_COURSES = '/courses';
export const URL_ADD_COURSE = URL_COURSES + '/add';
export const URL_PAPER_FORMATS = '/paper-formats';
export const URL_ADD_PAPER_FORMAT = URL_PAPER_FORMATS + '/add';
export const URL_CUSTOMERS = '/customers';
export const URL_ORDERS = '/orders';
export const URL_PREVIEW_PAGE = URL_PAGES + '/preview';
export const URL_PAGE_IMAGE_GALLERY = '/page-image-gallery';
export const URL_ORDER_ITEMS = '/order-items';
export const URL_NAVBAR_SETTINGS = '/menu-settings';
export const URL_ADD_NAVBAR_LINK = URL_NAVBAR_SETTINGS + '/add-menu-link';
export const URL_EDIT_NAVBAR_LINK = URL_NAVBAR_SETTINGS + '/edit-menu-link';
export const URL_FOOTER_SETTINGS = '/footer-settings';
export const URL_ADD_FOOTER_LINK = URL_FOOTER_SETTINGS + '/add-footer-link';
export const URL_EDIT_FOOTER_LINK = URL_FOOTER_SETTINGS + '/edit-footer-link';
export const URL_ADD_FOOTER_GROUP = URL_FOOTER_SETTINGS + '/add-footer-group';
export const URL_EDIT_FOOTER_GROUP = URL_FOOTER_SETTINGS + '/edit-footer-group';
export const URL_PAY_SUBSCRIPTION = '/pay-subscription';
export const URL_PAYMENT_SUCCESS = '/payment-success';
export const URL_PAYMENT_FAILED = '/payment-failed';
export const URL_PAYMENT_CANCELLED = '/payment-cancelled';
export const URL_SUBSCRIBE = '/subscribe';
export const URL_SUBSCRIPTION = '/subscription';
export const URL_BLOG_POSTS = '/blog-posts';
export const URL_ADD_BLOG_POST = URL_BLOG_POSTS + '/add';
export const URL_EDIT_BLOG_POST = URL_BLOG_POSTS + '/edit';
export const URL_BLOG_TAGS = '/blog-tags';
export const URL_ADD_BLOG_TAG = URL_BLOG_TAGS + '/add';
export const URL_EDIT_BLOG_TAG = URL_BLOG_TAGS + '/edit';
export const URL_BLOG_CATEGORIES = '/blog-categories';
export const URL_ADD_BLOG_CATEGORY = URL_BLOG_CATEGORIES + '/add';
export const URL_EDIT_BLOG_CATEGORY = URL_BLOG_CATEGORIES + '/edit';
export const URL_CHANGE_PASSWORD = '/change-password';
export const URL_COUPONS = '/coupons';
export const URL_ADD_COUPON = URL_COUPONS + '/add';

// url params
export const PARAM_UIDB64 = 'uidb64';
export const PARAM_TOKEN = 'token';
export const PARAM_ID = 'id';

// search params
export const SEARCH_ITEM_STATUS = 'item-status';

// api urls
export const ENDPOINT_TOKEN_REFRESH = '/auth/token/refresh/';
export const ENDPOINT_PROFILE = '/users/profile/';
export const ENDPOINT_ORDER_LIST = '/orders/';
export const ENDPOINT_PAPERS = '/catalog/papers/';
export const ENDPOINT_COURSES = '/catalog/courses/';
export const ENDPOINT_PAPER_FORMATS = '/catalog/formats/';
export const ENDPOINT_LEVELS = '/catalog/levels/';
export const ENDPOINT_DEADLINES = '/catalog/deadlines/';
export const ENDPOINT_DEADLINE_EXISTS = '/catalog/deadlines/exists/';
export const ENDPOINT_SERVICES = '/catalog/services/';
export const ENDPOINT_SERVICES_CREATE_BULK = '/catalog/services/create-bulk/';
export const ENDPOINT_SERVICES_DELETE_BULK = '/catalog/services/delete-bulk/';
export const ENDPOINT_PAGES = '/pages/';
export const ENDPOINT_CUSTOMERS = '/users/customers/';
export const ENDPOINT_ORDER_ITEMS = '/orders/items/';
export const ENDPOINT_PAPER_FILES = '/orders/paper-files/';
export const ENDPOINT_ORDER_STATS = '/orders/items/statistics/';
export const ENDPOINT_PAGE_IMAGES = '/pages/images/';
export const ENDPOINT_NAVBAR_LINKS = '/pages/navbar-links/';
export const ENDPOINT_FOOTER_GROUPS = '/pages/footer-groups/';
export const ENDPOINT_FOOTER_LINKS = '/pages/footer-links/';
export const ENDPOINT_SITE_CONFIGS = '/site-configs/public-configs/';
export const ENDPOINT_SUBSCRIPTION = '/subscription/';
export const ENDPOINT_BLOG_POSTS = '/blog/posts/';
export const ENDPOINT_BLOG_TAGS = '/blog/tags/';
export const ENDPOINT_BLOG_CATEGORIES = '/blog/categories/';
export const ENDPOINT_BLOG_IMAGES = '/blog/images/';
export const ENDPOINT_COUPONS = '/coupons/';
