import React from 'react';
import { Card, Icon, Row, Col, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <div className="flex-container">
        <div>
          <Icon
            style={{
              fontSize: 50,
              marginRight: 24,
            }}
            type="solution"
          />
        </div>
        <div>
          <h1>139****3130</h1>
          未认证
        </div>
      </div>

      {/* 账号安全等级 */}
      <div className="flex-container list-container">
        <div>当前账号安全等级</div>
        <div>
          <div className="safe-bar ml20 low">
            <span className="left">弱</span>
            <span>中</span>
            <span className="right">强</span>
          </div>
        </div>
      </div>

      {/* 完善信息 */}
      <div
        className="list-container"
        style={{
          lineHeight: '32px',
        }}
      >
        <h2>为了您的账号安全等级，建议您完善如下信息：</h2>
        <Row>
          <Col span={11}>绑定手机 | 绑定手机，快速找回密码或其它安全验证</Col>
          <Col span={4}>
            <Icon type="safety" className="color-green" />
            已绑定
          </Col>
        </Row>
        <Row>
          <Col span={11}>绑定邮箱 | 绑定邮箱，快速找回密码或其它安全验证</Col>
          <Col span={4}>
            <Icon type="warning" className="color-origin" />
            未绑定
          </Col>
        </Row>
        <Row>
          <Col span={11}>完善身份 | 完善身份信息，认证开发者，享受更多服务</Col>
          <Col span={4}>
            <Icon type="warning" className="color-origin" />
            未绑定
          </Col>
        </Row>
      </div>

      <div className="list-container">
        <Row>
          <Col span={11}>
            <h2>账号密码</h2>
            账号密码保障登录安全
          </Col>
          <Col span={4}>
            <Button>修改</Button>
          </Col>
        </Row>
      </div>

      <div className="list-container">
        <Row>
          <Col span={11}>
            <h2>绑定邮箱</h2>
            可用于登录，快速找回密码或其他安全验证
          </Col>
          <Col span={4}>
            <Button>修改</Button>
          </Col>
        </Row>
      </div>

      <div className="list-container">
        <Row>
          <Col span={11}>
            <h2>绑定手机 （139****3130）</h2>
            可用于登录，快速找回密码或其他安全验证
          </Col>
          <Col span={4}>
            <Button>修改</Button>
          </Col>
        </Row>
      </div>

      <div className="list-container">
        <Row>
          <Col span={11}>
            <h2>完善身份</h2>
            完善身份信息，认证开发者，享受 更多权益
          </Col>
          <Col span={4}>
            <Button>去认证</Button>
          </Col>
        </Row>
      </div>

      <div className="list-container">
        <Row>
          <Col span={11}>
            <h2>注销账号</h2>
            如果您不再使用此账号，可以将其注销。账号成功注销后，
            <br />
            其下所有服务、数据及隐私信息将会被删除并将无法恢复。
          </Col>
          <Col span={4}>
            <Button>修改</Button>
          </Col>
        </Row>
      </div>
    </Card>
  </PageHeaderWrapper>
);
