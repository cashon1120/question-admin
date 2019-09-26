import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import Link from 'umi/link';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
import moment from 'moment';
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
      pageNumber: 1
    }
  };

  columns = [
    {
      title: '题目',
      dataIndex: 'topic',
      key: 'topic'
    }, {
      title: '问题',
      dataIndex: 'questions',
      key: 'questions'
    }, {
      title: '题目难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty : any) => {
        let str = ''
        switch (difficulty) {
          case 1:
            str = '难'
            break;
          case 2:
            str = '中'
            break;
          default:
            str = '易'
            break;
        }
        return str
      }
    }, {
      title: '操作',
      width: 200,
      render: (record : any) => (
        <div className="table-operate">
          <Link to={`/question/detail/${record.id}`}>详情</Link>
          <a onClick={() => this.handleDel(record.id)}>删除</a>
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
    this.setState({loading: true})
    const callback = () => {
      this.setState({loading: false})
    }
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
        type: 'question/fetch',
        payload: {
          sysUserId: sessionStorage.getItem('sysUserId'),
          ...pageInfo,
          ...params
        },
        callback
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
    const {selectedRowKeys} = this.state
    if (selectedRowKeys.length === 0) {
      message.error('请勾选要导出的数据')
      return
    }
    if (dispatch) {
      dispatch({type: 'userInfo/exportFile', payload: {}});
    }
  }

  handleDel = (id : string) => {
    const {dispatch} = this.props
    const callback = (response : any) => {
      if (response.success) {
        message.success('操作成功')
        this.initData()
      }
    }
    confirm({
      title: '删除题目',
      content: '确定要删除该题目吗?',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'question/del',
            payload: {
              sysUserId: sessionStorage.getItem('sysUserId'),
              questionId: id
            },
            callback
          });
        }
      }
    });
  }
  uploadIfle() {
    if (this.refs.fileInput) {
      this
        .refs
        .fileInput
        .click()
    }
  }

  handleChange(e : any) {
    const {files} = e.target
    if (files.length <= 0) 
      return
    let accept = '.xls, .xlsx, .xlsm'
    const {dispatch} = this.props
    const file = files[0]
    const temp = file
      .name
      .split('.')

    const fileType = temp[temp.length - 1]
    if (!accept.includes(fileType)) {
      message.error(`请选择正确的文件格式${accept}`)
      return
    }
    const callback = (res : any) => {
      if (res.success) {
        message.success('导入成功')
      } else {
        message.error('导入失败')
      }
    }
    const formFile = new FormData();
    formFile.append('file', file);

    if (dispatch) {
      dispatch({type: 'question/importExcel', payload: formFile, callback});
    }
  }

  render() {
    const {data, loading} = this.props;
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
            <a onClick={() => this.uploadIfle()}>
              <input
                accept=".xls, .xlsx, .xlsm"
                onChange={(e) => this.handleChange(e)}
                ref="fileInput"
                style={{
                display: 'none'
              }}
                type="file"/>
              <Button type="primary">导入题库</Button>
            </a>
          </div>
        </div>
        <StandardTable
          rowKey="id"
          columns={this.columns}
          data={data || []}
          loading={loading}
          onChangeCombine={(params : object) => this.initData(params)}/>
      </Card>
    );
  }
}

export default connect(({question, loading} : ConnectState) => ({data: question.data, loading: loading.models.question}))(QuestionList);
