import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Menu, Spin} from 'antd';
import {ClickParam} from 'antd/es/menu';
import React from 'react';
import HeaderDropdown from '../headerdropdown';
import styles from './index.less';
import {LoginUserInfo} from "@/feign/user/info/LoginUserInfo";
import UserCmdDataProvider from "@/provider/UserCmdDataProvider";
import AppRouter from "@/AppRouter";

export interface GlobalHeaderRightProps {
  currentUser?: LoginUserInfo;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const {key} = event;

    if (key === 'logout') {

      UserCmdDataProvider.logout().then(() => {
        AppRouter.login();
      });
      return;
    }
  };


  render(): React.ReactNode {
    const {
      currentUser,
      menu,
    } = this.props;
    console.log("currentUser", currentUser);

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined/>
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined/>
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider/>}

        <Menu.Item key="logout">
          <LogoutOutlined/>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small"
                  className={styles.avatar}
                  src={currentUser.avatar} alt="avatar"/>
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default AvatarDropdown
