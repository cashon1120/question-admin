import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import Link from 'umi/link';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
import {API_URL} from '../../../public/config'
const {confirm} = Modal;

interface IProps extends ConnectProps {
  data?: any;
  loading?: boolean
}

interface IState {
  uploadLoading : boolean;
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
    uploadLoading: false,
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
      title: '题型',
      dataIndex: 'is_multiple_selection',
      key: 'is_multiple_selection',
      render: (is_multiple_selection : any) => {
        let str = ''
        switch (is_multiple_selection) {
          case 1:
            str = '多选题'
            break;
          case 2:
            str = '单选题'
            break;
          default:
            str = '判断题'
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
          ...searchParams
        }
      });
    }
  }

  // 配置搜索条件
  getSerarchColumns = () => {
    const serarchColumns = [
      {
        title: '题目',
        dataIndex: 'topic',
        componentType: 'Input'
      }, {
        title: '题目',
        dataIndex: 'type',
        componentType: 'Select',
        dataSource: [
          {
            id: 1,
            value: '行测题'
          }, {
            id: 2,
            value: '职业道德题'
          }, {
            id: 3,
            value: '电力安全常识题'
          }
        ]
      }, {
        title: '题目',
        dataIndex: 'isMultipleSelection',
        componentType: 'Select',
        dataSource: [
          {
            id: 1,
            value: '多选'
          }, {
            id: 2,
            value: '单选'
          }, {
            id: 3,
            value: '判断'
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
    const file = files[0]
    const temp = file
      .name
      .split('.')

    const fileType = temp[temp.length - 1]
    if (!accept.includes(fileType)) {
      message.error(`请选择正确的文件格式${accept}`)
      return
    }
    this.setState({uploadLoading: true})
    const that = this
    const callback = (evt : any) => {
      this.setState({uploadLoading: false})
      var res = JSON.parse(evt.target.responseText);
      if (res.flag === '1') {
        message.success('导入成功')
        this.initData()
      } else {
        message.error(res.flag)
      }
    }
    const formFile = new FormData()
    let xhr = null
    formFile.append("file", file)
    xhr = new XMLHttpRequest()
    xhr.onload = callback
    xhr.onerror = function () {
      that.setState({uploadLoading: false})
    }
    xhr.open("post", API_URL + '/app/inport/exportInExcel', true);
    xhr.send(formFile)
  }

  render() {
    const {data, loading} = this.props;
    const {uploadLoading} = this.state
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
              <Button loading={uploadLoading} type="primary">导入题库</Button>
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
