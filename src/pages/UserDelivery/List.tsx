import React, {Component} from 'react';
import {Card,  message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';

import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';

const {confirm} = Modal;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  selectedRowKeys : any[];
  searchData : {
    [key : string]: any
  };
  pageInfo : {
    pageSize: number;
    pageNumber: number;
  };
}

class UserDeliverList extends Component < IProps,
IState > {
  state = {
    loading: false,
    modalVisible: false,
    selectedRowKeys: [],
    searchData: {
      name: '',
      status: '',
      startTime: '',
      endTime: ''
    },
    pageInfo: {
      pageSize: 10,
      pageNumber: 1
    }
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
    }, {
      title: '审核状态',
      key: 'is_delivery',
      render: (record : any) => {
        let str = ''
        switch (record.is_delivery) {
          case 1:
            str = '待审核'
            break;
          case 2:
            str = '审核未通过'
            break;
          case 3:
            str = '审核通过'
            break;

          default:
            str = '未投递'
            break;
        }
        return str
      }
    }, {
      title: '操作',
      width: 200,
      render: (record : any) => {
        if (record.is_delivery === 1) {
          return (
            <div className="table-operate">
              <a onClick={() => this.hadleCheckOut(record.delivery_id, 3)}>通过审核</a>
              <a onClick={() => this.hadleCheckOut(record.delivery_id, 2)}>不通过</a>
            </div>
          )
        }
        return null
      }
    }
  ];

  componentDidMount() {
    this.initData();
  }

  handleTriggerModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible
    });
  };

  handleSelectRows = (selectedRowKeys : any[]) => {
    this.setState({selectedRowKeys})
  }

  // 加载数据
  initData(params?: any) {
    const {dispatch} = this.props;
    const {pageInfo, searchData} = this.state;
    const searchParams = {}
    // 拼接查询字段
    for (let key in searchData) {
      if (searchData[key]) {
        searchParams[key] = searchData[key]
      }
    }
    // 设置页码
    if (params) {
      this.setState({
        pageInfo: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize
        }
      });
    }

    if (dispatch) {
      dispatch({
        type: 'userDelivery/fetch',
        payload: {
          sysUserId: localStorage.getItem('sysUserId'),
          ...searchParams,
          ...pageInfo,
          ...params
        }
      });
    }
  }

  // 配置搜索条件
  getSerarchColumns = () => {
    const serarchColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
        componentType: 'Input'
      }, {
        title: '电话',
        dataIndex: 'phone',
        componentType: 'Input'
      },, {
        title: '审核状态',
        dataIndex: 'isDelivery',
        componentType: 'Select',
        dataSource: [
          {
            id: 0,
            value: '未投递'
          }, {
            id: 1,
            value: '待审核'
          }, {
            id: 2,
            value: '审核未通过'
          }, {
            id: 3,
            value: '审核通过'
          }
        ]
      }
    ];
    return serarchColumns;
  };

  // 搜索
  handleSearch = (values : any) => {
    const {searchData} = this.state

    this.setState({
      searchData: {
        ...searchData,
        ...values
      }
    }, () => {
      this.initData()
    })
  }

  // 重置搜索
  handleFormReset = () => {
    this.setState({
      searchData: {}
    }, () => {
      this.initData()
    })
  }

  // 导出详情
  exportFiel = () => {
    const {dispatch} = this.props;
    const {selectedRowKeys} = this.state
    if (selectedRowKeys.length === 0) {
      message.error('请勾选要导出的数据')
      return
    }
    if (dispatch) {
      dispatch({type: 'userDelivery/exportFile', payload: {}});
    }
  }

  hadleCheckOut = (id : string, type : number) => {
    const {dispatch} = this.props
    const callback = (res : any) => {
      if (res.success) {
        message.success('操作成功')
        this.initData()
      } else {
        message.error(res.data)
      }
    }
    let info = '审核通过后，考生即可扫描二维码考试，是否通过审核'
    if (type === 2) {
      info = '确定要拒绝通过吗?'
    }
    confirm({
      title: '审核信息',
      content: info,
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'userDelivery/checkOut',
            payload: {
              deliveryId: id,
              state: type
            },
            callback
          });
        }
      }
    });
  }

  render() {
    const {data, loading} = this.props;
    const {selectedRowKeys} = this.state;
    return (
      <Card>
        <div className="flex-container">
          <div className="flex-1">
            <TableSearch
              columns={this.getSerarchColumns()}
              handleSearch={this.handleSearch}
              handleFormReset={this.handleFormReset}/>
          </div>
        </div>
        <StandardTable
          showSelectRow={true}
          rowKey="delivery_id"
          columns={this.columns}
          data={data || []}
          loading={loading}
          onChangeCombine={(params : object) => this.initData(params)}
          onSelectRow={this.handleSelectRows}
          selectedRowKeys={selectedRowKeys}/>
      </Card>
    );
  }
}

export default connect(({userDelivery, loading} : ConnectState) => ({data: userDelivery.data, loading: loading.models.userDelivery}))(UserDeliverList);
