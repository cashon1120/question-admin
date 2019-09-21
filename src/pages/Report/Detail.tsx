import React, {Component} from 'react';
import {
  Card,
  Button,
  Modal,
  message,
  Spin,
  Checkbox
} from 'antd';
import {connect} from 'dva';
import {Dispatch} from 'redux';
import 'antd/dist/antd.css';
import {ConnectProps, ConnectState} from '@/models/connect'
const {confirm} = Modal;

interface IProps extends ConnectProps {
  loading?: boolean,
  dispatch : Dispatch;
}

interface IState {
  id : string
  examList : any
  spinLoading : boolean
}

class UserInfoList extends Component < IProps,
IState > {

  constructor(props : any) {
    super(props);
    this.state = {
      examList: [],
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
          dispatch({type: 'report/del', payload: {
              id
            }, callback});
        }
      }
    });
  }

  // 加载数据
  initData() {
    const {dispatch} = this.props;
    const {id} = this.state
    const callback = (res : any) => {
      if (res.success) {
        this.setState({examList: res.data})
      }
      this.setState({spinLoading: false})
    }
    this.setState({spinLoading: true})
    if (dispatch) {
      dispatch({
        type: 'report/detail',
        payload: {
          examId: id
        },
        callback
      });
    }
  }

  formatType(type : number) {
    let str = ''
    switch (type) {
      case 1:
        str = '多选题'
        break;
      case 2:
        str = '单选题'
        break;
      default:
        str = '判断题'
        break;
    }
    return str
  }

  checkUserSelect = (optionId: string, selected: string) => {
    const userSelectedOptions = selected.split(',')
    let checked = false
    userSelectedOptions.forEach(item => {
      if(item === optionId){
        checked = true
      }
    })
    return checked
  }

  render() {
    const {examList,  spinLoading } = this.state
    return (

      <Card>
        {examList.map((item: any, index:number) => {
          return <div key={item.question_id} className="examlist">
            <div className={item.score > 0 ? 'right' : ''}>第{index + 1}题: {item.topic},{item.questions}({this.formatType(item.is_multiple_selection)}) <span style={{marginLeft: 10}}>[考生得分: {item.score}]</span></div>
            <ul>
              {item
                .result
                .map((result:any, index: number) => <li className={result.isCorrect === '1'? 'correct' : ''} key={result.optionId}>{index+1}: {result.optionDetail}
                {result.isCorrect === '1' ? ' (正确答案)' : null}
                {this.checkUserSelect(result.optionId, item.option_id) ? <Checkbox checked disabled={true} style={{marginLeft: 10}}></Checkbox> : null}
                </li>)}
            </ul>
          </div>
        })}
        <div className="foot-btn">
          <Button onClick={() => history.back()}>返回</Button>
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
