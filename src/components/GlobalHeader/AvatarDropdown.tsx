import { Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {

  logout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  render(): React.ReactNode {
    const { currentUser = {}} = this.props;

    return currentUser && currentUser.name ? (
      <div>
        <span className={`${styles.action} ${styles.account}`}>
          <span className={styles.name}>{currentUser.name}</span>
          <span className={styles.name} style={{marginLeft:20}} onClick={this.logout}>退出</span>
        </span>
      </div>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
