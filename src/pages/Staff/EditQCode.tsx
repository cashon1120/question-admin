import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import {ConnectState} from '../../models/connect';
import ModalFrom from '@/components/ModalForm';
import {message} from 'antd';
import moment from 'moment';
import {getAuthority} from '../../utils/authority';

interface IProps {
  modalVisible : boolean;
  companyData : any[];
  editType : number;
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
          sysUserId: sessionStorage.getItem('sysUserId')
        },
        callback
      });
    }
  }

  setImgUrl = () => {
    const {onOk, dispatch, editType, modalData: {
        staffId
      }} = this.props;
    const callback = (res : any) => {
      if (res.success) {
        onOk(res)
      } else {
        message.error(res.data)
      }
      this.setState({confirmLoading: false});
    }
    const type = editType === 1
      ? 'staff/setImg'
      : 'company/setImg'
    dispatch({type, payload: {
        staffId
      }, callback});
  }

  handleSubmitModal = (fields : any) => {
    const {dispatch, editType, modalData, modalData: {
        staffId
      }} = this.props;
    this.setState({confirmLoading: true});

    const callback = (res : any) => {
      if (res.success) {
        this.setImgUrl()
      } else {
        message.error(res.data)
      }
    };
    const startTime = moment(fields.time[0]).format('YYYY-MM-DD')
    const endTime = moment(fields.time[1]).format('YYYY-MM-DD')
    delete fields.time

    const type = 'staff/update'
    const params = {
      staffId,
      name: modalData.name,
      phone: modalData.phone,
      ksAddress: modalData.ks_address,
      address: modalData.address,
      zpStartTime: modalData.zp_start_time,
      zpEndTime: modalData.zp_end_time,
      ksStartTime: modalData.ks_start_time,
      ksEndTime: modalData.ks_end_time,
      ...fields
    }
    const payload = editType === 1
      ? {
        ...params,
        zpStartTime: startTime,
        zpEndTime: endTime
      }
      : {
        ...params,
        ksStartTime: startTime,
        ksEndTime: endTime
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
      editType,
      modalData: {
        address,
        ks_address,
        zp_start_time,
        zp_end_time,
        ks_start_time,
        ks_end_time
      }
    } = this.props;

    const todayDate = new Date();
    todayDate.setTime(todayDate.getTime())
    const today = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();

    const tomorrowDate = new Date();
    tomorrowDate.setTime(tomorrowDate.getTime() + 24 * 60 * 60 * 1000);
    const tomorrow = tomorrowDate.getFullYear() + "-" + (tomorrowDate.getMonth() + 1) + "-" + tomorrowDate.getDate();

    const formItem = editType === 1
      ? [
        {
          title: '会场',
          dataIndex: 'address',
          componentType: 'Input',
          initialValue: address,
          requiredMessage: '请输入会场',
          required: true,
          placeholder: '请输入会场'
        }, {
          title: '招聘时间',
          dataIndex: 'time',
          componentType: 'RangePicker',
          initialValue: [
            moment(zp_start_time || today, 'YYYY-MM-DD'),
            moment(zp_end_time || tomorrow, 'YYYY-MM-DD')
          ],
          requiredMessage: '请输入招聘时间',
          required: true,
          placeholder: '请输入招聘时间'
        }
      ]
      : [
        {
          title: '考试地址',
          dataIndex: 'ksAddress',
          componentType: 'Input',
          initialValue: ks_address,
          requiredMessage: '请输入考试地址',
          required: true,
          placeholder: '请输入考试地址'
        }, {
          title: '考试时间',
          dataIndex: 'time',
          componentType: 'RangePicker',
          initialValue: [
            moment(ks_start_time || today, 'YYYY/MM/DD'),
            moment(ks_end_time || tomorrow, 'YYYY-MM-DD')
          ],
          requiredMessage: '请输入考试时间',
          required: true,
          placeholder: '请输入考试时间'
        }
      ];

    return formItem
  }

  render() {
    const {confirmLoading} = this.state;
    const {modalVisible, editType, onCancel} = this.props;
    return (
      <Fragment>
        <ModalFrom
          title={editType === 1
          ? '招聘二维码'
          : '考试二维码'}
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
