import React, {Component} from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Checkbox,
  Row,
  Col,
  Radio,
  message
} from 'antd';
import {connect} from 'dva';
import {FormComponentProps} from 'antd/es/form';
import 'antd/dist/antd.css';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Dispatch} from 'redux';
import router from 'umi/router';
import {formItemLayout, submitFormLayout} from '../../../public/config';

const FormItem = Form.Item;
const {TextArea} = Input;

interface FormProps extends FormComponentProps {
  submitting : boolean;
  dispatch : Dispatch;
}

interface IState {
  loading : boolean;
  answers_1 : any[];
  answers_2 : any[];
  answers_3 : any[];
  type : number,
  isMultipleSelection : number,
  topic : string,
  questions : string,
  questionId : string
}

class AddQuestion extends Component < FormProps,
IState > {
  state = {
    loading: false,
    answers_1: [
      {
        detail: '',
        isCorrect: 0,
        score: 0,
        del: false
      }, {
        detail: '',
        isCorrect: 0,
        score: 0,
        del: false
      }, {
        detail: '',
        isCorrect: 0,
        score: 0,
        del: false
      }, {
        detail: '',
        isCorrect: 0,
        score: 0,
        del: false
      }
    ],
    answers_2: [
      {
        detail: '',
        isCorrect: 0,
        score: 0,
        del: false
      }, {
        score: 0,
        detail: '',
        isCorrect: 0,
        del: false
      }, {
        score: 0,
        detail: '',
        isCorrect: 0,
        del: false
      }, {
        score: 0,
        detail: '',
        isCorrect: 0,
        del: false
      }
    ],
    answers_3: [
      {
        score: 0,
        detail: '',
        isCorrect: 0,
        del: false
      }, {
        score: 0,
        detail: '',
        isCorrect: 0,
        del: false
      }
    ],
    type: 1,
    isMultipleSelection: 1,
    topic: '',
    questions: '',
    questionId: this.props.match.params.id
  };

  componentDidMount() {
    const {questionId} = this.state
    if (questionId) {
      this.getQuestionDetail()
    }
  }

  getQuestionDetail() {
    const {questionId} = this.state
    const {dispatch} = this.props
    const callback = (res : any) => {
      if (res.success) {
        const {type, is_multiple_selection, topic, questions} = res.data.question
        if (is_multiple_selection === 1) {}
        this.setState({type, isMultipleSelection: is_multiple_selection, topic, questions})
      }
    }
    const payload = {
      sysUserId: localStorage.getItem('sysUserId'),
      questionId
    }
    dispatch({type: 'question/detail', payload, callback});
  }

  handleSubmit = (e : React.FormEvent) => {
    const {dispatch, form} = this.props;
    const {answers_1, answers_2, answers_3, isMultipleSelection} = this.state
    let options : any[] = []
    const callback = (res : any) => {
      if (res.success) {
        router.push('/empty')
      } else {
        message.error(res.msg || res.data)
      }
      this.setState({loading: false})
    }
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let rightAnswers = 0
        if (isMultipleSelection === 1) {
          options = answers_1
          answers_1.forEach((item : any) => {
            if (item.isCorrect) {
              rightAnswers += 1
            }
          })
        }
        if (isMultipleSelection === 2) {
          options = answers_2
          answers_2.forEach((item : any) => {
            if (item.isCorrect) {
              rightAnswers += 1
            }
          })
        }
        if (isMultipleSelection === 3) {
          options = answers_3
          answers_3.forEach((item : any) => {
            if (item.isCorrect) {
              rightAnswers += 1
            }
          })
        }

        if (rightAnswers === 0) {
          message.error('请至少选择一个正确答案!')
          return
        }
        const data = {
          type: values.type,
          isMultipleSelection,
          topic: values.topic,
          questions: values.questions,
          score: 0,
          options
        }
        const payload = {
          sysUserId: localStorage.getItem('sysUserId'),
          jsonString: JSON.stringify(data)
        }
        this.setState({loading: true})
        dispatch({type: 'question/add', payload, callback});
      }
    });
  };

  handleChangeRight = (index : number) => {
    const {answers_1, answers_2, answers_3, isMultipleSelection} = this.state
    if (isMultipleSelection === 1) {
      const isCorrect = answers_1[index].isCorrect
      answers_1[index].isCorrect = isCorrect === 1
        ? 0
        : 1

      this.setState({answers_1})
    }
    if (isMultipleSelection === 2) {
      answers_2.forEach((item, ind) => {
        answers_2[ind].isCorrect = 0
      })
      answers_2[index].isCorrect = 1
      this.setState({answers_2})
    }
    if (isMultipleSelection === 3) {
      answers_3.forEach((item, ind) => {
        answers_3[ind].isCorrect = 0
      })
      answers_3[index].isCorrect = 1
      this.setState({answers_3})
    }

  }

  //
  onTypeChange = (e : any) => {
    const value = e.target.value
    this.setState({type: value})
  }

  onMultipChange = (e : any) => {
    const value = e.target.value
    this.setState({isMultipleSelection: value})
  }

  // 删除答案
  deleteAnswer = (index : number) => {
    const {answers_1, answers_2, answers_3, isMultipleSelection} = this.state
    if (isMultipleSelection === 1) {
      answers_1[index].del = true
      this.setState({answers_1})
    }
    if (isMultipleSelection === 2) {
      answers_2[index].del = true
      this.setState({answers_2})
    }
    if (isMultipleSelection === 3) {
      answers_3[index].del = true
      this.setState({answers_3})
    }
    console.log(answers_1)
  }

  // 输入答案
  handleChangeAnswer = (e : any, index : number) => {
    const {answers_1, answers_2, answers_3, isMultipleSelection} = this.state
    const value = e.target.value
    if (isMultipleSelection === 1) {
      answers_1[index].detail = value
      this.setState({answers_1})
    }
    if (isMultipleSelection === 2) {
      answers_2[index].detail = value
      this.setState({answers_2})
    }
    if (isMultipleSelection === 3) {
      answers_3[index].detail = value
      this.setState({answers_3})
    }
  }

  // 添加更多答案
  handleAddAnswer = () => {
    const {answers_1, answers_2, answers_3, isMultipleSelection} = this.state
    if (isMultipleSelection === 1) {
      answers_1.push({detail: '', isCorrect: 0, score: 0, del: false})
      this.setState({answers_1})
    }
    if (isMultipleSelection === 2) {
      answers_2.push({detail: '', isCorrect: 0, score: 0, del: false})
      this.setState({answers_2})
    }
    if (isMultipleSelection === 3) {
      answers_3.push({detail: '', isCorrect: 0, score: 0, del: false})
      this.setState({answers_3})
    }
  }

  updateOption = (index: number) => {

  }

  render() {
    let {
      loading,
      answers_1,
      answers_2,
      answers_3,
      type,
      isMultipleSelection,
      topic,
      questions
    } = this.state
    answers_1 = answers_1.filter((item: any) => item.del === false)
    answers_2 = answers_2.filter((item: any) => item.del === false)
    answers_3 = answers_3.filter((item: any) => item.del === false)
    console.log(answers_1)
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
            <FormItem label="题目分类">
              <Row gutter={24}>
                <Col span={24}>
                  {getFieldDecorator('type', {
                    initialValue: type,
                    rules: [
                      {
                        required: true,
                        message: '请选择题目分类'
                      }
                    ]
                  })(
                    <Radio.Group onChange={this.onTypeChange}>
                      <Radio value={1}>行测题</Radio>
                      <Radio value={2}>职业道德题</Radio>
                      <Radio value={3}>电力安全常识题</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem label="题型">
              <Row gutter={24}>
                <Col span={12}>
                  {getFieldDecorator('isMultipleSelection', {
                    initialValue: isMultipleSelection,
                    rules: [
                      {
                        required: true,
                        message: '请选择类型'
                      }
                    ]
                  })(
                    <Radio.Group onChange={this.onMultipChange}>
                      <Radio value={1}>多选题</Radio>
                      <Radio value={2}>单选题</Radio>
                      <Radio value={3}>判断题</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem label="标题">
              <Row gutter={24}>
                <Col span={12}>
                  {getFieldDecorator('topic', {
                    initialValue: topic,
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
            <FormItem label="问题">
              <Row gutter={24}>
                <Col span={12}>
                  {getFieldDecorator('questions', {
                    initialValue: questions,
                    rules: [
                      {
                        required: true,
                        message: '请输入问题'
                      }
                    ]
                  })(<TextArea placeholder="请输入标题"/>)}
                </Col>
              </Row>
            </FormItem>
            {isMultipleSelection === 1
              ? answers_1.map((item : any, index : number) => {
                return (
                  <FormItem key={index} {...formItemLayout} label="答案">
                    <Row gutter={24}>
                      <Col span={12}>
                        {getFieldDecorator(`answer_${index + 1}`, {
                          initialValue: item.detail,
                          rules: [
                            {
                              required: true,
                              message: `请输入答案`
                            }
                          ]
                        })(<TextArea
                          placeholder={`请输入答案`}
                          onChange={(e) => {
                          this.handleChangeAnswer(e, index)
                        }}/>)}
                      </Col>
                      <Col span={12}>
                        <Checkbox
                          checked={item.isCorrect}
                          onChange={() => {
                          this.handleChangeRight(index)
                        }}>正确答案</Checkbox>
                        <a
                          style={{
                          marginLeft: 20
                        }}
                          onClick={() => {
                          this.deleteAnswer(index)
                        }}>删除</a>
                        <a
                          style={{
                          marginLeft: 20
                        }}
                          onClick={() => {
                          this.updateOption(index)
                        }}>确认修改</a>
                      </Col>
                    </Row>
                  </FormItem>
                )
              })
              : isMultipleSelection === 2
                ? answers_2.map((item : any, index : number) => {
                  return (
                    <FormItem key={index} {...formItemLayout} label="答案">
                      <Row gutter={24}>
                        <Col span={12}>
                          {getFieldDecorator(`answer_${index + 1}`, {
                            initialValue: item.detail,
                            rules: [
                              {
                                required: true,
                                message: `请输入答案`
                              }
                            ]
                          })(<TextArea
                            placeholder={`请输入答案`}
                            onChange={(e) => {
                            this.handleChangeAnswer(e, index)
                          }}/>)}
                        </Col>
                        <Col span={12}>
                          <Radio
                            checked={item.isCorrect}
                            onChange={() => {
                            this.handleChangeRight(index)
                          }}>正确答案</Radio>

                          <a
                            style={{
                            marginLeft: 20
                          }}
                            onClick={() => {
                            this.deleteAnswer(index)
                          }}>删除</a>
                          <a
                            style={{
                            marginLeft: 20
                          }}
                            onClick={() => {
                            this.updateOption(index)
                          }}>确认修改</a>
                        </Col>
                      </Row>
                    </FormItem>
                  )
                })
                : answers_3.map((item : any, index : number) => {
                  return (
                    <FormItem key={index} {...formItemLayout} label="答案">
                      <Row gutter={24}>
                        <Col span={12}>
                          {getFieldDecorator(`answer_${index + 1}`, {
                            initialValue: item.detail,
                            rules: [
                              {
                                required: true,
                                message: `请输入答案`
                              }
                            ]
                          })(<TextArea
                            placeholder={`请输入答案`}
                            onChange={(e) => {
                            this.handleChangeAnswer(e, index)
                          }}/>)}
                        </Col>
                        <Col span={12}>
                          <Radio
                            checked={item.isCorrect}
                            onChange={() => {
                            this.handleChangeRight(index)
                          }}>正确答案</Radio>
                          <a
                            style={{
                            marginLeft: 20
                          }}
                            onClick={() => {
                            this.updateOption(index)
                          }}>删除</a>
                          <a
                            style={{
                            marginLeft: 20
                          }}
                            onClick={() => {
                            this.deleteAnswer(index)
                          }}>确认修改</a>
                        </Col>
                      </Row>
                    </FormItem>
                  )
                })
}
            <FormItem
              {...submitFormLayout}
              style={{
              marginTop: 32
            }}>
              <Button onClick={() => this.handleAddAnswer()}>
                新增答案
              </Button>
            </FormItem>
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
