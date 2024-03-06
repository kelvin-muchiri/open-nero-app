import { Tabs } from 'antd';
import { MENU_LINKS } from '../../../configs/lang';
import { NavbarLinksTree } from './navbar_link/NavbarLinksTree';

const { TabPane } = Tabs;

const NavbarSettings = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab={MENU_LINKS} key="1">
        <NavbarLinksTree />
      </TabPane>
    </Tabs>
  );
};

export { NavbarSettings };
