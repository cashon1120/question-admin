/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path : string) : boolean => reg.test(path);

const isAntDesignPro = () : boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
const isAntDesignProOrDev = () : boolean => {
  const {NODE_ENV} = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// 限制非法字符输入,[中文,英文,数字,_]
const legalStr = /^[A-Za-z0-9\u4e00-\u9fa5\_\#\.\.\-\·\ \:\/]+$/;
const setEnglishLevel = (level : number) => {
  let englishLevel = ''
  switch (level) {
    case 4:
      englishLevel = '四级'
      break;
    case 6:
      englishLevel = '六级'
      break;
    default:
      break;
  }
  return englishLevel
}
const setComputerLevel = (level : number) => {
  let englishLevel = ''
  switch (level) {
    case 1:
      englishLevel = '一级'
      break;
    case 2:
      englishLevel = '二级'
      break;
    case 3:
      englishLevel = '三级'
      break;
    case 4:
      englishLevel = '四级'
      break;
    default:
      break;
  }
  return englishLevel
}

// 验证电话
const checkPhone = (rule : any, value : any, callback : any) : void => {
  if (!/^1(3|4|5|7|8)\d{9}$/.test(value)) {
    callback('手机号码有误，请重填');
  } else {
    callback();
  }
}

export {
  isAntDesignProOrDev,
  isAntDesignPro,
  isUrl,
  legalStr,
  setEnglishLevel,
  setComputerLevel,
  checkPhone
};
