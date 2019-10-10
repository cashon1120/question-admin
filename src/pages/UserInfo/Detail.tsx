import React, {Component} from 'react';
import {
  Card,
  Button,
  Descriptions,
  Modal,
  message,
  Spin
} from 'antd';
import {connect} from 'dva';
import 'antd/dist/antd.css';
import {ConnectProps, ConnectState} from '@/models/connect';
import {setEnglishLevel, setComputerLevel} from '../../utils/utils'
const {confirm} = Modal;

interface IProps extends ConnectProps {
  loading?: boolean
}

interface IState {
  id : string
  userInfo : any
  spinLoading : boolean
}

class UserInfoList extends Component < IProps,
IState > {

  constructor(props : any) {
    super(props);
    this.state = {
      userInfo: {},
      id: props.match.params.id,
      spinLoading: true
    };
  }

  componentDidMount() {
    this.initData();
  }

  // 加载数据
  initData(params?: any) {
    const {dispatch} = this.props;
    const {id} = this.state
    const callback = (res : any) => {
      if (res.success) {
        this.setState({userInfo: res.data})
      }
      this.setState({
        spinLoading: false
      })
    }
    if (dispatch) {
      dispatch({
        type: 'userInfo/detail',
        payload: {
          candidateId: id
        },
        callback
      });
    }
  }

  deleteUser = () => {
    const {id} = this.state
    const {dispatch} = this.props
    const callback = (res : any) => {
      if (res.success) {
        message.success('操作成功')
        history.back()
      } else {
        message.error(res.data)
      }
    }
    confirm({
      title: '系统提示',
      content: '确定要删除该考生吗?',
      onOk: () => {
        if (dispatch) {
          dispatch({
            type: 'userInfo/del',
            payload: {
              sysUserId: sessionStorage.getItem('sysUserId'),
              candidateId: id,
              staffId: -1
            },
            callback
          });
        }
      }
    });
  }

  render() {
    const {userInfo, spinLoading} = this.state
    const englishLevel = setEnglishLevel(userInfo.english_level)
    const computerLevel = setComputerLevel(userInfo.computer_level)
    return (

      <Card>
        <Descriptions title={(userInfo.name || '---') + ' 的资料'}>
          <Descriptions.Item label="姓名">{userInfo.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{userInfo.sex === 1
              ? '女'
              : '男'}</Descriptions.Item>
          <Descriptions.Item label="出生年月">{userInfo.birth_time}</Descriptions.Item>
          <Descriptions.Item label="毕业时间">{userInfo.graduation_time}</Descriptions.Item>
          <Descriptions.Item label="学历">{userInfo.education}</Descriptions.Item>
          <Descriptions.Item label="专业名称">{userInfo.profession_name}</Descriptions.Item>
          <Descriptions.Item label="专业分类">{userInfo.profession_category}</Descriptions.Item>
          <Descriptions.Item label="毕业院校">{userInfo.graduated_school}</Descriptions.Item>
          <Descriptions.Item label="院校类型">{userInfo.school_category}</Descriptions.Item>
          <Descriptions.Item label="生源地">{userInfo.address}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{userInfo.phone}</Descriptions.Item>
          <Descriptions.Item label="本科专业名称">{userInfo.undergraduate_professional_name}</Descriptions.Item>
          <Descriptions.Item label="本科学校名称">{userInfo.undergraduate_school_name}</Descriptions.Item>
          <Descriptions.Item label="本科学校类型">{userInfo.undergraduate_school_category}</Descriptions.Item>
          <Descriptions.Item label="是否专升本">{userInfo.is_specialized
              ? '是'
              : '否'}</Descriptions.Item>
          <Descriptions.Item label="英语技能">{englishLevel}</Descriptions.Item>
          <Descriptions.Item label="计算机等级">{computerLevel}</Descriptions.Item>
          <Descriptions.Item label="文体特长">{userInfo.specialty}</Descriptions.Item>
          <Descriptions.Item label="备注">{userInfo.remark}</Descriptions.Item>
        </Descriptions>
        <div className="foot-btn">
          <Button onClick={() => history.back()}>返回</Button>
          <Button type="primary" onClick={() => this.deleteUser()}>删除</Button>
        </div>
        <div className={spinLoading
          ? 'spin'
          : 'spin-none'}>
          <Spin size="large"/>
        </div>
      </Card>
    );
  }
}

export default connect(({userInfo, loading} : ConnectState) => ({data: userInfo.data, loading: loading.models.userInfo}))(UserInfoList);
