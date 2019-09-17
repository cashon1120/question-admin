import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
import AddNew from './AddNew'
import ImageDetail from '../../components/ImageDetail'
import {getAuthority} from '../../utils/authority';
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

class Company extends Component < IProps,
IState > {
  state = {
    loading: false,
    modalVisible: false,
    imgDetailVisible: false,
    imgUrl: '',
    modalData: {},
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
      title: '公司名称',
      dataIndex: 'company_name',
      key: 'company_name'
    }, {
      title: '操作',
      width: 300,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleEdit(record)}>修改</a>
          <a onClick={() => this.handleDel(record.id)}>删除</a>
          {getAuthority()[0] !== 'superAdmin'
            ? <a onClick={() => this.handleSetImg(record.id)}>生成二维码</a>
            : null
}

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
        type: 'company/setImg',
        payload: {
          sysUserId: id
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
    const {searchData} = this.state;
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
        type: 'company/fetch',
        payload: {
          sysUserId: localStorage.getItem('sysUserId'),
          ...searchParams,
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
      content: '确认要删除该公司吗?',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'company/del',
            payload: {
              sysUserId: localStorage.getItem('sysUserId'),
              selectedUserId: id
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

  handleSaveImg = () => {
    var image = new Image()
    image.setAttribute("crossOrigin", 'Anonymous')
    image.src = 'http://ymhx.f3322.net:8123/uploads/images/19-08-22/602254cfa30f4ee28c5d6a4f75ce5' +
        '862.png';

    image.onload = function () {
      var canvas = document.createElement('canvas')
      canvas.width = 300
      canvas.height = 300

      var context = canvas.getContext('2d')
      if (context) {
        context.drawImage(image, 0, 0, 300, 300)
        var url = canvas.toDataURL('image/jpeg')
        // 生成一个a元素
        var a = document.createElement('a')
        // 创建一个单击事件
        var event = new MouseEvent('click')

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = name || '下载图片名称'
        // 将生成的URL设置为a.href属性
        a.href = url
        // 触发a的单击事件
        a.dispatchEvent(event)
      }
    }
  }

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
          rowKey="id"
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

export default connect(({company, loading} : ConnectState) => ({data: company.data, loading: loading.models.company}))(Company);
