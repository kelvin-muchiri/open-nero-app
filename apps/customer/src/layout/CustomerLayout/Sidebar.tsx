import { HourglassOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuInfo } from 'rc-menu/lib/interface';
import { ACCOUNT, HISTORY, LOGOUT, PASSWORD, SETTINGS } from '../../configs/lang';
import { URL_ACCOUNT, URL_CHANGE_PASSWORD, URL_ORDER_HISTORY } from '../../configs/constants';
import { LogoutModal } from '@nero/components';
import { apiService } from '../../services/api';
import { useGetURLSignIn } from '../../helpers/hooks';

const { SubMenu } = Menu;

export enum MenuKeys {
  HISTORY = 'history',
  PASSWORD = 'password',
  ACCOUNT = 'account',
  SETTINGS = 'settings',
  LOGOUT = 'logout',
}

const Sidebar = () => {
  const navigate = useNavigate();
  const urlSignIn = useGetURLSignIn();

  const handleClick = (e: MenuInfo) => {
    if (e.key == MenuKeys.HISTORY) {
      navigate(URL_ORDER_HISTORY);
    } else if (e.key == MenuKeys.ACCOUNT) {
      navigate(URL_ACCOUNT);
    } else if (e.key == MenuKeys.PASSWORD) {
      navigate(URL_CHANGE_PASSWORD);
    }
  };

  return (
    <Menu mode="inline" style={{ height: '100%', borderRight: 0 }} onClick={handleClick}>
      <Menu.Item key={MenuKeys.HISTORY} icon={<HourglassOutlined />}>
        {HISTORY}
      </Menu.Item>
      <SubMenu key={MenuKeys.SETTINGS} icon={<SettingOutlined />} title={SETTINGS}>
        <Menu.Item key={MenuKeys.ACCOUNT}>{ACCOUNT}</Menu.Item>
        <Menu.Item key={MenuKeys.PASSWORD}>{PASSWORD}</Menu.Item>
      </SubMenu>
      <Menu.Item key={MenuKeys.LOGOUT} icon={<LogoutOutlined />}>
        <LogoutModal
          neroAPIService={apiService}
          onSuccess={() => {
            navigate(urlSignIn);
          }}
        >
          {LOGOUT}
        </LogoutModal>
      </Menu.Item>
    </Menu>
  );
};

export { Sidebar };
