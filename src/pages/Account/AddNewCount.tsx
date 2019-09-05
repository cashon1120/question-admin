import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '../../models/connect';
import ModalFrom from '@/components/ModalForm';

interface IProps {
  modalVisible: boolean;
  dispatch: Dispatch;
  modalData: {
    [key: string]: any
  };
  onCancel: () => void;
  onOk: (fields: object | undefined) => void;
}

interface IState {
  confirmLoading: boolean;
}

class AddAccount extends Component<IProps, IState> {
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
      type: 'account/add',
      payload: {
        ...fields,
      },
      callback,
    });
  };

  modalFromColumns() {
    const {
      modalData: { name, phone, company },
    } = this.props;
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        componentType: 'Input',
        initialValue: name,
        requiredMessage: '请输入姓名',
        required: true,
        placeholder: '请输入姓名',
      },
      {
        title: '账号',
        dataIndex: 'account',
        componentType: 'Input',
        initialValue: phone,
        requiredMessage: '请输入手机号',
        required: true,
        placeholder: '请输入手机号',
      },
      {
        title: '所在公司',
        dataIndex: 'address',
        componentType: 'Select',
        initialValue: company,
        requiredMessage: '请选择公司',
        required: true,
        dataSource: [{value:1, name:'公司一'}],
        placeholder: '请输入分类名称拼音首字母',
      }
    ];
  }

  render() {
    const { confirmLoading } = this.state;
    const { modalVisible, onCancel, modalData:{id} } = this.props;
    return (
      <Fragment>
        <ModalFrom
          title={id ? '修改账号' : '新增账号'}
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

export default connect(({}: ConnectState) => ({}))(AddAccount);
