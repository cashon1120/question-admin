import React, {Component} from 'react';
import {Card, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';

import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import ModalFrom from '@/components/ModalForm';
import {ConnectProps, ConnectState} from '@/models/connect';
import {EDUCATION_ARR, MAJOR_ARR} from '../../../public/config'
import moment from 'moment';

const {confirm} = Modal;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  confirmLoading : boolean;
  selectedRowKeys : any[];
  reCheckOutId : string,
  searchData : {
    [key : string]: any
  };
  reCheckOutVisible : boolean,
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
    reCheckOutVisible: false,
    confirmLoading: false,
    reCheckOutId: '',
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
    }, {
      title: '招聘会场',
      dataIndex: 'address',
      key: 'address'
    }, {
      title: '会场时间',
      dataIndex: 'publish_time',
      key: 'publish_time'
    }, 
    {
      title: '投递公司',
      dataIndex: 'company_name',
      key: 'company_name',
    },{
      title: '审核状态',
      width: 100,
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
            str = '校园直招'
            break;
          case 4:
            str = '意向性招聘'
            break;
          case 5:
            str = '推荐国网考试'
            break;
          case 10:
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
      render: (record : any) => {
        let compnent: any = ''
        if (record.is_delivery === 1) {
          compnent = 
            <div className="table-operate">
              <a onClick={() => this.hadleCheckOut(record.delivery_id, 3)}>通过初审</a>
              <a onClick={() => this.hadleCheckOut(record.delivery_id, 2)}>不通过</a>
            </div>
        }
        if (record.is_delivery === 10) {
          compnent = 
            <div className="table-operate">
              <a onClick={() => this.hadleReCheckOut(record.delivery_id)}>复审</a>
            </div>
        }
        return compnent
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
          sysUserId: sessionStorage.getItem('sysUserId'),
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
        title: '学历',
        dataIndex: 'education',
        componentType: 'Select',
        dataSource: EDUCATION_ARR
      }, {
        title: '电话',
        dataIndex: 'phone',
        componentType: 'Input'
      }, {
        title: '专业分类',
        dataIndex: 'professionCategory',
        componentType: 'Select',
        dataSource: MAJOR_ARR
      }, {
        title: '毕业院校',
        dataIndex: 'graduatedSchool',
        componentType: 'Input'
      }, {
        title: '招聘会场',
        dataIndex: 'address ',
        componentType: 'Input'
      }, {
        title: '时间',
        dataIndex: 'times',
        componentType: 'RangePicker'
      },{
        title: '审核状态',
        dataIndex: 'isDelivery',
        componentType: 'Select',
        dataSource: [
          {
            id: 1,
            value: '待初审'
          }, {
            id: 2,
            value: '初审未通过'
          }, {
            value: '校园直招',
            id: 3
          }, {
            value: '意向性招聘',
            id: 4
          }, {
            value: '推荐国网考试',
            id: 5
          }
        ]
      }
    ];
    return serarchColumns;
  };

  // 搜索
  handleSearch = (values : any) => {
    const {searchData} = this.state
    let startTime : string | undefined = undefined
    let endTime : string | undefined = undefined
    if (values.times) {
      startTime = moment(values.times[0]).format('YYYY-MM-DD')
      endTime = moment(values.times[1]).format('YYYY-MM-DD')
    }
    delete values.times
    this.setState({
      searchData: {
        ...searchData,
        ...values,
        startTime,
        endTime
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
    } else {
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

  }

  hadleReCheckOut = (id : string) => {
    this.setState({reCheckOutId: id})
    this.handleTriggerModal()
  }

  modalFromColumns = () => {
    return [
      {
        title: '审核类型',
        dataIndex: 'state',
        componentType: 'Select',
        requiredMessage: '请选择审核类型',
        required: true,
        dataSource: [
          {
            value: '校园直招',
            id: 3
          }, {
            value: '意向性招聘',
            id: 4
          }, {
            value: '推荐国网考试',
            id: 5
          }
        ],
        placeholder: '请选择审核类型'
      }
    ];
  }

  handleSubmitModal = (fields : any) => {
    const {dispatch} = this.props;
    const {reCheckOutId} = this.state
    this.setState({confirmLoading: true});
    // 定义异步回调
    const callback = (res : any) => {
      if (res.success) {
        message.success('操作成功')
      } else {
        message.error(res.data)
      }
      this.handleTriggerModal()
      this.initData()
      this.setState({confirmLoading: false});
    };
    const payload = {
      deliveryId: reCheckOutId,
      state: fields.state
    }

    if (dispatch) {
      dispatch({type: 'userDelivery/reCheckOut', payload, callback});
    }
  }

  render() {
    const {data, loading} = this.props;
    const {selectedRowKeys, modalVisible, confirmLoading} = this.state;
    return (
      <Card>
        <div className="flex-container">
          <div className="flex-1">
            <TableSearch
              columns={this.getSerarchColumns()}
              handleSearch={this.handleSearch}
              showExportButton={true}
              exportUrl='outDeliveryList'
              handleFormReset={this.handleFormReset}/>
          </div>
        </div>
        <StandardTable
          rowKey="delivery_id"
          columns={this.columns}
          data={data || []}
          loading={loading}
          onChangeCombine={(params : object) => this.initData(params)}
          onSelectRow={this.handleSelectRows}
          selectedRowKeys={selectedRowKeys}/>
        <ModalFrom
          title='复审'
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={this.handleTriggerModal}/>
      </Card>
    );
  }
}

export default connect(({userDelivery, loading} : ConnectState) => ({data: userDelivery.data, loading: loading.models.userDelivery}))(UserDeliverList);