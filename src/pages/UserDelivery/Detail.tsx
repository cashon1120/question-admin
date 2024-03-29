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
      spinLoading: false
    };
  }

  componentDidMount() {
    this.initData();
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
    const {id} = this.state
    const callback = (res : any) => {
      if (res.success) {
        this.setState({userInfo: res.data})
      }
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

  hadleCheckOut = (id : string, type : number) => {
    const {dispatch} = this.props
    const callback = (res : any) => {
      if (res.success) {
        message.success('操作成功')
      } else {
        message.error(res.data)
      }
      this.setState({
        spinLoading: false
      })
    }
    let info = '审核通过后，考生即可扫描二维码考试，是否通过审核'
    if (type === 2) {
      info = '确定要拒绝通过吗?'
    }
    confirm({
      title: '审核信息',
      content: info,
      onOk: () => {
        if (dispatch) {
          this.setState({
            spinLoading: true
          })
          dispatch({
            type: 'userInfo/checkOut',
            payload: {
              deliveryId: id,
              state: type
            },
            callback
          });
        }
      }
    });
  }

  render() {
    const {userInfo, id, spinLoading} = this.state
    const englishLevel = setEnglishLevel(userInfo.english_level)
    const computerLevel = setComputerLevel(userInfo.computer_level)
    return (

      <Card>
        <Descriptions title="张三 的资料">
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
          <Button type="primary" onClick={() => this.hadleCheckOut(id, 3)}>通过审核</Button>
          <Button type="primary" onClick={() => this.hadleCheckOut(id, 3)}>不通过</Button>
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
