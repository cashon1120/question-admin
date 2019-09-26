import React, {Component} from 'react';
import {Card, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import Link from 'umi/link';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
import {EDUCATION_ARR, MAJOR_ARR} from '../../../public/config'
import moment from 'moment';
const { confirm } = Modal;

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

class UserInfoList extends Component < IProps,
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
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (sex: number) => <span>{sex===1 ? '女': sex=== 0 ? '男' : '未知'}</span>
    },  {
      title: '出生年月',
      dataIndex: 'birth_time',
      key: 'birth_time'
    }, 
    {
      title: '预计毕业时间',
      dataIndex: 'graduation_time',
      key: 'graduation_time'
    },{
      title: '学历',
      dataIndex: 'education',
      key: 'education'
    }, {
      title: '专业名称',
      dataIndex: 'profession_name',
      key: 'profession_name',
    },{
      title: '专业分类',
      dataIndex: 'profession_category',
      key: 'profession_category',
    },{
      title: '毕业院校',
      dataIndex: 'graduated_school',
      key: 'graduated_school'
    }, {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    }, 
    {
      title: '生源地',
      dataIndex: 'address',
      key: 'address',
    },{
      title: '特长',
      dataIndex: 'specialty',
      key: 'specialty',
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },{
      title: '操作',
      width: 80,
      render: (record: any) => (
        <div className="table-operate">
          <Link to={`/userInfo/detail/${record.id}`}>详情</Link>
          {/* <a onClick={() => this.hadleCheckOut(record.id, 3)}>通过审核</a>
          <a onClick={() => this.hadleCheckOut(record.id, 2)}>不通过</a> */}
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
        type: 'userInfo/fetch',
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
      },{
        title: '电话',
        dataIndex: 'phone',
        componentType: 'Input'
      },
      ,{
        title: '专业分类',
        dataIndex: 'professionCategory',
        componentType: 'Select',
        dataSource: MAJOR_ARR
      },{
        title: '毕业院校',
        dataIndex: 'graduatedSchool',
        componentType: 'Input'
      }
    ];
    return serarchColumns;
  };

  // 搜索
  handleSearch = (values : any) => {
    const {searchData} = this.state
    let startTime: string | undefined = undefined
    let endTime: string | undefined = undefined
    if(values.times){
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
    const { selectedRowKeys } = this.state
    if(selectedRowKeys.length === 0){
      message.error('请勾选要导出的数据')
      return
    }
    if (dispatch) {
      dispatch({type: 'userInfo/exportFile', payload: {}});
    }
  }

  hadleCheckOut = (id: string, type: number) => {
    const { dispatch } = this.props
    const callback = (res: any) => {
      if(res.success){
        message.success('操作成功')
      }else{
        message.error(res.data)
      }
    }
    let info = '审核通过后，考生即可扫描二维码考试，是否通过审核'
    if(type === 2){
      info = '确定要拒绝通过吗?'
    }
    confirm({
      title: '审核信息',
      content: info,
      onOk: () => {
        if(dispatch){
        dispatch({
          type: 'userInfo/checkOut',
          payload: {
            deliveryId: id,
            state: type,
          },
          callback,
        });
      }
      },
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
                showExportButton={true}
                exportUrl='outCandidateList'
                handleFormReset={this.handleFormReset}/>
            </div>
          </div>
          <StandardTable
            // showSelectRow={true}
            rowKey="id"
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

export default connect(({userInfo, loading} : ConnectState) => ({data: userInfo.data, loading: loading.models.userInfo}))(UserInfoList);
