import React, {Component} from 'react';
import {Card, Table} from 'antd'
import {PageHeaderWrapper} from '@ant-design/pro-layout';
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    area: '成都',
    age: 32,
    phone: '13982193130',
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    area: '成都',
    age: 42,
    phone: '13982193130',
    address: '西湖区湖底公园1号',
  },
];
const columns = [
  {
    title: '收货人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '所在地区',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '详细地址',
    render: ()=> {
      return <div>删除</div>
    }
  },
];
class Address extends Component {
  render() {
    return <PageHeaderWrapper>
      <Card>
        <Table size="middle" dataSource={dataSource} columns={columns} />
      </Card>
    </PageHeaderWrapper>
  }
}

export default Address
