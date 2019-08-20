import React, {Component} from 'react'
import {
  Tabs,
  Card
} from 'antd'
import {PageHeaderWrapper} from '@ant-design/pro-layout'
import PersonalAuth from './components/PersonalAuth'
import CompanyAuth from './components/CompanyAuth'
import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
const {TabPane} = Tabs

interface FormProps extends FormComponentProps {
  dispatch : Dispatch < any >;
}

class Auth extends Component<FormProps> {
  render() {
    return (
      <PageHeaderWrapper content='完成实名认证可获取更多权益'>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="个人认证" key="1">
              <PersonalAuth submitting={false} dispatch={this.props.dispatch} />
            </TabPane>
            <TabPane tab="企业认证" key="2">
              <CompanyAuth submitting={false} dispatch={this.props.dispatch} />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Auth
