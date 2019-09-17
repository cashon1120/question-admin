import React, { Fragment } from 'react';
import {Result, Icon} from 'antd';
import '../../global.less';

export default (): React.ReactNode => (
  <Fragment>
    <Result icon={<Icon type="smile" theme="twoTone" />}
    title="欢迎来到电力招聘平台!"
  />
  </Fragment>
);
