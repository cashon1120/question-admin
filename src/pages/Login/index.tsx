import React, {Component} from 'react';
import {setAuthority} from '../../utils/authority';
import {
  Form,
  Icon,
  Input,
  Button,
  Row,
  Col,
  message
} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import {Dispatch} from 'redux';
import {connect} from 'dva';
import {reloadAuthorized} from '../../utils/Authorized'
import {routerRedux} from 'dva/router';
import {checkPhone} from '../../utils/utils'

import styles from './style.less';


interface FormProps extends FormComponentProps {
  submitting : boolean;
  dispatch : Dispatch;
}

class Login extends Component < FormProps, {} > {
  state = {
    loading: false,
    getCodeText: '发送验证码',
    timeLeft: 60,
    disabled: false
  };

  handleSubmit = (e : React.FormEvent) => {
    const {dispatch, form} = this.props;
    const callback = (res : any) => {
      if (res.success && res.data) {
        if (res.data.isSuper === 1) {
          setAuthority('superAdmin');
        } else {
          setAuthority('sysUser');
        }
        reloadAuthorized();
        localStorage.setItem('sysUserId', res.data.sysUserId)
        localStorage.setItem('userName', res.data.companyName)
        dispatch(routerRedux.push({pathname: '/'}));

      } else {
        message.error(res.data);
      }
      this.setState({loading: false});
    };
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true});
        dispatch({type: 'login/submitForm', payload: values, callback});
      }
    });
  };

  getCode = () => {
    const {dispatch, form} = this.props
    const checkback = (result : any) => {
      if (result && result.phone) {
        return
      }
      const phone = form
        .getFieldsValue(['phone'])
        .phone
      this.setState({disabled: true})
      this.setLeftTime()
      dispatch({type: 'login/getCode', payload: {
          phone
        }});
    }
    form.validateFields(['phone'], checkback)
  }

  // 倒计时计时器
  setLeftTime() {
    let {
      timeLeft
    } = this.state
    let timer = setInterval(() => {
      timeLeft--
      // 格式化剩余时间
      this.setState({
        getCodeText: `${timeLeft}s重新发送`
      })
      if (timeLeft === 0) {
        clearInterval(timer)
        this.setState({
          timeLeft: 60,
          disabled: false,
          getCodeText: '发送验证码'
        })
      }
    }, 1000);
  }

  render() {
    const {form: {
        getFieldDecorator
      }} = this.props;
    const {loading, getCodeText, disabled} = this.state;
    return (
      <div className={styles.main}>
        <h2>用户登录</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('phone', {
              rules: [
                {
                  validator: checkPhone,
                  required: true,
                  message: '手机号码有误!'
                }
              ]
            })(
              <Input prefix={< Icon type = "user" />} placeholder="手机号"/>
            )}
          </Form.Item>
          <Form.Item>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('verificationCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码!'
                    }
                  ]
                })(
                  <Input
                  prefix={< Icon type = "lock" style = {{ color: 'rgba(0,0,0,.25)' }}/>}
                  type="text"
                  placeholder="手机验证码"/>,)}
              </Col>
              <Col span={6}>
                <Button disabled={disabled} onClick={() => this.getCode()}>{getCodeText}</Button>
              </Col>
            </Row>
          </Form.Item>

          {/* <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>记住登录</Checkbox>)}
          </Form.Item> */}
          <Form.Item>
            <Button
              style={{
              width: '100%'
            }}
              type="primary"
              loading={loading}
              htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create < FormProps > ()(connect(() => ({}))(Login));
