import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
import AddNew from './AddNew'
import ImageDetail from '../../components/ImageDetail'

const {confirm} = Modal;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  imgDetailVisible : boolean;
  imgUrl : string;
  modalData : any,
  selectedRowKeys : any[];
  searchData : {
    [key : string]: any
  };
  pageInfo : {
    pageSize: number;
    pageNumber: number;
  };
}

class Staff extends Component < IProps,
IState > {
  state = {
    loading: false,
    modalVisible: false,
    modalData: {},
    imgDetailVisible: false,
    imgUrl: '',
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
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '考试二维码',
      key: 'img_url',
      render: (record : any) => (
        <div>
          <img
            style={{
            width: 80,
            height: 80
          }}
            src={record.img_url}
            onClick={() => {
            this.handleShowImgDetail(record.img_url)
          }}
            alt=""/>
        </div>
      )
    }, {
      title: '操作',
      width: 200,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleEdit(record)}>修改</a>
          <a onClick={() => this.handleDel(record.staffId)}>删除</a>
          <a onClick={() => this.handleSetImg(record.staffId)}>生成二维码</a>
        </div>
      )
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

  handleSetImg = (id : number) => {
    const {dispatch} = this.props;
    const callback = (res : any) => {
      if (res.success) {
        message.success('操作成功')
        this.initData()
      } else {
        message.error(res.data)
      }
    }
    if (dispatch) {
      dispatch({
        type: 'staff/setImg',
        payload: {
          staffId: id
        },
        callback
      });
    }
  }

  // 显示二维码大图
  handleShowImgDetail = (imgUrl?: string) => {
    const {imgDetailVisible} = this.state
    if (imgDetailVisible) {
      this.setState({imgDetailVisible: false})
    } else {
      if (imgUrl) {
        this.setState({imgUrl, imgDetailVisible: true})
      }
    }

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
        type: 'staff/fetch',
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
        title: '公司名称',
        dataIndex: 'name',
        componentType: 'Input'
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

  handleDel = (id : string) => {
    const {dispatch} = this.props
    const callback = (res : any) => {
      if (res.success) {
        message.success('操作成功')
        this.initData()
      } else {
        message.error(res.data)
      }
    }
    confirm({
      title: '系统提示',
      content: '确认要删除该员工吗?',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'staff/del',
            payload: {
              // sysUserId: localStorage.getItem('sysUserId'),
              staffId: id
            },
            callback
          });
        }
      }
    });
  }

  handleEdit = (record : any) => {
    this.setState({
      modalData: {
        ...record
      }
    })
    this.handleTriggerModal()
  }

  handleAddNew = () => {
    this.setState({modalData: {}})
    this.handleTriggerModal();
  }

  handleSubmitModal = () => {
    this.initData()
    this.handleTriggerModal();
  };

  render() {
    const {data, loading} = this.props;
    const {modalVisible, modalData, imgUrl, imgDetailVisible} = this.state
    return (
      <Card>
        <div className="flex-container">
          <div className="flex-1">
            <TableSearch
              columns={this.getSerarchColumns()}
              handleSearch={this.handleSearch}
              handleFormReset={this.handleFormReset}/>
          </div>
          <div>
            <Button type="primary" onClick={this.handleAddNew}>新增</Button>
          </div>
        </div>
        <StandardTable
          rowKey="staffId"
          columns={this.columns}
          data={data || []}
          loading={loading}
          onChangeCombine={(params : object) => this.initData(params)}/>
        <AddNew
          modalVisible={modalVisible}
          modalData={modalData}
          onCancel={this.handleTriggerModal}
          onOk={this.handleSubmitModal}/>
        <ImageDetail
          imgUrl={imgUrl}
          visible={imgDetailVisible}
          onCancel={this.handleShowImgDetail}/>

      </Card>
    );
  }
}

export default connect(({staff, loading} : ConnectState) => ({data: staff.data, loading: loading.models.staff}))(Staff);
