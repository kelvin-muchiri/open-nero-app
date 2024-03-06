import { Tabs } from 'antd';
import { FOOTER_GROUPS, FOOTER_LINKS } from '../../../configs/lang';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { FooterGroupList } from './footer_group/FooterGroupList';
import { FooterLinkList } from './footer_link/FooterLinkList';
import { updateActiveTab, FooterSettingsTabKeys } from './reducers/footer-settings-slice';

const { TabPane } = Tabs;

const FooterSettings = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.footerSettings.activeTab);

  const onChange = (key: string) => {
    dispatch(updateActiveTab(key as FooterSettingsTabKeys));
  };

  return (
    <Tabs activeKey={activeTab} onChange={onChange}>
      <TabPane tab={FOOTER_LINKS} key={FooterSettingsTabKeys.FOOTER_LINKS}>
        <FooterLinkList />
      </TabPane>
      <TabPane tab={FOOTER_GROUPS} key={FooterSettingsTabKeys.FOOTER_GROUPS}>
        <FooterGroupList />
      </TabPane>
    </Tabs>
  );
};

export { FooterSettings };
