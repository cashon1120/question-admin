import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { connect } from 'dva';
import 'antd/dist/antd.css';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '../../components/StandardTable';
import { ConnectProps, ConnectState } from '@/models/connect';
import TableSearch from '../../components/TableSearch';
import { DataList } from '../../models/userInfoAddress';

const columns = [
  {
    title: '订单编号',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '订单累计实付金额',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '销售方',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '订单支付时间',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '付款方信息',
    dataIndex: 'state',
    key: 'state',
  },
];

interface IProps extends ConnectProps {
  data?: DataList;
}

interface IState {
  loading: boolean;
  modalVisible: boolean;
  pageInfo: {
    pageSize: number;
    pageNum: number;
  };
}

class Address extends Component<IProps, IState> {
  state = {
    loading: false,
    modalVisible: false,
    pageInfo: {
      pageSize: 10,
      pageNum: 1,
    },
  };

  componentDidMount() {
    this.initData();
  }

  handleTriggerModal = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  handleSubmitModal = () => {
    this.handleTriggerModal();
  };

  // 配置搜索条件
  getSerarchColumns = () => {
    const serarchColumns = [
      {
        title: '销售方',
        dataIndex: 'categoryId',
        componentType: 'Select',
        col: 6,
      },
      {
        title: '发票类型',
        dataIndex: 'name',
        componentType: 'Select',
        col: 6,
      },
      {
        title: '抬头类型',
        dataIndex: 'title',
        componentType: 'Select',
        col: 6,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        componentType: 'RangePicker',
        col: 8,
      },
    ];
    return serarchColumns;
  };

  handleSearch() {
    this.handleTriggerModal();
  }

  handleFormReset() {
    this.handleTriggerModal();
  }

  initData(params?: object) {
    const { dispatch } = this.props;
    const { pageInfo } = this.state;
    if (dispatch) {
      dispatch({
        type: 'userInfoAddress/fetch',
        payload: {
          ...params,
          ...pageInfo,
        },
      });
    }
  }

  render() {
    const { data } = this.props;
    const { loading } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          <div>
            1. 开票金额必须大于0元。 2. 单次申请开票金额大于10万时，仅支持申请纸质发票。 3.
            不同销售方的订单不能合并开票。 4. 分批支付的订单，订单支付完成后才能申请开票。
            5.电子发票3个工作日内可开具完成；纸质发票7个工作日内可寄出。
          </div>
          <Row>
            <Col>
              <TableSearch
                columns={this.getSerarchColumns()}
                handleSearch={this.handleSearch}
                handleFormReset={this.handleFormReset}
              />
            </Col>
          </Row>
          <StandardTable
            columns={columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params: object) => this.initData(params)}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ userInfoAddress }: ConnectState) => ({ data: userInfoAddress.data }))(
  Address,
);
