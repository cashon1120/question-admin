/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {MenuDataItem, BasicLayoutProps as ProLayoutProps, Settings} from '@ant-design/pro-layout';
import React, {useEffect} from 'react';
import {ConfigProvider} from 'antd';
import Link from 'umi/link';
import {connect} from 'dva';
import {formatMessage} from 'umi-plugin-react/locale';
import zhCN from 'antd/es/locale/zh_CN'
import 'antd/dist/antd.css';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import {ConnectState, Dispatch} from '@/models/connect';
import logo from '../assets/logo.png';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap : {
    [path : string]: MenuDataItem;
  };
  settings : Settings;
  dispatch : Dispatch;
}
export type BasicLayoutContext = {
  [K in 'location']: BasicLayoutProps[K]
} & {
  breadcrumbNameMap: {
    [path : string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList : MenuDataItem[]) : MenuDataItem[] => menuList.map(item => {
  const localItem = {
    ...item,
    children: item.children
      ? menuDataRender(item.children)
      : []
  };
  return Authorized.check(item.authority, localItem, null)as MenuDataItem;
});

const BasicLayout : React.FC < BasicLayoutProps > = props => {
  const {dispatch, settings} = props;
  /**
   * constructor
   */
  const userId = sessionStorage.getItem('sysUserId')
  if (userId) {
    useEffect(() => {
      if (dispatch) {
        // dispatch({type: 'user/fetchCurrent'});
        // dispatch({type: 'settings/getSetting'});
      }
    }, []);
  } else {
    window.location.href = '/dist/#/login'
  }
  /**
   * init variables
   */
  const handleMenuCollapse = (payload : boolean) : void => dispatch && dispatch({type: 'global/changeLayoutCollapsed', payload});

  return (
    <ConfigProvider locale={zhCN}>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps : any, defaultDom : any) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
        breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({id: 'menu.home', defaultMessage: 'Home'})
        },
        ...routers
      ]}
        itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first
          ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          )
          : (
            <span>{route.breadcrumbName}</span>
          );
      }}
        menuDataRender={menuDataRender}
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps}/>}
        {...props}
        {...settings}>
        {/* {children} */}
      </ProLayout>
    </ConfigProvider>
  );
};

export default connect(({global, settings} : ConnectState) => ({collapsed: global.collapsed, settings}))(BasicLayout);
