import React, { PureComponent, Fragment, message } from 'react';
import { Upload, Icon, Modal } from 'antd';
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
const setFileList = dataSource => {
  const fileList = [];
  // 给传进来的数据加上一个key
  if (dataSource) {
    dataSource.forEach((item, index) => {
      let obj;
      if (item instanceof Object) {
        obj = item;
        if (!Object.prototype.hasOwnProperty.call(item, 'uid')) obj.uid = index;
      } else {
        obj = {
          uid: index,
          url: item,
        };
      }
      fileList.push(obj);
    });
  }
  return fileList;
};
// const setFileList = (dataSource, maxImgLen) => {
//   const maxLen = maxImgLen === undefined ? 1 : maxImgLen;
//   const fileList = [];
//   let fileListArr = [dataSource];
//   if (dataSource === '' || dataSource === null || dataSource === undefined) {
//     fileListArr = [];
//   }
//   if (maxLen === 1) {
//     if (fileListArr.length > 0) {
//       fileListArr = [dataSource];
//     }
//   } else if (maxLen > 1) {
//     if (Array.isArray(dataSource)) {
//       fileListArr = dataSource;
//     }
//   }
//   // 给传进来的数据加上一个key
//   fileListArr.forEach((item, index) => {
//     fileList.push({
//       uid: index,
//       url: item,
//     });
//   });
//   return fileList;
// };

class OssUploadVideo extends PureComponent {
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
    const { onRef } = this.props;
    if (onRef) onRef(this);
  }

  // 同步更新父组件图片值
  componentWillReceiveProps(nextProps) {
    const { dataSource, maxImgLen } = nextProps;
    const { isFirst } = this.state;

    const { fileList: flist } = this.state;
    let fileList = [];
    if (flist && flist.length < 1) {
      fileList = setFileList(dataSource, maxImgLen);
    } else {
      fileList = flist;
    }

    // const fileList = setFileList(dataSource, maxImgLen);
    if (isFirst && fileList.length > 0) {
      this.setFormValue(fileList);
      this.setState({
        fileList,
        isFirst: false,
      });
      this.itemAddComponent();
    }
  }

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
        this.setFormValue(newImageList);
        this.setState({
          fileList: newImageList,
          loading: false,
        });
        onChangeFile(newImageList);
        this.itemAddComponent();
      });
    };
    return false;
  };

  // 插入组建
  itemAddComponent = () => {
    const that = this;
    const { fileList } = this.state;
    function createSelectDocument(len1) {
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      const co = `<select id=goods-vido-select-${len1}>
          <option key="${len1}op1" value="1">细节</option>
          <option key="${len1}op2" value="2">模特</option>
          <option key="${len1}op2" value="3">细节2</option>
      </select>`;
      const select = document.createElement('select');
      select.id = `goods-vido-select-${len1}`;
      const selectStyle = select.style;
      selectStyle.width = '103.5px';
      selectStyle.marginTop = '5px';
      selectStyle.marginLeft = '-9px';
      select.innerHTML = co;
      return select;
    }

    const videoNode = document.getElementsByClassName('ant-upload-list-item');
    let len = 0;

    while (len < videoNode.length) {
      let videoSelectNode = document.getElementById(`goods-vido-select-${len}`);
      if (!videoSelectNode) {
        videoNode[len].appendChild(createSelectDocument(len));
        videoSelectNode = document.getElementById(`goods-vido-select-${len}`);
        const typeId = (fileList[len] && fileList[len].classTypeId) || 1;

        if (typeId > 1 && typeId <= 3 && videoSelectNode.options[typeId - 1]) {
          videoSelectNode.options[typeId - 1].selected = true;
        }

        videoSelectNode.onchange = function handlerSelectOption() {
          const { fileList: viedoFileList } = that.state;
          const option = this.options;
          const index = option && option.selectedIndex;
          const vl = this.options[index].value;
          const selArrId = this.id.split('-');
          const selId = parseInt((selArrId && selArrId[selArrId.length - 1]) || 0, 10);
          viedoFileList.forEach(ele => {
            if (ele.classTypeId === vl) {
              message.info('视频类型不能重复');
            }
          });
          // if(canChoose) {
          viedoFileList[selId].classTypeId = vl;
          that.setState({ fileList: viedoFileList });
          // }
        };
      }
      len += 1;
    }
  };

  // 视频预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  // 取消预览
  handleCancel = () => this.setState({ previewVisible: false });

  // 删除
  handleDeleteImg = file => {
    const { fileList } = this.state;
    const { onChangeFile } = this.props;
    const index = fileList.indexOf(file);
    const newImageList = fileList.slice();
    newImageList.splice(index, 1);
    this.setState({
      fileList: newImageList,
    });
    onChangeFile(newImageList);
    this.setFormValue(newImageList);
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

  render() {
    const { loading, previewVisible, previewImage, fileList, maxImgLen } = this.state;
    const { uploadTextLable, acceptType } = this.props;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{uploadTextLable || '上传图片'}</div>
      </div>
    );
    const props = {
      onRemove: file => {
        this.handleDeleteImg(file);
      },
      beforeUpload: this.beforeUpload,
      onPreview: this.handlePreview,
      fileList,
      accept: acceptType || 'video/mp4',
      listType: 'picture-card',
      // onChange: this.handleChnage
    };
    return (
      <Fragment>
        <div className={styles.ossContainer}>
          <Upload {...props}>{fileList.length >= maxImgLen ? null : uploadButton}</Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <video controls="controls" style={{ width: '100%' }} src={previewImage}>
              <source src={previewImage} type="video" />
              <track kind="captions" />
            </video>
          </Modal>
        </div>
      </Fragment>
    );
  }
}

export default OssUploadVideo;
