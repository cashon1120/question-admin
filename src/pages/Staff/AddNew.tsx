import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import {message} from 'antd';

interface IProps {
  modalVisible : boolean;
  companyData : any[];
  dispatch : Dispatch;
  modalData : {
    [key : string]: any
  };
  onCancel : () => void;
  onOk : (fields : object | undefined) => void;
}

interface IState {
  confirmLoading : boolean;
}

class AddCompany extends Component < IProps,
IState > {
  state = {
    confirmLoading: false
  };

  componentDidMount() {
    const {companyData, dispatch} = this.props
    if (companyData.length === 0) {
      dispatch({
        type: 'staff/fetchCompany',
        payload: {
          sysUserId: localStorage.getItem('sysUserId')
        }
      });
    }
  }

  handleSubmitModal = (fields : object | undefined) => {
    const {onOk, dispatch, modalData: {
        staffId
      }} = this.props;
    this.setState({confirmLoading: true});
    // 定义异步回调
    const callback = (res : any) => {
      if (res.success) {
        message.success('操作成功')
      } else {
        message.error(res.data)
      }
      this.setState({confirmLoading: false});
      onOk(fields)
    };

    const type = staffId
      ? 'staff/update'
      : 'staff/add'
    const payload = staffId
      ? {
        staffId,
        ...fields
      }
      : {
        sysUserId: localStorage.getItem('sysUserId'),
        ...fields
      }
    dispatch({type, payload, callback});
  };

  modalFromColumns() {
    const {
      companyData,
      modalData: {
        name,
        phone,
        sys_user_id,
        staffId
      }
    } = this.props;
    let dataSource : any[] = []
    if (companyData) {
      companyData.forEach((item : any) => {
        dataSource.push({value: item.company_name, id: item.id})
      })
    }

    const sysUserId = localStorage.getItem('sysUserId')
    let companySelect : any = {}
    if (sysUserId === '1' && !staffId) {
      companySelect = {
        title: '所属公司',
        dataIndex: 'addUserId',
        componentType: 'Select',
        initialValue: sys_user_id,
        dataSource,
        requiredMessage: '请选择所属公司',
        required: true,
        placeholder: '请选择所属公司'
      }
    } else {
      companySelect = null
    }
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        componentType: 'Input',
        initialValue: name,
        requiredMessage: '请输入姓名',
        required: true,
        placeholder: '请输入姓名'
      }, {
        title: '联系电话',
        dataIndex: 'phone',
        componentType: 'Input',
        initialValue: phone,
        requiredMessage: '请输入联系电话',
        required: true,
        placeholder: '请输入联系电话'
      },
      companySelect
    ];
  }

  render() {
    const {confirmLoading} = this.state;
    const {modalVisible, onCancel, modalData: {
        id
      }} = this.props;
    return (
      <Fragment>
        <ModalFrom
          title={id
          ? '修改账号'
          : '新增账号'}
          columns={this.modalFromColumns()}
          onOk={this.handleSubmitModal}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={onCancel}/>
      </Fragment>
    );
  }
}

export default connect(({staff} : ConnectState) => ({companyData: staff.companyData}))(AddCompany);
