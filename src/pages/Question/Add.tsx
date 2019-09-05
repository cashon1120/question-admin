import React, {Component} from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Checkbox,
  Row,
  Col,
  message
} from 'antd';
import {connect} from 'dva';
import {FormComponentProps} from 'antd/es/form';
import 'antd/dist/antd.css';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Dispatch} from 'redux';
import {formItemLayout, submitFormLayout} from '../../../public/config';

const FormItem = Form.Item;
const {TextArea} = Input;

interface FormProps extends FormComponentProps {
  submitting : boolean;
  dispatch : Dispatch;
}

interface IState {
  loading : boolean;
  answers : any[];
}

class AddQuestion extends Component < FormProps,
IState > {
  state = {
    loading: false,
    answers: [
      {
        label: 'A',
        value: '',
        right: false
      }, {
        label: 'B',
        value: '',
        right: false
      }, {
        label: 'C',
        value: '',
        right: false
      }, {
        label: 'D',
        value: '',
        right: false
      }
    ]
  };

  componentDidMount() {
    this.initData()
  }

  initData(params?: object) {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'question/detail',
        payload: {
          ...params
        }
      });
    }
  }

  handleSubmit = (e : React.FormEvent) => {
    const {dispatch, form} = this.props;
    const {answers} = this.state
    const callback = (response: any) => {
      
    }
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let rightAnswers = 0
        answers.forEach((item : any) => {
          if (item.right) {
            rightAnswers += 1
          }
        })
        if(rightAnswers === 0){
          message.error('请至少选择一个正确答案!')
          return
        }
        this.setState({
          loading: true
        })
        dispatch({type: 'question/add', payload: values, callback});
      }
    });
  };

  handleChangeRight = (index : number) => {
    const {answers} = this.state
    const right = answers[index].right
    answers[index].right = !right
    this.setState({answers})
  }

  render() {
    const {loading, answers} = this.state
    const {form: {
        getFieldDecorator
      }} = this.props;
    return (
      <PageHeaderWrapper>
        <Card>
          <Form
            {...formItemLayout}
            onSubmit={this.handleSubmit}
            style={{
            marginTop: 20
          }}>
            <FormItem label="标题">
              <Row gutter={24}>
                <Col span={12}>
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: '请输入标题'
                      }
                    ]
                  })(<TextArea placeholder="请输入标题"/>)}
                </Col>
                <Col span={12}></Col>
              </Row>

            </FormItem>
            {answers.map((item : any, index : number) => {
              return (
                <FormItem key={index} {...formItemLayout} label={item.label}>
                  <Row gutter={24} >
                    <Col span={12}>
                      {getFieldDecorator(`${item.label}`, {
                        initialValue: item.value,
                        rules: [
                          {
                            required: true,
                            message: `请输入答案${item.label}`
                          }
                        ]
                      })(<TextArea placeholder={`请输入答案${item.label}`}/>)}
                    </Col>
                    <Col span={12}>
                      <Checkbox
                        checked={item.right}
                        onChange={() => {
                        this.handleChangeRight(index)
                      }}>正确答案</Checkbox>
                    </Col>
                  </Row>
                </FormItem>
              )
            })}

            <FormItem
              {...submitFormLayout}
              style={{
              marginTop: 32
            }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存题目
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create < FormProps > ()(connect(() => ({}))(AddQuestion));
