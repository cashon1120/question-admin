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

class QuestionList extends Component < IProps,
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
      title: '题目',
      dataIndex: 'name',
      key: 'name'
    },  {
      title: '创建日期',
      dataIndex: 'status',
      key: 'status'
    }, {
      title: '操作',
      width: 200,
      render: (record: any) => (
        <div className="table-operate">
          <Link to={`/question/add/${record.id}`}>详情</Link>
          <a onClick={() => this.hadleCheckOut(record.id)}>修改</a>
          <a onClick={() => this.hadleCheckOut(record.id)}>删除</a>
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
        type: 'question/fetch',
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
        title: '题目',
        dataIndex: 'title',
        componentType: 'Input'
      }, {
        title: '创建日期',
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
      dispatch({type: 'userInfo/exportFile', payload: {}});
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
          type: 'userInfo/checkOut',
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
              <Link to='/question/add'><Button type="primary">新增题库</Button></Link>
            </div>
          </div>
          <StandardTable
            rowKey="id"
            columns={this.columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params : object) => this.initData(params)}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({question, loading} : ConnectState) => ({data: question.data, loading: loading.models.userInfo}))(QuestionList);
