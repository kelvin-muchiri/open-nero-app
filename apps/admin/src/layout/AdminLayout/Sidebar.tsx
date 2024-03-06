import {
  BookOutlined,
  CopyOutlined,
  FileWordOutlined,
  FormOutlined,
  ScissorOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuInfo } from 'rc-menu/lib/interface';
import {
  CATALOG,
  COURSES,
  DEADLINES,
  PAPER_FORMATS,
  LEVELS,
  PAGES,
  PAPERS,
  CUSTOMERS,
  ORDERS,
  LOGOUT,
  IMAGE_GALLERY,
  ORDER_ITEMS,
  SETTINGS,
  MENU,
  FOOTER,
  SUBSCRIPTION,
  BLOG,
  POSTS,
  CATEGORIES,
  TAGS,
  ACCOUNT,
  CHANGE_PASSWORD,
  COUPONS,
} from '../../configs/lang';
import {
  URL_COURSES,
  URL_DEADLINES,
  URL_PAPER_FORMATS,
  URL_LEVELS,
  URL_PAGES,
  URL_PAPERS,
  URL_USERS,
  URL_CUSTOMERS,
  URL_LOGIN,
  URL_PAGE_IMAGE_GALLERY,
  URL_ORDER_ITEMS,
  URL_ORDERS,
  URL_NAVBAR_SETTINGS,
  URL_FOOTER_SETTINGS,
  URL_SUBSCRIPTION,
  URL_BLOG_POSTS,
  URL_BLOG_TAGS,
  URL_BLOG_CATEGORIES,
  URL_CHANGE_PASSWORD,
  URL_COUPONS,
} from '../../configs/constants';
import { LogoutModal } from '@nero/components';
import { apiService } from '../../services/api';

export enum MenuKeys {
  USERS = 'USERS',
  PAGES = 'PAGES',
  PAGES_SUBMENU = 'PAGES_SUBMENU',
  PAGES_GALLERY = 'PAGES_GALLERY',
  PAPERS = 'PAPERS',
  CATALOG = 'CATALOG',
  LEVELS = 'LEVELS',
  DEADLINES = 'DEADLINES',
  COURSES = 'COURSES',
  FORMATS = 'FORMATS',
  CUSTOMERS = 'CUSTOMERS',
  ORDERS = 'ORDERS',
  ORDERS_SUBMENU = 'ORDERS_SUBMENU',
  LOGOUT = 'LOGOUT',
  ORDER_ITEMS = 'ORDER_ITEMS',
  SETTINGS = 'SETTINGS',
  NAVBAR_SETTINGS = 'NAVBAR_SETTINGS',
  FOOTER_SETTINGS = 'FOOTER_SETTINGS',
  SUBSCRIPTION = 'SUBSCRIPTION',
  BLOG = 'BLOG',
  BLOG_POSTS = 'BLOG_POSTS',
  BLOG_TAGS = 'BLOG_TAGS',
  BLOG_CATEGORIES = 'BLOG_CATEGORIES',
  ACCOUNT = 'ACCOUNT',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  COUPON = 'COUPON',
}

