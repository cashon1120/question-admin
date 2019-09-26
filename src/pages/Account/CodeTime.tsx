import React, {Component} from 'react';
import {
  Button,
  Form,
  DatePicker,
  Card,
  Spin,
  message
} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import {FormComponentProps} from 'antd/es/form';
import 'antd/dist/antd.css';
import {Dispatch} from 'redux';
import {formItemLayout} from '../../../public/config';
const {RangePicker} = DatePicker;

interface FormProps extends FormComponentProps {
  submitting : boolean;
  dispatch : Dispatch;
}

interface IState {
  spinLoading : boolean;
  loading : boolean;
  setTimeArr : any[]
}

class SetTimer extends Component < FormProps,
IState > {
  state = {
    spinLoading: false,
    loading: false,
    setTimeArr: []
  };

  componentDidMount() {
    this.getSetTime()
  }

  getSetTime() {
    this.setState({spinLoading: true})
    const {dispatch} = this.props

    const callback = (res : any) => {
      this.setState({spinLoading: false})
      if (res.success) {
        this.setState({setTimeArr: res.data})
      }
    }
    const payload = {
      sysUserId: sessionStorage.getItem('sysUserId')
    }
    dispatch({type: 'account/getSetting', payload, callback});
  }

  handleSubmit = (e : React.FormEvent) => {
    const {dispatch, form} = this.props;

    const callback = (res : any) => {
      if (res.success) {
        message.success('添加成功')
      } else {
        message.error(res.msg || res.data)
      }
      this.setState({loading: false})
    }
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const startTime = moment(values.times[0]).format('YYYY-MM-DD HH:mm:ss')
        const endTime = moment(values.times[1]).format('YYYY-MM-DD HH:mm:ss')
        const payload = {
          sysUserId: sessionStorage.getItem('sysUserId'),
          startTime,
          endTime
        }
        this.setState({loading: true})
        dispatch({type: 'account/setTime', payload, callback});
      }
    });
  };

  render() {
    let {loading, spinLoading, setTimeArr} = this.state
    const dateFormat = 'YYYY-MM-DD'
    const initialValue = setTimeArr.length > 0
      ? [
        moment(setTimeArr[0].value, dateFormat),
        moment(setTimeArr[1].value, dateFormat)
      ]
      : null
    const rangeConfig = {
      initialValue,
      rules: [
        {
          type: 'array',
          required: true,
          message: '请选择时间!'
        }
      ]
    };
    const {form: {
        getFieldDecorator
      }} = this.props;
    return (
      <Card>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="有效日期">
            {getFieldDecorator('times', rangeConfig)(<RangePicker
              format="YYYY-MM-DD"
              placeholder={['二维码有效开始日期', '二维码有效结束时间']}/>)}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
              marginLeft: 20
            }}>
              提交
            </Button>
          </Form.Item>
        </Form>
        <div className={spinLoading
          ? 'spin'
          : 'spin-none'}>
          <Spin size="large"/>
        </div>
      </Card>
    );
  }
}

export default Form.create < FormProps > ()(connect(() => ({}))(SetTimer));
