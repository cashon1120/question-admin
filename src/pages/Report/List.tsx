import React, {Component} from 'react';
import {Card, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import Link from 'umi/link';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearch from '../../components/TableSearch';
import {ConnectProps, ConnectState} from '@/models/connect';
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
      pageNumber: 1
    }
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '投递公司',
      dataIndex: 'company_name',
      key: 'company_name'
    }, {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time'
    },, {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time'
    }, {
      title: '得分',
      dataIndex: 'score',
      key: 'score'
    }, {
      title: '状态',
      render: (record : any) => {
        let str = ''
        switch (record.state) {
          case 1:
            str = '答题中'
            break;
          case 2:
            str = '答题完成'
            break;
          case 3:
            str = '答题失效'
            break;
          default:
            str = '二维码失效'
            break;
        }
        return str
      }
    }, {
      title: '操作',
      render: (record : any) => (
        <div className="table-operate">
          <Link to={`/report/detail/${record.id}`}>详情</Link>
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
        type: 'report/fetch',
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
        title: '姓名',
        dataIndex: 'name',
        componentType: 'Input'
      }, {
        title: '状态',
        dataIndex: 'state',
        componentType: 'Select',
        dataSource: [
          {
            id: 1,
            value: '答题中'
          }, {
            id: 2,
            value: '答题完成'
          }, {
            id: 3,
            value: '答题失效'
          }, {
            id: 4,
            value: '二维码失效'
          }
        ]
      }, {
        title: '分数',
        dataIndex: 'score',
        componentType: 'NumberRange',
        col: 8
      }
    ];
    return serarchColumns;
  };

  // 搜索
  handleSearch = (values : any) => {
    const {searchData} = this.state
    let score : any = null
    if (values.score) {
      score = `${values.score.start}a${values.score.end}`
    }
    this.setState({
      searchData: {
        ...searchData,
        name: values.name,
        state: values.state,
        score
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
      dispatch({type: 'report/exportFile', payload: {}});
    }
  }

  hadleCheckOut = (id : string) => {
    const {dispatch} = this.props
    const callback = (response : any) => {
      if (response.success) {
        message.success('操作成功')
      }
    }
    confirm({
      title: '审核信息',
      content: '审核通过后，考生即可扫描二维码考试，是否通过审核？',
      onOk: () => {
        if (dispatch) {
          dispatch({type: 'report/checkOut', payload: {
              id
            }, callback});
        }
      }
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
