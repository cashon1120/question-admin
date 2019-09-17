import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import { message } from 'antd';

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

class AddCompany extends Component<IProps, IState> {
  state = {
    confirmLoading: false,
  };

  handleSubmitModal = (fields: object | undefined) => {
    const { onOk, dispatch,modalData: {id} } = this.props;
    this.setState({ confirmLoading: true });

    // 定义异步回调
    const callback = (res: any) => {
      if(res.success){
        message.success('操作成功')
      }else{
        message.error(res.data)
      }
      this.setState({ confirmLoading: false });
      onOk(fields)
    };
    const type = id ? 'company/update' : 'company/add'
    const payload = id ? {
      sysUserId: localStorage.getItem('sysUserId'),
      selectedUserId: id,
      ...fields,
    } : {
      sysUserId: localStorage.getItem('sysUserId'),
      ...fields,
    }
    dispatch({
      type,
      payload,
      callback,
    });
  };

  modalFromColumns() {
    const {
      modalData: { company_name },
    } = this.props;
    return [
      {
        title: '公司名称',
        dataIndex: 'companyName',
        componentType: 'Input',
        initialValue: company_name,
        requiredMessage: '请输入公司名称',
        required: true,
        placeholder: '请输入公司名称',
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

export default connect(({}: ConnectState) => ({}))(AddCompany);
