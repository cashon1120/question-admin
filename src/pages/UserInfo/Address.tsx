import React, { Component } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'dva';
import 'antd/dist/antd.css';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import AddAddress from './components/AddAddress';
import { ConnectProps, ConnectState } from '@/models/connect';
import { DataList } from '@/models/userInfoAddress';

const columns = [
  {
    title: '收货人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '所在地区',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '详细地址',
    render: () => <div>删除</div>,
  },
];

interface IProps extends ConnectProps {
  data?: DataList;
}

interface IState {
  loading: boolean;
  modalVisible: boolean;
  modalData: {
    name: string;
    phone: string;
    area: string[];
    address: string;
  };
  pageInfo: {
    pageSize: number;
    pageNum: number;
  };
}

class Address extends Component<IProps, IState> {
  state = {
    loading: false,
    modalVisible: false,
    modalData: {
      name: '',
      phone: '',
      area: [],
      address: '',
    },
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

  handleSelectRows() {
    this.setState({
      modalVisible: true,
    });
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
    const { loading, modalVisible, modalData } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          <div className="text-align-right">
            <Button type="primary" onClick={this.handleTriggerModal}>
              新建地址
            </Button>
          </div>
          <StandardTable
            columns={columns}
            data={data || []}
            loading={loading}
            onChangeCombine={(params: object) => this.initData(params)}
            onSelectRow={this.handleSelectRows}
          />
        </Card>
        <AddAddress
          modalVisible={modalVisible}
          modalData={modalData}
          onCancel={this.handleTriggerModal}
          onOk={this.handleSubmitModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ userInfoAddress }: ConnectState) => ({ data: userInfoAddress.data }))(
  Address,
);