const Sidebar = () => {
  const navigate = useNavigate();

  const handleClick = (e: MenuInfo) => {
    switch (e.key) {
      case MenuKeys.USERS:
        navigate(URL_USERS);
        break;
      case MenuKeys.PAGES:
        navigate(URL_PAGES);
        break;
      case MenuKeys.PAPERS:
        navigate(URL_PAPERS);
        break;
      case MenuKeys.LEVELS:
        navigate(URL_LEVELS);
        break;
      case MenuKeys.DEADLINES:
        navigate(URL_DEADLINES);
        break;
      case MenuKeys.COURSES:
        navigate(URL_COURSES);
        break;
      case MenuKeys.FORMATS:
        navigate(URL_PAPER_FORMATS);
        break;
      case MenuKeys.CUSTOMERS:
        navigate(URL_CUSTOMERS);
        break;
      case MenuKeys.ORDER_ITEMS:
        navigate(URL_ORDER_ITEMS);
        break;
      case MenuKeys.PAGES_GALLERY:
        navigate(URL_PAGE_IMAGE_GALLERY);
        break;
      case MenuKeys.ORDERS:
        navigate(URL_ORDERS);
        break;
      case MenuKeys.NAVBAR_SETTINGS:
        navigate(URL_NAVBAR_SETTINGS);
        break;
      case MenuKeys.FOOTER_SETTINGS:
        navigate(URL_FOOTER_SETTINGS);
        break;
      case MenuKeys.SUBSCRIPTION:
        navigate(URL_SUBSCRIPTION);
        break;
      case MenuKeys.BLOG_POSTS:
        navigate(URL_BLOG_POSTS);
        break;
      case MenuKeys.BLOG_TAGS:
        navigate(URL_BLOG_TAGS);
        break;
      case MenuKeys.BLOG_CATEGORIES:
        navigate(URL_BLOG_CATEGORIES);
        break;
      case MenuKeys.CHANGE_PASSWORD:
        navigate(URL_CHANGE_PASSWORD);
        break;
      case MenuKeys.COUPON:
        navigate(URL_COUPONS);
        break;
      default:
        break;
    }
  };

  return (
    <Menu mode="inline" theme="dark" onClick={handleClick}>
      <Menu.Item key={MenuKeys.CUSTOMERS} icon={<UserOutlined />}>
        {CUSTOMERS}
      </Menu.Item>
      <Menu.SubMenu key={MenuKeys.ORDERS_SUBMENU} title={ORDERS} icon={<FormOutlined />}>
        <Menu.Item key={MenuKeys.ORDERS}>{ORDERS}</Menu.Item>
        <Menu.Item key={MenuKeys.ORDER_ITEMS}>{ORDER_ITEMS}</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key={MenuKeys.BLOG} title={BLOG} icon={<FileWordOutlined />}>
        <Menu.Item key={MenuKeys.BLOG_POSTS}>{POSTS}</Menu.Item>
        <Menu.Item key={MenuKeys.BLOG_CATEGORIES}>{CATEGORIES}</Menu.Item>
        <Menu.Item key={MenuKeys.BLOG_TAGS}>{TAGS}</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key={MenuKeys.CATALOG} title={CATALOG} icon={<BookOutlined />}>
        <Menu.Item key={MenuKeys.DEADLINES}>{DEADLINES}</Menu.Item>
        <Menu.Item key={MenuKeys.LEVELS}>{LEVELS}</Menu.Item>
        <Menu.Item key={MenuKeys.PAPERS}>{PAPERS}</Menu.Item>
        <Menu.Item key={MenuKeys.COURSES}>{COURSES}</Menu.Item>
        <Menu.Item key={MenuKeys.FORMATS}>{PAPER_FORMATS}</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key={MenuKeys.PAGES_SUBMENU} title={PAGES} icon={<CopyOutlined />}>
        <Menu.Item key={MenuKeys.PAGES}>{PAGES}</Menu.Item>
        <Menu.Item key={MenuKeys.PAGES_GALLERY}>{IMAGE_GALLERY}</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key={MenuKeys.COUPON} title={COUPONS} icon={<ScissorOutlined />}>
        {COUPONS}
      </Menu.Item>
      <Menu.SubMenu key={MenuKeys.SETTINGS} title={SETTINGS} icon={<SettingOutlined />}>
        <Menu.Item key={MenuKeys.NAVBAR_SETTINGS}>{MENU}</Menu.Item>
        <Menu.Item key={MenuKeys.FOOTER_SETTINGS}>{FOOTER}</Menu.Item>
        <Menu.Item key={MenuKeys.SUBSCRIPTION}>{SUBSCRIPTION}</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key={MenuKeys.ACCOUNT} title={ACCOUNT} icon={<UserOutlined />}>
        <Menu.Item key={MenuKeys.CHANGE_PASSWORD}>{CHANGE_PASSWORD}</Menu.Item>
        <Menu.Item key={MenuKeys.LOGOUT}>
          <LogoutModal
            neroAPIService={apiService}
            onSuccess={() => {
              navigate(URL_LOGIN);
            }}
          >
            {LOGOUT}
          </LogoutModal>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export { Sidebar };
