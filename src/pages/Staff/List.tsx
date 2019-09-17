import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
import AddNew from './AddNew'
import EditQCode from './EditQCode'
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
  editVisible : boolean;
  editType: number;
  showPeopleVisible : boolean;
  imgDetailVisible : boolean;
  imgUrl : string;
  peopleData : any[],
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
    editVisible: false,
    editType: 0,
    modalData: {},
    imgDetailVisible: false,
    showPeopleVisible: false,
    imgUrl: '',
    selectedRowKeys: [],
    peopleData: [],
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

  peopleCoumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (sex : number) => <span>{sex === 1
            ? '女'
            : sex === 0
              ? '男'
              : '未知'}</span>
    }, {
      title: '出生年月',
      dataIndex: 'birth_time',
      key: 'birth_time'
    }, {
      title: '预计毕业时间',
      dataIndex: 'graduation_time',
      key: 'graduation_time'
    }, {
      title: '学历',
      dataIndex: 'education',
      key: 'education'
    }, {
      title: '专业名称',
      dataIndex: 'profession_name',
      key: 'profession_name'
    }, {
      title: '专业分类',
      dataIndex: 'profession_category',
      key: 'profession_category'
    }, {
      title: '毕业院校',
      dataIndex: 'graduated_school',
      key: 'graduated_school'
    }, {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone'
    }
  ]
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
      title: '会场',
      dataIndex: 'address',
      key: 'address'
    }, {
      title: '考试地址',
      dataIndex: 'ks_address',
      key: 'ks_address'
    }, {
      title: '招聘二维码时间',
      key: 'time1',
      render: (record : any) => {
        return <div>{record.zp_start_time}至{record.zp_end_time}</div>
      }
    }, {
      title: getAuthority()[0] !== 'superAdmin'
        ? '招聘二维码'
        : '',
      key: 'img_url',
      render: (record : any) => {
        if (getAuthority()[0] !== 'superAdmin') {
          return <img
            style={{
            width: 80,
            height: 80
          }}
            src={record.img_url}
            onClick={() => {
            this.handleShowImgDetail(record.img_url)
          }}
            alt=""/>
        }
        return null
      }
    }, {
      title: '考试二维码时间',
      key: 'time2',
      render: (record : any) => {
        return <div>{record.ks_start_time}至{record.ks_end_time}</div>
      }
    }, {
      title: getAuthority()[0] !== 'superAdmin'
        ? '考试二维码'
        : '',
      key: 'ks_img_url',
      render: (record : any) => {
        if (getAuthority()[0] !== 'superAdmin') {
          return <img
            style={{
            width: 80,
            height: 80
          }}
            src={record.ks_img_url}
            onClick={() => {
            this.handleShowImgDetail(record.ks_img_url)
          }}
            alt=""/>
        }
        return null
      }
    }, {
      title: '招聘人数',
      key: 'people_num',
      render: (record : any) => {
        return <a onClick={() => this.handleShowPeople(record.id)}>{record.people_num || 0}</a>
      }
    }, {
      title: '操作',
      width: 250,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleSetCode(record, 1)}>生成招聘二维码</a>
          <a onClick={() => this.handleSetCode(record, 2)}>生成考试二维码</a>
          <a onClick={() => this.handleDel(record.staffId)}>删除</a>
        </div>
      )
    }
  ];

  columns_admin = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '所属公司',
      dataIndex: 'company_name',
      key: 'company_name'
    }, {
      title: '操作',
      width: 250,
      render: (record : any) => (
        <div className="table-operate">
          <a onClick={() => this.handleEdit(record)}>修改</a>
          <a onClick={() => this.handleDel(record.staffId)}>删除</a>
        </div>
      )
    }
  ];

  componentDidMount() {
    this.initData();
  }

  handleTriggerModal = (type?: number) => {
    if (type === 1) {
      const {editVisible} = this.state;
      this.setState({
        editVisible: !editVisible
      });
    } else {
      const {modalVisible} = this.state;
      this.setState({
        modalVisible: !modalVisible
      });
    }
  };

  handleSetKsImg = (id : number) => {
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
          staffId: id
        },
        callback
      });
    }
  }

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

  // 生成二维码
  handleSetCode = (record: any, type: number) => {
    this.setState({
      editVisible: true,
      editType: type,
      modalData: {
        ...record
      }
    })
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

  // 修改账号
  handleEdit = (record : any) => {
    this.setState({
      modalData: {
        ...record
      }
    })
    this.handleTriggerModal()
  }

  // 添加账号
  handleAddNew = () => {
    this.setState({modalData: {}})
    this.handleTriggerModal();
  }

  // 提交
  handleSubmitModal = (type?: number) => {
    this.initData()
    if(type === 1){
      this.handleTriggerModal(1);
    }else{
      this.handleTriggerModal();
    }
  };

  handleCancel = () => {
    this.setState({showPeopleVisible: false})
  }

  // 显示招聘人员
  handleShowPeople = (id : string) => {
    const {dispatch} = this.props;

    const callback = (res : any) => {
      if (res.success) {
        this.setState({showPeopleVisible: true, peopleData: res.data})
      } else {
        message.error(res.data)
      }
    }
    if (dispatch) {
      dispatch({
        type: 'staff/showPeople',
        payload: {
          staffId: id
        },
        callback
      });
    }
  }

  render() {
    const {data, loading} = this.props;
    const {
      modalVisible,
      editVisible,
      editType,
      modalData,
      imgUrl,
      imgDetailVisible,
      showPeopleVisible,
      peopleData
    } = this.state
    const tableColumns = getAuthority()[0] === 'superAdmin'
      ? this.columns_admin
      : this.columns
    return (
      <Card>
        <div className="flex-container">
          <div className="flex-1">
            <TableSearch
              columns={this.getSerarchColumns()}
              handleSearch={this.handleSearch}
              handleFormReset={this.handleFormReset}/>
          </div>
          {getAuthority()[0] === 'superAdmin'
            ? <div>
                <Button type="primary" onClick={this.handleAddNew}>新增</Button>
              </div>
            : null
}
        </div>
        <StandardTable
          rowKey="staffId"
          columns={tableColumns}
          data={data || []}
          loading={loading}
          onChangeCombine={(params : object) => this.initData(params)}/>
        <AddNew
          modalVisible={modalVisible}
          modalData={modalData}
          onCancel={this.handleTriggerModal}
          onOk={this.handleSubmitModal}/>

        <EditQCode
          editType={editType}
          modalVisible={editVisible}
          modalData={modalData}
          onCancel={() => this.handleTriggerModal(1)}
          onOk={() => this.handleSubmitModal(1)}/>

        <ImageDetail
          imgUrl={imgUrl}
          visible={imgDetailVisible}
          onCancel={this.handleShowImgDetail}/>

        <Modal
          title="招聘人员"
          visible={showPeopleVisible}
          onOk={this.handleCancel}
          width="1000px"
          cancelText=""
          onCancel={this.handleCancel}>
          <StandardTable
            rowKey="id"
            columns={this.peopleCoumns}
            data={peopleData || []}
            loading={loading}
            onChangeCombine={(params : object) => this.initData(params)}/>
        </Modal>

      </Card>
    );
  }
}

export default connect(({staff, loading} : ConnectState) => ({data: staff.data, loading: loading.models.staff}))(Staff);
