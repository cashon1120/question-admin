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
  answerTime : string
}

class SetTimer extends Component < FormProps,
IState > {
  state = {
    spinLoading: false,
    loading: false,
    answerTime: ''
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
        this.setState({answerTime: res.answerTime})
      }
    }
    const payload = {
      sysUserId: localStorage.getItem('sysUserId')
    }
    dispatch({type: 'account/getSetting', payload, callback});
  }

  handleSubmitModal() {}

  render() {
    let {loading, spinLoading, answerTime} = this.state
    const rangeConfig = {
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
        <Form {...formItemLayout} onSubmit={this.handleSubmitModal}>
          <Form.Item label="有效日期">
            {getFieldDecorator('range-picker', rangeConfig)(<RangePicker
              showTime={{
              format: 'HH:mm'
            }}
              format="YYYY-MM-DD HH:mm"
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
