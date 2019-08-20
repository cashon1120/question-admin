import React, {Fragment} from 'react';
import '../../global.less'
import {Card, Col, Row, Button} from 'antd';
import NumberCount from '../../components/NumberCount'
import NewsList from '../../components/NewsList'

export default() : React.ReactNode => (
  <Fragment>
    <div className="flex-container">
      <div className="flex-1">
        <div className="flex-container">
          <div className="flex-1 user-container flex-container flex-item-algin-center">
            <div style={{
              width: '50%'
            }}>
              <h1>139****3130</h1>
              未认证
            </div>

            <div className="flex-1">
              <Button type="primary" style={{
                margin: 15
              }}>安全设置</Button>
              <Button type="primary" style={{
                margin: 15
              }}>实名认证</Button>
            </div>

          </div>
          <div className="flex-1  padding-left">
            <Card title="待办事项">
              <Row>
                <Col
                  span={12}
                  style={{
                  borderRight: '1px solid #ebebeb'
                }}>
                  <NumberCount text="待支付订单" number={10}/>
                </Col>
                <Col span={12}>
                  <NumberCount text="待处理工单" number={5}/>
                </Col>
              </Row>
            </Card>
          </div>
        </div>

        <div className="padding-top">
          <Card title="使用中的">
            您还没有服务实例，
            <a href="#" target="_blank">购买产品</a>或
            <a href="#" target="_blank">免费试用</a>
          </Card>
        </div>
        <div className="padding-top">
          <Card title="可能感兴趣的">
            <Row>
              <Col md={24} lg={8}>
                <div className="flex-container flex-item-algin-center">
                  <div className="prod-logo"><img src="//static0.qxwz.com/cms/common/icon2-qxwz-findcm-o.png" alt="icon"/></div>
                  <div>
                    <div className="title">千寻知寸-FindCM</div>
                    <div className="desc">厘米级高精度定位</div>
                    <a href="#" target="_blank">立即购买&gt;</a>
                  </div>
                </div>
              </Col>
              <Col md={24} lg={8}>
                <div className="flex-container flex-item-algin-center">
                  <div className="prod-logo"><img src="//static0.qxwz.com/cms/common/icon2-qxwz-findcm-o.png" alt="icon"/></div>
                  <div>
                    <div className="title">千寻知寸-FindCM</div>
                    <div className="desc">厘米级高精度定位</div>
                    <a href="#" target="_blank">立即购买&gt;</a>
                  </div>
                </div>
              </Col>
              <Col md={24} lg={8}>
                <div className="flex-container flex-item-algin-center">
                  <div className="prod-logo"><img src="//static0.qxwz.com/cms/common/icon2-qxwz-findcm-o.png" alt="icon"/></div>
                  <div>
                    <div className="title">千寻知寸-FindCM</div>
                    <div className="desc">厘米级高精度定位</div>
                    <a href="#" target="_blank">立即购买&gt;</a>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
      <div style={{
        width: 300
      }} className="padding-left">
        <Card title="邀请奖励">
          <Row>
            <Col
              xs={24}
              sm={24}
              lg={12}
              style={{
              borderRight: '1px solid #ebebeb'
            }}>
              <NumberCount text="我的优惠券" number={0}/>
            </Col>
            <Col span={12}>
              <NumberCount text="我的兑换码" number={0}/>
            </Col>
          </Row>
        </Card>
        <div className="padding-top">
          <Card title="新闻">
            <NewsList/>
          </Card>
        </div>
      </div>
    </div>
  </Fragment>
);
