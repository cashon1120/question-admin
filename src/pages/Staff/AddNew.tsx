import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import {message} from 'antd';
import {getAuthority} from '../../utils/authority';

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
  companyData : any[],
  allCompanyData : any[]
}

class AddCompany extends Component < IProps,
IState > {
  state = {
    confirmLoading: false,
    companyData: [],
    allCompanyData: []
  };

  componentDidMount() {
    if (getAuthority()[0] === 'superAdmin') {
      const {dispatch} = this.props
      const callback = (res : any) => {
        let companyData : any[] = []
        res
          .data
          .forEach((item : any) => {
            companyData.push({value: item.company_name, id: item.id})
          })
        this.setState({
          companyData,
          allCompanyData: JSON.parse(JSON.stringify(companyData))
        })
      }
      dispatch({
        type: 'staff/fetchCompany',
        payload: {
          sysUserId: localStorage.getItem('sysUserId')
        },
        callback
      });
    }
  }

  handleSubmitModal = (fields : any) => {
    const {onOk, dispatch, modalData: {
        staffId
      }} = this.props;
    this.setState({confirmLoading: true});
    // 定义异步回调
    const callback = (res : any) => {
      if (res.success) {
        message.success('操作成功')
        onOk(fields)
      } else {
        message.error(res.data)
      }
      this.setState({confirmLoading: false});

    };
    const type = staffId
      ? 'staff/update'
      : 'staff/add'
    const payload = staffId
      ? {
        staffId,
        ...fields,
      }
      : {
        sysUserId: localStorage.getItem('sysUserId'),
        ...fields,
      }
    dispatch({type, payload, callback});
  };

  handleSearch = (value : any) => {
    const {allCompanyData} = this.state
    let companyData = allCompanyData.filter((item : any) => {
      // console.log(item.value.includes(value))
      return item
        .value
        .includes(value)
    })
    this.setState({companyData})
  }

  modalFromColumns() {
    const {
      modalData: {
        name,
        phone,
        sys_user_id,
        staffId
      }
    } = this.props;

    const {companyData} = this.state
    const sysUserId = localStorage.getItem('sysUserId')


    let companySelect : any = {}
    if (sysUserId === '1' && !staffId) {
      companySelect = {
        title: '所属公司',
        dataIndex: 'addUserId',
        componentType: 'SelectSearch',
        initialValue: sys_user_id,
        dataSource: companyData,
        requiredMessage: '请选择所属公司',
        required: true,
        placeholder: '请选择所属公司',
        handleSearch: this.handleSearch
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
