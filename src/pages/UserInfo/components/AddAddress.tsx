import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import ModalFrom from '@/components/ModalForm';

interface IProps {
  modalVisible: boolean;
  dispatch: Dispatch;
  modalData: {
    name: string;
    phone: string;
    area: string[];
    address: string;
  };
  onCancel: () => void;
  onOk: (fields: object | undefined) => void;
}

interface IState {
  confirmLoading: boolean;
}

class AddAddress extends Component<IProps, IState> {
  state = {
    confirmLoading: false,
  };

  handleSubmitModal = (fields: object | undefined) => {
    const { onOk, dispatch } = this.props;
    this.setState({ confirmLoading: true });

    // 定义异步回调
    const callback = () => {
      setTimeout(() => {
        this.setState({ confirmLoading: false });
        onOk(fields);
      }, 1000);
    };

    dispatch({
      type: 'userInfoAddress/add',
      payload: {
        ...fields,
      },
      callback,
    });
  };

  modalFromColumns() {
    const {
      modalData: { name, phone, area, address },
    } = this.props;
    return [
      {
        title: '收件人',
        dataIndex: 'name',
        componentType: 'Input',
        initialValue: name,
        requiredMessage: '请输入收件人',
        required: true,
        placeholder: '请输入收件人',
      },
      {
        title: '手机号码',
        dataIndex: 'phone',
        componentType: 'Input',
        initialValue: phone,
        requiredMessage: '请输入手机号码',
        required: true,
        placeholder: '请输入分类名称拼音首字母',
      },
      {
        title: '所在地区',
        dataIndex: 'area',
        componentType: 'AreaCascader',
        initialValue: area,
        requiredMessage: '请输入手机号码',
        required: true,
        placeholder: '请输入分类名称拼音首字母',
      },
      {
        title: '详细地址',
        dataIndex: 'address',
        componentType: 'TextArea',
        initialValue: address,
        requiredMessage: '请输入手机号码',
        required: true,
        placeholder: '请输入分类名称拼音首字母',
      },
      {
        title: '设为默认地址',
        dataIndex: 'isDefault',
        componentType: 'Radio',
        initialValue: true,
        dataSource: [
          {
            value: 1,
            name: '是',
          },
          {
            value: 0,
            name: '否',
          },
        ],
      },
    ];
  }

  render() {
    const { confirmLoading } = this.state;
    const { modalVisible, onCancel } = this.props;
    return (
      <Fragment>
        <ModalFrom
          title="新增地址"
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={onCancel}
        />
      </Fragment>
    );
  }
}

export default connect(({ userInfoAddress }: ConnectState) => ({ userInfoAddress }))(AddAddress);
