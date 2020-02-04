/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, {useState} from 'react';
import DefaultFooter from '@ant-design/pro-layout/es/Footer'
import ProLayout, {BasicLayoutProps as ProLayoutProps} from '@ant-design/pro-layout/es/BasicLayout'
import {Settings} from '@ant-design/pro-layout/es/defaultSettings'
import {MenuDataItem} from '@ant-design/pro-layout/es/typings'
import SettingDrawer from '@ant-design/pro-layout/es/SettingDrawer/index'
import AntdIcon from '@ant-design/icons/lib/components/AntdIcon';
import Link from 'umi/link';
import defaultSettings from '../../config/defaultSettings';
import logo from '../assets/logo.svg';
import SvgIcon from '@/components/icon/SvgIcon';
import AppRouter from "@/AppRouter";


export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const [collapsed, handleMenuCollapse] = useState<boolean>(false);
  const [settings, setSettings] = useState<Partial<Settings>>({
    ...defaultSettings,
    fixSiderbar: true,
    fixedHeader: true,
  });
  console.log('props', props);
  return (
    <>
      <ProLayout
        logo={logo}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        breakpoint={false}
        onCollapse={handleMenuCollapse}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuItemRender={(menuItemProps, defaultDom) => {
          const icon = menuItemProps.icon as any;
          const item = <span>
            <span>
              {typeof icon === 'string' ? <SvgIcon className="anticon" src={icon}/> : <AntdIcon icon={icon}/>}
            </span>
            {menuItemProps.name}
          </span>
          return menuItemProps.isUrl ? (
            item
          ) : (
            <Link className="qixian-menuItem" to={menuItemProps.path || '/'}>
              {item}
            </Link>
          )
        }}
        // menuDataRender={menuDataRender}
        rightContentRender={() => (
          <div
            style={{
              padding: '0 16px',
            }}
          >
          </div>
        )}
        footerRender={() => <DefaultFooter/>}
        collapsed={collapsed}
        onMenuHeaderClick={() => AppRouter.push("/")}
        {...props}
        {...settings}>
        {props.children}
      </ProLayout>
      <SettingDrawer
        // hideLoading
        // hideCopyButton
        // hideHintAlert
        settings={settings}
        onSettingChange={config => setSettings(config)}
      />
    </>
  )
};

export default BasicLayout;
