// 本文件用来把json txt文件从 docs下移到dist下
const fs = require('fs')
const path = require('path')

const AIM_FILE_TYPE = ['.json', '.txt', '.png', '.jpg', '.jpeg', '.svg']
const IGNORE_FILE = ['.vuepress']

// 第3个参数 源文件夹
const sourceFolder = process.argv[2] || "./docs/";
// 第四个参数 目标文件夹
const destinationFolder = process.argv[3] || "./dist/";
// 第五个参数 是否需要禁止序号 编译前是有序号的，编译后是没有序号的
const disabledCorrect = process.argv[4] || 'true'
const TARGET_FILE = path.resolve(sourceFolder);
const AIM_FILE = path.resolve(destinationFolder);

handleFile(TARGET_FILE)

function handleFile (targetFile, urlPrefix = '') {
  let files = fs.readdirSync(targetFile)
  // 忽略 忽略的文件目录
  files = files.filter((item) => !IGNORE_FILE.includes(item));

  files.forEach((item) => {
    const filePath = path.join(targetFile, item);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      handleFile(filePath, urlPrefix + '/' + item)
      return false
    }

    if (!AIM_FILE_TYPE.some(fileType => item.endsWith(fileType))) {
      // 没满足一个条件就忽略
      return false;
    }

    // 符合规则就拷贝一次
    reWriteFile(urlPrefix, filePath, item)
  })
}

function reWriteFile (urlPrefix, filePath, item) {
  if (disabledCorrect === 'true') {
    urlPrefix = correctUrl(urlPrefix)
  }

  // 首先要创建文件夹
  mkdirFile(urlPrefix)

  fs.copyFileSync(filePath, path.join(AIM_FILE, urlPrefix, item))

  console.log('copy success, filepath:', filePath, ', aimfile:', path.join(AIM_FILE, urlPrefix, item))
}

function mkdirFile (urlPrefix) {
  urlPrefix = urlPrefix.split("/");
  // 因为是 / 开头的 需要去掉一次
  urlPrefix.shift();
  let currentFile = ''
  urlPrefix.forEach(url => {
    currentFile += '/'
    currentFile += url
    const result = fs.existsSync(path.join(AIM_FILE, currentFile))
    if (result === false) {
      fs.mkdirSync(path.join(AIM_FILE, currentFile))
    }
  });
}

// Correct the URL and remove the serial number
// 修正url，去掉序号
function correctUrl (url) {
  return url.split("/").map(url => {
    const urls = url.split('-')
    if (urls.length >= 2) {
      urls.shift()
    }
    return urls.join('-')
  }).join('/')
}