const path = require('path')
/**
 * 获取文件名字
 * @param {*} filename
 * @returns
 */
function getFileName (filename) {
  if (!filename) {
    return "";
  }
  try {
    return filename.split(".md")[0];
  } catch (err) {
    return "";
  }
}

// 检测key是否满足条件
function CheckPMKeys (matterData) {
  // matterData.PM && matterData.DEV && matterData.QA && 
  try {
    return !!(
      matterData.Deadline
    );
  } catch (err) {
    return false
  }
}

// 处理下md的用户姓名
function handleUserName (str = '') {
  return str ? str
    .split(",")
    .filter((item) => item)
    .map((item) => item && item.trim())
    .map(item => {
      if (item === '--') {
        return item
      }
      return `@${item}`
    })
    .join(", ") : '--';
}

/**
 * 获取permalink
 * @param {*} filePath 地址
 * @returns 
 */
function getPermalink (filePath = '') {
  filePath = filePath.split(path.sep)
  filePath = filePath.slice(filePath.lastIndexOf('docs') + 1)

  if (['zh'].includes(filePath[0])) {
    filePath.shift()
  }

  filePath = filePath.map(item => {
    const itemArr = item.split('-')
    if (itemArr.length === 1) {
      // 只有一个的时候是不需要去掉头部的
      return item
    }
    itemArr.shift()
    return itemArr.join('-')
  })

  // 变成绝对路径
  filePath.unshift('')

  filePath = filePath.join('/')
  filePath = filePath.split('.md')[0]
  return filePath
}
/**
 * 获取permalink
 * @param {*} filePath 地址
 * @returns 
 */
function getPermalink1 (filePath = '') {
  filePath = filePath.split(path.sep)
  filePath = filePath.slice(filePath.lastIndexOf('docs') + 1)
  // 变成绝对路径
  filePath.unshift('')
  return filePath.join('/')
}



/**
* 去最后一位 \\
* 如果最后一位是 x.x.x 格式的 满足要求
* @param {*} filePath 绝对地址
* @returns Boolean
*/
function fileShouldCreateREADME (filename = '') {
  if (!filename) {
    return false;
  }
  if (["PS", "FS", "TS", "docs"].includes(filename)) {
    return false;
  }
  const filenames = filename.split("-");
  // -前面2位以上 且纯数字  同时filenames 至少2位以上
  const preTest = /^[0-9]{2,}$/.test(filenames[0]);
  if (preTest && filenames[1] && filename.length >= 2) {
    return false;
  }
  return true;
}

function getCurrnetFileName (filePath = '') {
  const filePathArr = filePath.split(path.sep).filter(Boolean)
  return filePathArr[filePathArr.length - 1]
}

function trim (str = '') {
  return str.trim()
}

// 检测下是否是语言文件夹
// 除 01-xx 以外的都是语言文件夹
function checkLocalesFilename (filename) {
  return ['zh'].includes(filename)
}

module.exports = {
  getFileName,
  CheckPMKeys,
  handleUserName,
  getPermalink,
  fileShouldCreateREADME,
  getCurrnetFileName,
  trim,
  checkLocalesFilename,
  getPermalink1
};
