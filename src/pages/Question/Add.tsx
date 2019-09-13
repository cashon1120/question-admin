import React, {Component, Fragment} from 'react';
import {
  Button,
  Form,
  Input,
  Card,
  Checkbox,
  Row,
  Col,
  Radio,
  Spin,
  message
} from 'antd';
import {connect} from 'dva';
import {FormComponentProps} from 'antd/es/form';
import 'antd/dist/antd.css';
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
  spinLoading : boolean;
  loading : boolean;
  oldAnswers : any[];
  answers : any[];
  type : number,
  isMultipleSelection : number,
  topic : string,
  questions : string,
  questionId : string
}

class AddQuestion extends Component < FormProps,
IState > {
  constructor(props : any) {
    super(props)
    this.state = {
      spinLoading: false,
      loading: false,
      answers: [
        {
          detail: '',
          isCorrect: 0,
          score: 0,
          del: false
        }
      ],
      oldAnswers: [],
      type: 1,
      isMultipleSelection: 1,
      topic: '',
      questions: '',
      questionId: props.match.params.id
    };
  }

  componentDidMount() {
    const {questionId} = this.state
    if (questionId) {
      this.getQuestionDetail()
    } else {
      this.setAnswersLength()
    }
  }

  // 根据答题类型修改answer
  setAnswersLength() {
    const {isMultipleSelection, topic, questions} = this.state
    const {form} = this.props
    let answers = []

    setTimeout(() => {
      form.resetFields()
      form.setFieldsValue({['topic']: topic, ['questions']: questions});
    }, 0);

    if (isMultipleSelection === 3) {
      for (let i = 0; i < 2; i += 1) {
        let detail = i === 0
          ? '是'
          : '否'
        answers.push({detail, isCorrect: 0, score: 0, del: false})
      }
    } else {
      for (let i = 0; i < 4; i += 1) {
        answers.push({detail: '', isCorrect: 0, score: 0, del: false})
      }
      this.setState({
        oldAnswers: JSON.parse(JSON.stringify(answers))
      })
    }
    this.setState({answers})
  }

  getQuestionDetail() {
    this.changeSpinLoading()
    const {questionId} = this.state
    const {dispatch} = this.props
    const callback = (res : any) => {
      this.changeSpinLoading()
      if (res.success) {
        const {type, is_multiple_selection, topic, questions} = res.data.question
        let answers : any[] = []

        res
          .data
          .option
          .forEach((item : any) => {
            answers.push({
              detail: item.detail,
              id: item.id,
              isCorrect: item.is_correct,
              publish_time: item.publish_time,
              question_id: item.question_id,
              score: item.score,
              del: false
            })
          })
        this.setState({type, isMultipleSelection: is_multiple_selection, topic, questions, answers})

        if (is_multiple_selection === 3) {
          let oldAnswers = []
          for (let i = 0; i < 4; i += 1) {
            oldAnswers.push({detail: '', isCorrect: 0, score: 0, del: false})
          }
          this.setState({oldAnswers})
        } else {
          this.setState({oldAnswers: answers})
        }
      }
    }
    const payload = {
      sysUserId: localStorage.getItem('sysUserId'),
      questionId
    }
    dispatch({type: 'question/detail', payload, callback});
  }

  // 提交 / 修改答题
  handleSubmit = (e : React.FormEvent) => {
    const {dispatch, form} = this.props;
    const {answers, isMultipleSelection, questionId} = this.state

    let options : any[] = []
    const callback = (res : any) => {
      if (res.success) {
        if (questionId) {
          message.success('修改成功')
        } else {
          router.push('/empty')
        }
      } else {
        message.error(res.msg || res.data)
      }
      this.setState({loading: false})
    }
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let rightAnswers = 0
        answers.forEach((item : any) => {
          if (item.isCorrect) {
            rightAnswers += 1
          }
        })

        if (rightAnswers === 0) {
          message.error('请至少选择一个正确答案!')
          return
        }
        options = answers.filter((item : any) => item.del === false)
        let payload = {}
        let url = ''
        if (questionId) {
          payload = {
            questionId,
            sysUserId: localStorage.getItem('sysUserId'),
            type: values.type,
            isMultipleSelection,
            topic: values.topic,
            questions: values.questions
          }
          url = 'question/update'
        } else {
          const data = {
            type: values.type,
            isMultipleSelection,
            topic: values.topic,
            questions: values.questions,
            score: 0,
            options
          }
          payload = {
            sysUserId: localStorage.getItem('sysUserId'),
            jsonString: JSON.stringify(data)
          }
          url = 'question/add'
        }

        this.setState({loading: true})
        dispatch({type: url, payload, callback});
      }
    });

  };

  // 选择正确答案
  handleChangeRight = (index : number) => {
    const {answers, isMultipleSelection} = this.state
    if (isMultipleSelection === 1) {
      const isCorrect = answers[index].isCorrect
      answers[index].isCorrect = isCorrect === 1
        ? 0
        : 1
    } else {
      answers.forEach((item, ind) => {
        answers[ind].isCorrect = 0
      })
      answers[index].isCorrect = 1
    }
    this.setState({answers})
  }

  // 题目种类切换
  onTypeChange = (e : any) => {
    const value = e.target.value
    this.setState({type: value})
  }

  // 单选/多选/判断题 切换
  onMultipChange = (e : any) => {
    const value = e.target.value
    const {oldAnswers, answers} = this.state
    this.setState({
      isMultipleSelection: value
    }, () => {
      if (value === 3) {
        this.setState({
          oldAnswers: JSON.parse(JSON.stringify(answers))
        })
        this.setAnswersLength()
      } else {
        if (oldAnswers) {
          this.setState({
            answers: JSON.parse(JSON.stringify(oldAnswers))
          })
        }
      }
    })
  }

  // 显示 / 隐藏 loading
  changeSpinLoading() {
    const {spinLoading} = this.state
    this.setState({
      spinLoading: !spinLoading
    })
  }

  // 输入答案
  handleChangeAnswer = (e : any, index : number) => {
    const {answers} = this.state
    const value = e.target.value
    answers[index].detail = value
    this.setState({
      answers,
      oldAnswers: JSON.parse(JSON.stringify(answers))
    })
  }

  // 添加更多答案选项
  handleAddAnswer = () => {
    const {answers} = this.state
    answers.push({detail: '', isCorrect: 0, score: 0, del: false})
    this.setState({answers})
  }

  // 删除答案选项
  handleDeleteOption = (index : number) => {
    const {answers} = this.state
    const {dispatch} = this.props
    const optionId = answers[index].id
    answers[index].del = true
    this.setState({
      answers,
      oldAnswers: JSON.parse(JSON.stringify(answers))
    })
    if (optionId) {
      this.changeSpinLoading()
      const callback = (res : any) => {
        if (res.success) {
          message.success('删除成功')
        } else {
          message.error(res.data)
        }
        this.changeSpinLoading()
      }
      const payload = {
        sysUserId: localStorage.getItem('sysUserId'),
        optionId
      }
      dispatch({type: 'question/delOption', payload, callback});
    }
  }

  // 更新选项
  handleEditOption = (index : number) => {
    const {answers, questionId} = this.state
    const {dispatch} = this.props
    const option = answers[index]
    const optionId = option.id
    const { detail, isCorrect} = option
    if (optionId) {
      this.changeSpinLoading()
      const callback = (res : any) => {
        if (res.success) {
          message.success('修改成功')
        } else {
          message.error(res.data)
        }
        this.changeSpinLoading()
      }
      const payload = {
        sysUserId: localStorage.getItem('sysUserId'),
        optionId,
        detail,
        isCorrect,
      }
      dispatch({type: 'question/updateOption', payload, callback});
    }else{

      // 新增答案
      this.changeSpinLoading()
      const callback = (res : any) => {
        if (res.success) {
          message.success('添加成功')
        } else {
          message.error(res.data)
        }
        this.changeSpinLoading()
      }
      const payload = {
        sysUserId: localStorage.getItem('sysUserId'),
        questionId,
        detail,
        isCorrect,
      }
      dispatch({type: 'question/addOption', payload, callback});
    }
  }

  // 输入框值变化
  handleInputChange = (e : any, key : string) => {
    const value = e.target.value
    if (key === 'topic') {
      this.setState({topic: value})
    } else {
      this.setState({questions: value})
    }
  }

  render() {
    let {
      loading,
      answers,
      type,
      isMultipleSelection,
      topic,
      questions,
      questionId,
      spinLoading
    } = this.state

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
                })(<TextArea
                  onChange={e => this.handleInputChange(e, 'topic')}
                  placeholder="请输入标题"/>)}
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
                })(<TextArea
                  onChange={e => this.handleInputChange(e, 'questions')}
                  placeholder="请输入标题"/>)}
              </Col>
            </Row>
          </FormItem>
          {answers.map((item : any, index : number) => !item.del
            ? <FormItem key={index} {...formItemLayout} label="答案">
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
                      disabled={isMultipleSelection === 3}
                      placeholder={`请输入答案`}
                      onChange={(e) => {
                      this.handleChangeAnswer(e, index)
                    }}/>)}
                  </Col>
                  <Col span={12}>
                    {isMultipleSelection === 1
                      ? <Checkbox
                          checked={item.isCorrect}
                          onChange={() => {
                          this.handleChangeRight(index)
                        }}>正确答案</Checkbox>
                      : <Radio
                        style={{
                        margin: 0
                      }}
                        checked={item.isCorrect}
                        onChange={() => {
                        this.handleChangeRight(index)
                      }}>正确答案</Radio>
}

                    <Fragment>
                      {isMultipleSelection !== 3
                        ? <a
                            style={{
                            marginLeft: 20
                          }}
                            onClick={() => {
                            this.handleDeleteOption(index)
                          }}>删除</a>
                        : null
}

                      {questionId
                        ? <a
                            style={{
                            marginLeft: 20
                          }}
                            onClick={() => {
                            this.handleEditOption(index)
                          }}>{item.id ? '确认修改' : '新增答案'}</a>
                        : null}

                    </Fragment>

                  </Col>
                </Row>
              </FormItem>
            : null)
}
          <FormItem {...submitFormLayout} style={{
            marginTop: 32
          }}>
            {isMultipleSelection !== 3
              ? <Button onClick={() => this.handleAddAnswer()}>
                  新增答案
                </Button>
              : null
}

          </FormItem>
          <FormItem {...submitFormLayout} style={{
            marginTop: 32
          }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存题目
            </Button>
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

export default Form.create < FormProps > ()(connect(() => ({}))(AddQuestion));
