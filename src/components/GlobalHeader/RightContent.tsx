import React from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { ConnectProps, ConnectState } from '@/models/connect';

import Avatar from './AvatarDropdown';
// import NoticeIconView from './NoticeIconView';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  let className = styles.right;

  return (
    <div className={className}>
      {/* <div>
        <NoticeIconView/>
      </div> */}
      <div>
        <Link to="/">控制中心</Link>
      </div>
      <div>
        <Link to="/">免费试用</Link>
      </div>
      <div>
        <Link to="/">续费扩容</Link>
      </div>

      <div>
        <Avatar />
      </div>
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
