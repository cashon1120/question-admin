import React from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';

import Avatar from './AvatarDropdown';
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
      <div>
        <Avatar />
      </div>
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  layout: settings.layout,
}))(GlobalHeaderRight);
