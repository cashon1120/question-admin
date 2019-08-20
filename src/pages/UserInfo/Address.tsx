/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import React, {Component} from 'react';
import {Card} from 'antd'
import {connect} from 'dva';
import 'antd/dist/antd.css'
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable'
import {ConnectState, Dispatch} from '@/models/connect';

const dataSource = {
  data: [
    {
      id: 1,
      name: '胡彦斌',
      area: '成都',
      age: 32,
      phone: '13982193130',
      address: '西湖区湖底公园1号'
    }, {
      id: 2,
      name: '胡彦祖',
      area: '成都',
      age: 42,
      phone: '13982193130',
      address: '西湖区湖底公园1号'
    }
  ]
};
const columns = [
  {
    title: '收货人',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '所在地区',
    dataIndex: 'area',
    key: 'area'
  }, {
    title: '详细地址',
    dataIndex: 'address',
    key: 'address'
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
  }, {
    title: '详细地址',
    render: () => {
      return <div>删除</div>
    }
  }
];

interface IProps {
  dispatch : Dispatch;
  loading : boolean
}

class Address extends Component < IProps > {

  componentDidMount() {
    this.initData()
  }

  initData(params? : object) {
    const {dispatch} = this.props
    dispatch({type: 'user/fetchCurrent'});
  }

  handleSelectRows() {}

  render() {
    const {loading} = this.props
    return <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          data={dataSource || []}
          loading={loading}
          onChangeCombine={(params : object) => this.initData(params)}
          onSelectRow={this.handleSelectRows}/>
      </Card>
    </PageHeaderWrapper>
  }
};

export default connect(({global, settings} : ConnectState) => ({collapsed: global.collapsed, settings}))(Address);
