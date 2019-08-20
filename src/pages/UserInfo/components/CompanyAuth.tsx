import React, {Component} from 'react'
import {
  Button,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Select
} from 'antd'
import {FormComponentProps} from 'antd/es/form';
import {formItemLayout, submitFormLayout} from '../../../../public/config'
import {Dispatch} from 'redux';
import {connect} from 'dva';
const FormItem = Form.Item;
const {Option} = Select;

interface FormProps extends FormComponentProps {
  submitting : boolean;
  dispatch : Dispatch < any >;
}

class PersonalAuth extends Component<FormProps, any>{
  handleSubmit = (e : React.FormEvent) => {
    const {dispatch, form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({type: 'userInfoAuth/submitForm', payload: values});
      }
    });
  };

  render() {
    const {submitting} = this.props;
    const {form: {
        getFieldDecorator
      }} = this.props;

    return (
      <Form
        {...formItemLayout}
        onSubmit={this.handleSubmit}
        style={{
        marginTop: 20
      }}>
        <FormItem label="个人邮箱">
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: '请输入个人邮箱'
              }
            ]
          })(<Input placeholder="请输入个人邮箱"/>)}
        </FormItem>

        <FormItem {...formItemLayout} label="邮箱验证码">
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱验证码'
                  }
                ]
              })(<Input placeholder="请输入邮箱验证码"/>)}
            </Col>
            <Col span={12}>
              <Button>获取验证码</Button>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="服务用途">
          {getFieldDecorator('service', {
            rules: [
              {
                required: true,
                message: '请选择服务用途'
              }
            ]
          })(
            <Select
              showSearch
              style={{
              width: 250
            }}
              placeholder="请选择服务用途">
              <Option value="jack">高精度导航</Option>
              <Option value="lucy">高精度导航</Option>
              <Option value="tom">高精度导航</Option>
            </Select>
          )}
        </FormItem>

        <FormItem label="真实姓名">
          {getFieldDecorator('realname', {
            rules: [
              {
                required: true,
                message: '请输入真实姓名'
              }
            ]
          })(<Input placeholder="请输入真实姓名"/>)}
        </FormItem>

        <FormItem label="身份证号码">
          {getFieldDecorator('idNumber', {
            rules: [
              {
                required: true,
                message: '请输入身份证号码'
              }
            ]
          })(<Input placeholder="请输入身份证号码"/>)}
        </FormItem>

        <Form.Item {...submitFormLayout}>
          {getFieldDecorator('agreement', {valuePropName: 'checked'})(
            <Checkbox>
            我同意拼接受
            <a href="">注册协议</a>
          </Checkbox>,)}
        </Form.Item>
        <FormItem {...submitFormLayout} style={{
          marginTop: 32
        }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交认证
          </Button>
        </FormItem>
      </Form>

    );
  }
}

export default Form.create < FormProps > ()(connect(({loading} : {
  loading: {
    effects: {
      [key : string]: boolean
    }
  }
}) => ({submitting: loading.effects['userInfoAuth/submitForm']}))(PersonalAuth));
