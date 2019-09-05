import React, {Component} from 'react';
import {Card, Button, Descriptions, Modal, message} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {ConnectProps, ConnectState} from '@/models/connect';
const {confirm} = Modal;

interface IProps extends ConnectProps {
  loading?: boolean
}

interface IState {
  id : string
}

class UserInfoList extends Component < IProps,
IState > {

  constructor(props : any) {
    super(props);
    this.state = {
      id: props.match.params.id
    };
  }

  componentDidMount() {
    // this.initData();
  }

  checkOut = () => {
    const {dispatch} = this.props
    const {id} = this.state
    const callback = (response : any) => {
      if (response.success) {
        message.success('操作成功')
      }
    }
    confirm({
      title: '审核信息',
      content: '审核通过后，考生即可扫描二维码考试，是否通过审核？',
      onOk: () => {
        if (dispatch) {
          dispatch({type: 'userInfo/checkOut', payload: {
              id
            }, callback});
        }
      }
    });
  }

  // 加载数据
  initData(params?: any) {
    const {dispatch} = this.props;

    const searchParams = {}

    if (dispatch) {
      dispatch({
        type: 'userInfo/detail',
        payload: {
          ...searchParams,
          ...params
        }
      });
    }
  }

  render() {
    const {loading} = this.props;
    return (
      <PageHeaderWrapper>
        <Card>
          <Descriptions title="张三 的资料">
            <Descriptions.Item label="姓名">张三</Descriptions.Item>
            <Descriptions.Item label="身份证号码">1810000000</Descriptions.Item>
            <Descriptions.Item label="电话号码">Hangzhou, Zhejiang</Descriptions.Item>
            <Descriptions.Item label="毕业院校">empty</Descriptions.Item>
            <Descriptions.Item label="专业方向">234234</Descriptions.Item>
            <Descriptions.Item label="政治面貌">234234</Descriptions.Item>
            <Descriptions.Item label="身高">234234</Descriptions.Item>
            <Descriptions.Item label="体重">234234</Descriptions.Item>
            <Descriptions.Item label="出生年月">234234</Descriptions.Item>
            <Descriptions.Item label="英语技能">234234</Descriptions.Item>
            <Descriptions.Item label="投递公司">234234</Descriptions.Item>
          </Descriptions>
          <div className="foot-btn">
            <Button onClick={() => history.back()}>返回</Button>
            <Button type="primary" onClick={this.checkOut}>初审通过</Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({userInfo, loading} : ConnectState) => ({data: userInfo.data, loading: loading.models.userInfo}))(UserInfoList);
