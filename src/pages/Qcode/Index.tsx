import React, {Component} from 'react';
import {Card, Form, DatePicker, Button, Modal} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import {ConnectState} from '@/models/connect';

const {RangePicker} = DatePicker;
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'area'
  }, {
    title: '学历',
    dataIndex: 'birth',
    key: 'birth'
  }, {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone'
  }, {
    title: '毕业院校',
    dataIndex: 'school1',
    key: 'school1'
  }
];

interface FormProps extends FormComponentProps {
  submitting? : boolean;
  dispatch? : Dispatch;
  type: number
}

interface IState {
  loading : boolean;
  modalVisible : boolean;
  data : any[],
  typeId: number
}

class QcodeEnroll extends Component < FormProps,
IState > {
  constructor(props:any) {
    super(props);
    this.state = {
      loading: false,
      modalVisible: false,
      data: [],
      typeId: props.type
    };
  }

  componentDidMount() {
    this.initData();
  }

  handleTriggerModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible
    });
  };

  handleSubmitModal = (e : any) => {
    e.preventDefault();
    const {form, dispatch} = this.props;
    const callback = (response : any) => {}
    form.validateFields((err, fieldsValue) => {
      if (err) 
        return;
      if (dispatch) {
        dispatch({type: 'qcode/submit', payload: {}, callback});
      }
      this.handleTriggerModal();
    });

  };

  handleSaveImg = () => {
    var image = new Image()
    image.setAttribute("crossOrigin",'Anonymous')
    image.src = 'http://ymhx.f3322.net:8123/uploads/images/19-08-22/602254cfa30f4ee28c5d6a4f75ce5862.png';
    
    image.onload = function () {
      var canvas = document.createElement('canvas')
      canvas.width = 300
      canvas.height = 300
      
      var context = canvas.getContext('2d')
      if (context) {
        context.drawImage(image, 0, 0, 300, 300)
        var url = canvas.toDataURL('image/jpeg')
        // 生成一个a元素
        var a = document.createElement('a')
        // 创建一个单击事件
        var event = new MouseEvent('click')

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = name || '下载图片名称'
        // 将生成的URL设置为a.href属性
        a.href = url
        // 触发a的单击事件
        a.dispatchEvent(event)
      }
    }
  }

  initData(params?: object) {
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'qcode/fetch',
        payload: {
          ...params
        }
      });
    }
  }

  render() {

    const {loading, data, modalVisible} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 2
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    };
    const {form: {
        getFieldDecorator
      }} = this.props;
    const rangeConfig = {
      rules: [
        {
          type: 'array',
          required: true,
          message: '请选择时间!'
        }
      ]
    };
    return (
      <PageHeaderWrapper>
        <Card>
          <Form {...formItemLayout} onSubmit={this.handleSubmitModal}>
            <Form.Item label="有效日期">
              {getFieldDecorator('range-picker', rangeConfig)(<RangePicker/>)}
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                marginLeft: 20
              }}>
                生成二维码
              </Button>
            </Form.Item>
          </Form>
          <Card title="生成记录">
            <StandardTable
              columns={columns}
              data={data || []}
              loading={loading}
              onChangeCombine={(params : object) => this.initData(params)}/>
          </Card>
          <Modal
            title="生成二维码"
            visible={modalVisible}
            onOk={this.handleSaveImg}
            onCancel={this.handleTriggerModal}
            okText="保存为图片"
            cancelText="关闭">
            <div style={{
              textAlign: 'center'
            }}>
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567675811029&di=d0c44922276be7e2a52b2b9785fa4391&imgtype=0&src=http://image.thepaper.cn/www/image/8/856/505.jpg"
                style={{
                width: 300,
                height: 300
              }}/>
            </div>
          </Modal>
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default Form.create < FormProps > ()(connect(({qcode} : ConnectState) => ({}))(QcodeEnroll));
