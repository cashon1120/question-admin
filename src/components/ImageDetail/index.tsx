import React, {Component} from 'react';
import {Modal} from 'antd';

interface IProps {
  imgUrl : string
  visible : boolean
  onCancel : () => void
}

class ImageDetail extends Component < IProps, {} > {
  handleSaveImg = () => {
    var image = new Image()
    image.setAttribute("crossOrigin", 'Anonymous')
    image.src = 'http://ymhx.f3322.net:8123/uploads/images/19-08-22/602254cfa30f4ee28c5d6a4f75ce5' +
        '862.png';

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

  handleTriggerModal = () => {
    const {onCancel} = this.props;
    if (onCancel) {
      onCancel()
    }
  };
  render() {
    const {imgUrl, visible} = this.props;

    return (
      <Modal
        title="二维码"
        visible={visible}
        onOk={this.handleSaveImg}
        onCancel={() => this.handleTriggerModal()}
        okText="保存为图片"
        cancelText="关闭">
        <div style={{
          textAlign: 'center'
        }}>
          <img
            src={imgUrl}
            style={{
            width: 300,
            height: 300
          }}/>
        </div>
      </Modal>
    )
  }
}

export default ImageDetail