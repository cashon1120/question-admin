import {Spin} from 'antd';
import React from 'react';
import {connect} from 'dva';
import {ConnectProps, ConnectState} from '@/models/connect';
import {CurrentUser} from '@/models/user';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component < GlobalHeaderRightProps > {

  logout = () => {
    const {dispatch} = this.props;
    sessionStorage.removeItem('sysUserId')
    sessionStorage.removeItem('userName')
    if (dispatch) {
      dispatch({type: 'login/logout'});
    }
  };

  render() : React.ReactNode {
    const userName = sessionStorage.getItem('userName')
    return  (
        <div>
          <span className={`${styles.action} ${styles.account}`}>
            <span className={styles.name}>{userName}</span>
            <span
              className={styles.name}
              style={{
              marginLeft: 20
            }}
              onClick={this.logout}>退出</span>
          </span>
        </div>
     );
  }
}
export default connect(({user} : ConnectState) => ({currentUser: user.currentUser}))(AvatarDropdown);
