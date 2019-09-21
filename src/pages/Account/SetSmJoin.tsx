import React, {Component} from 'react';
import {Form, Card, Spin, Switch} from 'antd';
import {connect} from 'dva';
import {FormComponentProps} from 'antd/es/form';
import 'antd/dist/antd.css';
import {Dispatch} from 'redux';

const FormItem = Form.Item;

interface FormProps extends FormComponentProps {
  submitting : boolean;
  dispatch : Dispatch;
}

interface IState {
  spinLoading : boolean;
  loading : boolean;
  defaultChecked : string
}

class SetTimer extends Component < FormProps,
IState > {
  state = {
    spinLoading: false,
    loading: false,
    defaultChecked: '0'
  };

  componentDidMount() {
    this.getSmJoin()
  }

  getSmJoin() {
    this.setState({spinLoading: true})
    const {dispatch} = this.props
    const callback = (res : any) => {
      this.setState({spinLoading: false})
      if (res.success) {
        this.setState({defaultChecked: res.data.value})
      }
    }
    dispatch({type: 'account/getSmJoin', callback});
  }

  onChange = (e : boolean) => {
    const {dispatch} = this.props;
    const {defaultChecked} = this.state
    this.setState({spinLoading: true})
    let newState = defaultChecked === '1'
      ? '0'
      : '1'
    const callback = (res : any) => {
      if (res.success) {
        this.setState({defaultChecked: newState})
      }
      this.setState({spinLoading: false})
    }
    const payload = {
      isSmJoin: newState
    }
    dispatch({type: 'account/setSmJoin', payload, callback});
  };

  render() {
    let {spinLoading, defaultChecked} = this.state

    const checked = defaultChecked === '1'
      ? true
      : false
    console.log(checked)
    return (
      <Card>
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          loading={spinLoading}
          onChange={(e) => this.onChange(e)}
          checked={checked}/>
      </Card>
    );
  }
}

export default Form.create < FormProps > ()(connect(() => ({}))(SetTimer));
