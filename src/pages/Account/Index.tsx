import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import {ConnectProps, ConnectState} from '@/models/connect';
import AddNewCount from './AddNewCount'
const {confirm} = Modal;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  modalData : any,
  pageInfo : {
    pageSize: number;
    pageNum: number;
  };
}

class UserInfoList extends Component < IProps,
IState > {
  state = {
    loading: false,
    modalVisible: false,
    modalData: {},
    pageInfo: {
      pageSize: 1,
      pageNum: 10
    }
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '账号',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '所属公司',
      dataIndex: 'company',
      key: 'company'
    }, {
      title: '操作',
      width: 150,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleEdit(record)}>修改</a>
          <a onClick={() => this.handleDel(record.id)}>删除</a>
        </div>
      )
    }
  ];

  componentDidMount() {
    this.initData();
  }

  handleEdit = (record: any) => {
    this.setState({
      modalData:{
        ...record
      }
    })
    this.handleTriggerModal()
  }

  // 加载数据
  initData(params?: any) {
    const {dispatch} = this.props;
    const {pageInfo} = this.state;
    const searchParams = {}
    // 设置页码
    if (params) {
      this.setState({
        pageInfo: {
          pageNum: params.pageNum,
          pageSize: params.pageSize
        }
      });
    }

    if (dispatch) {
      dispatch({
        type: 'account/fetch',
        payload: {
          ...searchParams,
          ...pageInfo,
          ...params
        }
      });
    }
  }

  handleDel = (id : string) => {
    const {dispatch} = this.props
    const callback = (response : any) => {
      if (response.success) {
        message.success('操作成功')
      }
    }
    confirm({
      title: '系统提示',
      content: '确认要删除该用户吗？',
      onOk: () => {
        if (dispatch) {
          dispatch({type: 'account/del', payload: {
              id
            }, callback});
        }
      }
    });
  }

  handleSubmitModal = () => {
    this.handleTriggerModal();
  };

  handleAddNew = () => {
    this.setState({
      modalData: {}
    })
    this.handleTriggerModal();
  }

  handleTriggerModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible
    });
  };

  render() {
    const {data, loading} = this.props;
    const {modalVisible, modalData} = this.state
    return (
      <PageHeaderWrapper>
        <Card>
          <div className="flex-container">
            <div className="flex-1"></div>
            <div>
              <Button type="primary" onClick={this.handleAddNew}>新增</Button>
            </div>
          </div>
          <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params : object) => this.initData(params)}/>
        </Card>
        <AddNewCount
          modalVisible={modalVisible}
          modalData={modalData}
          onCancel={this.handleTriggerModal}
          onOk={this.handleSubmitModal}/>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({account, loading} : ConnectState) => ({data: account.data, loading: loading.models.userInfo}))(UserInfoList);
