import React, { Component } from 'react';
import { setAuthority } from '../../utils/authority';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './style.less';

interface FormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch;
}

class Login extends Component<FormProps, {}> {
  state = {
    loading: false,
  };
  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    const callback = (res: any) => {
      if (res.success) {
        setAuthority('admin');
        dispatch(routerRedux.push({ pathname: '/' }));
      } else {
        message.error(res.msg);
      }
      this.setState({
        loading: false,
      });
    };
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        dispatch({ type: 'login/submitForm', payload: values, callback });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { loading } = this.state;
    return (
      <div className={styles.main}>
        <h2>用户登录</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '请输入手机号!',
                },
              ],
            })(<Input prefix={<Icon type="user" />} placeholder="手机号" />)}
          </Form.Item>
          <Form.Item>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码!',
                    },
                  ],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="text"
                    placeholder="手机验证码"
                  />,
                )}
              </Col>
              <Col span={6}>
                <Button>获取验证码</Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>记住登录</Checkbox>)}
          </Form.Item>
          <Form.Item>
            <Button
              style={{
                width: '100%',
              }}
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create<FormProps>()(connect(() => ({}))(Login));
