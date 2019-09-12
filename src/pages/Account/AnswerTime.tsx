import React, {Component} from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Spin,
  message
} from 'antd';
import {connect} from 'dva';
import {FormComponentProps} from 'antd/es/form';
import 'antd/dist/antd.css';
import {Dispatch} from 'redux';
import {formItemLayout} from '../../../public/config';

const FormItem = Form.Item;

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
    this.getAnswerTime()
  }

  getAnswerTime() {
    this.setState({spinLoading: true})
    const {dispatch} = this.props
    const callback = (res : any) => {
      console.log(res)
      this.setState({spinLoading: false})
      if (res.success) {
        this.setState({answerTime: res.data[0].value})
      }
    }
    const payload = {
      sysUserId: localStorage.getItem('sysUserId')
    }
    dispatch({type: 'account/getAnswerTime', payload, callback});
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
        const payload = {
          sysUserId: localStorage.getItem('sysUserId'),
          answerTime: values.answerTime
        }
        this.setState({loading: true})
        dispatch({type: 'account/setAnswerTime', payload, callback});
      }
    });
  };

  render() {
    let {loading, spinLoading, answerTime} = this.state
    const {form: {
        getFieldDecorator
      }} = this.props;
    return (
      <Card>
        <Form
          {...formItemLayout}
          onSubmit={this.handleSubmit}
          style={{
          marginTop: 20
        }}>
          <FormItem label="答题时长">
            <Row gutter={24}>
              <Col span={24}>
                {getFieldDecorator('answerTime', {
                  initialValue: answerTime,
                  rules: [
                    {
                      required: true,
                      message: '请选择题目分类'
                    }
                  ]
                })(<Input style={{
                  width: 200
                }}/>)}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                  marginLeft: 20
                }}>
                  提交
                </Button>
              </Col>
            </Row>
          </FormItem>

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
