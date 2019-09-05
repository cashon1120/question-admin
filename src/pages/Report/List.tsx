import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import Link from 'umi/link';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
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
    pageNum: number;
  };
}

class ReportList extends Component < IProps,
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
      pageNum: 1
    }
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '身份证号',
      dataIndex: 'sex',
      key: 'area'
    }, {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '毕业院校',
      dataIndex: 'school1',
      key: 'school1'
    }, {
      title: '专业方向',
      dataIndex: 'school2',
      key: 'school2'
    }, {
      title: '英语技能',
      dataIndex: 'school3',
      key: 'school3'
    },{
      title: '政治面貌',
      dataIndex: 'school4',
      key: 'school4'
    }, 
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score'
    }, {
      title: '操作',
      render: (record: any) => (
        <div className="table-operate">
          <Link to={`/report/detail/${record.id}`}>详情</Link>
          <a onClick={() => this.hadleCheckOut(record.id)}>初审通过</a>
          <a>取消审核</a>
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
          pageNum: params.pageNum,
          pageSize: params.pageSize
        }
      });
    }

    if (dispatch) {
      dispatch({
        type: 'report/fetch',
        payload: {
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
        dataIndex: 'status',
        componentType: 'Select',
        dataSource: [
          {
            value: 1,
            name: '是'
          }, {
            value: 0,
            name: '否'
          }
        ]
      }, {
        title: '日期',
        dataIndex: 'times',
        componentType: 'RangePicker',
        col: 8
      }
    ];
    return serarchColumns;
  };

  // 搜索
  handleSearch = (values : any) => {
    const {searchData} = this.state
    let startTime = ''
    let endTime = ''
    if (values.times) {
      startTime = moment(values.times[0]).format('YYYY-MM-DD HH:mm:ss')
      endTime = moment(values.times[1]).format('YYYY-MM-DD HH:mm:ss')
    }
    this.setState({
      searchData: {
        ...searchData,
        name: values.name,
        status: values.status,
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
      dispatch({type: 'report/exportFile', payload: {}});
    }
  }

  hadleCheckOut = (id: string) => {
    const { dispatch } = this.props
    const callback = (response: any) => {
      if(response.success){
        message.success('操作成功')
      }
    }
    confirm({
      title: '审核信息',
      content: '审核通过后，考生即可扫描二维码考试，是否通过审核？',
      onOk: () => {
        if(dispatch){
        dispatch({
          type: 'report/checkOut',
          payload: {
            id,
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
      <PageHeaderWrapper>
        <Card>
          <div className="flex-container">
            <div className="flex-1">
              <TableSearch
                columns={this.getSerarchColumns()}
                handleSearch={this.handleSearch}
                handleFormReset={this.handleFormReset}/>
            </div>
            <div>
              <Button type="primary" onClick={this.exportFiel}>导出详情</Button>
            </div>
          </div>
          <StandardTable
            showSelectRow={true}
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params : object) => this.initData(params)}
            onSelectRow={this.handleSelectRows}
            selectedRowKeys={selectedRowKeys}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({report, loading} : ConnectState) => ({data: report.data, loading: loading.models.report}))(ReportList);
