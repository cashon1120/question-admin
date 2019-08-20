import React from 'react';
import { Button } from 'antd'
import { Link } from 'umi'
import {PageHeaderWrapper} from '@ant-design/pro-layout';

export default() : React.ReactNode => (
  <PageHeaderWrapper>
    <div className="user-container algin-center">
      您还未进行实名认证
      <div style={{paddingTop: 30}}>
        <Link to='/userInfo/auth'><Button type="primary">去完成认证</Button></Link>
      </div>
    </div>
  </PageHeaderWrapper>
);
