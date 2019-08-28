import React, { PureComponent, Fragment } from 'react';
import { Upload, Icon, Modal, Button } from 'antd';
import OSS from 'ali-oss';
import styles from './index.less';

// 实例 OSS
const client = () =>
  new OSS({
    accessKeyId: 'LTAI8Zwfik2OicUs',
    accessKeySecret: 'nldeasjfaqQl2i3Zb7Kg7VqfHGuOhF',
    region: 'oss-cn-beijing',
    bucket: 'ytxresource',
  });

// 上传图片 (有 multipartUpload 和 put 两种方法, 第一种支持断点续传, 但现在上传超过100k的文件会出错,暂时没找到解决方法)
const UploadToOss = (path, file) => {
  const url = `${path}/${file.name.split('.')[0]}-${file.uid}.${file.type.split('/')[1]}`; // 上传和显示的文件名称
  return new Promise((resolve, reject) => {
    client()
      .put(url, file)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// 设置数据格式
const setFileList = (dataSource, maxImgLen) => {
  const maxLen = maxImgLen === undefined ? 1 : maxImgLen;
  const fileList = [];
  let fileListArr = [dataSource];
  if (dataSource === '' || dataSource === null || dataSource === undefined) {
    fileListArr = [];
  }
  if (maxLen === 1) {
    if (fileListArr.length > 0) {
      fileListArr = [dataSource];
    }
  } else if (maxLen > 1) {
    if (Array.isArray(dataSource)) {
      fileListArr = dataSource;
    }
  }

  // 给传进来的数据加上一个key
  fileListArr.forEach((item, index) => {
    let obj;
    if (item instanceof Object) {
      obj = item;
      if (Object.prototype.hasOwnProperty.call(item, 'uid')) obj.uid = index;
    } else {
      obj = {
        uid: index,
        url: item,
      };
    }
    fileList.push(obj);
  });
  return fileList;
};

class OssUpload extends PureComponent {
  constructor(props) {
    super(props);
    const { dataSource, maxImgLen, form, name } = props;
    const maxLen = maxImgLen === undefined ? 1 : maxImgLen;
    const fileList = setFileList(dataSource, maxImgLen);
    this.state = {
      maxImgLen: maxLen, // 上传图片最大数量
      form,
      name,
      fileList,
      loading: false,
      previewVisible: false,
      previewImage: '',
      isFirst: true,
    };
  }

  componentWillMount() {
    const { fileList } = this.state;
    this.setFormValue(fileList);
  }

  // onRef: 用于父亲组件调用本组件方法
  componentDidMount() {
    const { onRef, canDrag, onGetOss } = this.props;
    if (onRef) onRef(this);
    if (onGetOss) onGetOss(this);
    if (canDrag === 1) this.handleDrag();
  }

  // 同步更新父组件图片值
  componentWillReceiveProps(nextProps) {
    const that = this;
    const { dataSource, maxImgLen } = nextProps;
    const { isFirst } = this.state;
    const { fileList: flist } = this.state;
    let fileList = [];
    if (flist && flist.length < 1) {
      fileList = setFileList(dataSource, maxImgLen);
    } else {
      fileList = flist;
    }
    if (isFirst && fileList.length > 0) {
      this.setFormValue(fileList);
      this.setState({
        fileList,
        isFirst: false,
      });
      setTimeout(() => that.itemAddComponent(), 1000);
    }
  }

  // 拖拽事件
  handleDrag = () => {
    let isDown = false; // mousedown 状态
    const uploadContainer = document.querySelector('.ant-upload-list');
    uploadContainer.style.position = 'relative';
    uploadContainer.onmousedown = e => {
      // 屏蔽鼠标右键和中键点击
      if (e.button !== 0) return;
      const touchdom = e.target;
      // 长按才能拖动, 以免误操作, 长按时间为 300ms
      let delayTimer = null;
      // canDrag: 是否能拖动当前目标, i svg path 当用户点击预览和删除时不执行拖动
      let canDrag =
        touchdom.nodeName !== 'i' &&
        touchdom.nodeName !== 'svg' &&
        touchdom.nodeName !== 'path' &&
        touchdom.className.indexOf('ant-upload-list-item') !== -1;
      if (!canDrag) {
        return;
      }
      const dom =
        touchdom.className.indexOf('ant-upload-list-item-info') === 0
          ? touchdom.parentNode
          : touchdom;
      // 临时占位 DIV
      const tempDiv = document.createElement('div');
      tempDiv.className = `ant-upload-list-item ${styles.tempDiv}`;
      const left = dom.offsetLeft;
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        dom.style.position = 'absolute';
        dom.style.left = `${left}px`;
        dom.style.zIndex = 9999;
        dom.style.opacity = 0.5;
        uploadContainer.insertBefore(tempDiv, dom.nextSibling);
        isDown = true;
      }, 300);
      // 获取当前拖动目标索引
      const itemList = uploadContainer.querySelectorAll('.ant-upload-list-item');
      const lists = Array.from(itemList);
      const index = lists.indexOf(dom);
      // 设置参数 direction: 拖动方向, stance: 计算位置的单位距离(目标宽度+margin距离), moveToIndex: 释放鼠标时的位置
      let direction = 'left';
      const stance = dom.offsetWidth + 8;
      let moveToIndex = null;
      const x = e.clientX;
      let lastIndex = -1;
      document.onmousemove = event => {
        if (isDown === false) {
          clearTimeout(delayTimer);
          return;
        }
        const nx = event.clientX;
        // nl: 目标被拖动位置 = 当前鼠位置 - 鼠标点击位置 + 目标初始位置
        const nl = nx - x + left;
        dom.style.left = `${nl}px`;
        if (nx < x) {
          direction = 'left';
        } else {
          direction = 'right';
        }
        // deviation: 根据拖动方向设置不同的偏移值,提高拖动的精准度
        const deviation = direction === 'left' ? 0 : stance;
        moveToIndex = Math.max(
          0,
          Math.min(lists.length, parseInt((nl + deviation + stance / 2) / stance, 10)),
        );
        // 判断位置是否有改变, 减少dom插入操作
        if (moveToIndex !== lastIndex) {
          lastIndex = moveToIndex;
          uploadContainer.insertBefore(tempDiv, itemList[moveToIndex]);
        }
      };
      document.onmouseup = () => {
        clearTimeout(delayTimer);
        if (canDrag && isDown) {
          dom.removeAttribute('style');
          uploadContainer.removeChild(tempDiv);
          if (moveToIndex !== null && moveToIndex !== index) {
            const { fileList } = this.state;
            const newFile = fileList.splice(index, 1);
            const directionIndex = direction === 'left' ? 0 : 1;
            fileList.splice(moveToIndex - directionIndex, 0, newFile[0]);
            this.setFileList(fileList);
          }
        }
        // 强制把两状态设为 false, 以防意外...
        canDrag = false;
        isDown = false;
      };
    };
  };

  // 拖拽后重新设置图片
  setFileList = newFileList => {
    const { onChangeFile } = this.props;
    const fileList = [];
    newFileList.forEach((item, index) => {
      fileList.push({
        uid: index,
        url: item.url,
      });
    });
    this.setFormValue(fileList);
    this.setState({
      fileList,
    });
    if (onChangeFile) {
      onChangeFile(fileList);
    }
  };

  // 用 Upload 的方法封装一次 OSS 上传, 以获取 file
  beforeUpload = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.setState({
      loading: true,
    });
    const { onChangeFile } = this.props;
    reader.onloadend = () => {
      // ytx --- 可以理解为对应 OSS 的存储路径
      UploadToOss('ytx', file).then(data => {
        const { fileList } = this.state;
        const newImageList = [
          ...fileList,
          { url: data.res.requestUrls[0], uid: fileList.length + 1 },
        ];
        this.state.fileList = newImageList;
        this.setFormValue(newImageList);
        this.setState({
          fileList: newImageList,
          loading: false,
        });
        if (onChangeFile) {
          onChangeFile(newImageList);
        }
        this.itemAddComponent();
      });
    };
    return false;
  };

  // 插入组建
  itemAddComponent = () => {
    const { isNeedOrder } = this.props;
    if (!isNeedOrder) {
      return;
    }
    const that = this;
    function createSelectDocument(len1) {
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      const co = `序号： <input tabIndex="${len1 +
        100}" style="width: 50px; padding-left: 3px; margin: 1px" type="number"  oninput="if(value>9) value=9; if(value<1) value=1" id=goods-vido-select-${len1} />`;
      const select = document.createElement('div');
      select.id = `goods-vido-select-${len1}`;
      const selectStyle = select.style;
      selectStyle.width = '100px';
      selectStyle.marginTop = '15px';
      selectStyle.marginLeft = '-9px';
      select.innerHTML = co;
      return select;
    }

    function handlerSelectOption(e) {
      const { fileList: picFileList } = that.state;
      const cId = e.currentTarget.id;
      const idArr = cId.split('-');
      const selId = parseInt((idArr && idArr[idArr.length - 1]) || 1, 10);
      picFileList[selId].ordNum = e.target.value;
      that.setState({ fileList: picFileList });
    }

    const videoNode = document.getElementsByClassName('ant-upload-list-item');
    let len = 0;

    while (len < videoNode.length) {
      let videoSelectNode = document.getElementById(`goods-vido-select-${len}`);
      if (!videoSelectNode) {
        videoNode[len].appendChild(createSelectDocument(len));
        videoSelectNode = document.getElementById(`goods-vido-select-${len}`);

        videoSelectNode.onchange = (e, id) => handlerSelectOption(e, id);
      }
      len += 1;
    }
  };

  // 图片预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  // 取消预览
  handleCancel = () => this.setState({ previewVisible: false });

  // 删除图片
  handleDeleteImg = file => {
    const { onChangeFile, disabled } = this.props;
    const { fileList } = this.state;
    if (disabled) return;
    const index = fileList.indexOf(file);
    const newImageList = fileList.slice();
    newImageList.splice(index, 1);
    this.setState({
      fileList: newImageList,
    });
    this.setFormValue(newImageList);
    if (onChangeFile) onChangeFile(newImageList);
  };

  // 设置表单 (maxImgLen=1 的时候传回一个字符串, maxImgLen > 1 的时候传回一个数组)
  setFormValue = newImageList => {
    const { maxImgLen, name, form } = this.state;
    let formList = [];
    if (maxImgLen > 1) {
      newImageList.forEach(item => {
        formList.push(item.url);
      });
    } else {
      formList = newImageList.length > 0 ? newImageList[0].url : '';
    }
    form.setFieldsValue({
      [name]: formList,
    });
  };

  // 重新渲染, 用于 componentWillReceiveProps, 多次编辑时有用
  setFirstStat = () => {
    this.setState({
      isFirst: true,
    });
  };

  // 清空数据
  clearOssList() {
    this.setState({
      fileList: [],
    });
  }

  render() {
    const { loading, previewVisible, previewImage, fileList, maxImgLen } = this.state;
    const { disabled, uploadTextLable, acceptType, uploadType, displayType } = this.props;
    const uploadButton = uploadType ? (
      <div>
        <Button>
          <Icon type="upload" />
          点击上传
        </Button>
      </div>
    ) : (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{uploadTextLable || '上传图片'}</div>
      </div>
    );
    const props = !uploadType
      ? {
          onRemove: file => {
            this.handleDeleteImg(file);
          },
          beforeUpload: this.beforeUpload,
          onPreview: this.handlePreview,
          fileList,
          multiple: true,
          accept: acceptType || 'image/*',
          listType: 'picture-card',
          // disabled: {disabled}
        }
      : {
          onRemove: file => {
            this.handleDeleteImg(file);
          },
          beforeUpload: this.beforeUpload,
          accept: acceptType,
          listType: null,
        };

    return (
      <Fragment>
        <div className={styles.ossContainer} style={{ display: displayType, width: '100%' }}>
          {!uploadType ? (
            <Upload {...props} disabled={disabled}>
              {fileList.length >= maxImgLen ? null : uploadButton}
            </Upload>
          ) : (
            <Upload {...props}>{uploadButton}</Upload>
          )}
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="预览" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Fragment>
    );
  }
}

export default OssUpload;
