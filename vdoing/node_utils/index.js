const fs = require("fs"); // 文件模块
const path = require("path"); // 路径模块
const matter = require("gray-matter"); //
const jsonToYaml = require('json2yaml')
const os = require("os");
const { checkLocalesFilename, getPermalink1, getPermalink, fileShouldCreateREADME, getCurrnetFileName } = require("./modules/filename");

const FILE_NAME = 'README.md' // readme.md文件
const LOCALES = require('../page-locales/index')
const cwd = process.cwd()
/**
 * 三合一操作，遍历一次
 * 1. 检测是否需要readme文件
 * 2. 设置Frontmatter 数据
 * 3. 返回SideBar
 * @param {*} sourceDir docs根目录
 * @param {*} themeConfig 主题配置
 */
function createREADMEFileAndSetFrontmatterAndGetSideBar (sourceDir, themeConfig) {
    const sidebarData = {};

    let files = fs.readdirSync(sourceDir);

    // 先忽略vuepress @pages
    files = files.filter((item) => ![".vuepress"].includes(item));

    const currentFileName = getCurrnetFileName(sourceDir)

    const { sidebar } = handleFileAndGetSideBar(sourceDir, files, currentFileName);

    const en = sidebar.filter(toc => !toc.title || !checkLocalesFilename(toc.title))

    sidebar.forEach(toc => {
        if (toc.title && checkLocalesFilename(toc.title)) {
            sidebarData[`/${path.basename(toc.title)}/`] = toc.children;
        }
    })

    sidebarData['/'] = en

    return {
        sidebarData,
        simpledSidebarData: simplifySidebarData(sidebarData)
    }
}

// 进入到PS TS FS 目录
function handleFileAndGetSideBar (sourceDir, files, currentFileName) {
    const sidebar = []; // 结构化文章侧边栏数据
    // 检测readme存在
    files = files.includes(FILE_NAME) ? files.filter((item) => item !== FILE_NAME) : files;
    /**--------files 无 readme文件-------*/

    files.forEach((item) => {
        const filePath = path.join(sourceDir, item);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const readmePath = filePath + path.sep + "README.md";
            const hasReadme = fs.existsSync(readmePath) && !readmePath.includes('zh'+ path.sep + "README.md")
            // 如果存在README 则需要读取内容的Permalink
            let directoryPath = null
            if (hasReadme) {
                const fileContent = fs.readFileSync(readmePath, "utf8");
                const { data: matterData } = matter(fileContent, {});
                directoryPath = matterData.permalink
                if(!directoryPath){
                    directoryPath = getPermalink(filePath)
                }
                // 需要改动下readme的内容
                fs.writeFileSync(readmePath,`---\npermalink: ${directoryPath}\n---\n`+ fileContent);
            }
            // 如果是文件夹 则进行递归
            const res = handleFileAndGetSideBar(filePath, fs.readdirSync(filePath), item)
            // 需要处理下文件名称
            const itemArr = item.split('-')
            if (itemArr.length > 1) {
                itemArr.shift()
            }
            const fullFile = path.sep + 'docs' + path.sep
            // 需要截取docs目录后面那一串
            const itemStr = longestMatch(filePath.slice(cwd.length + fullFile.length))
            if(res.sidebar.length && hasReadme && directoryPath){
                res.sidebar.push([getPermalink1(readmePath), itemStr, directoryPath]) 
            }
            res.sidebar.length && sidebar.push({
                title: itemStr,
                collapsable: true,
                path: directoryPath,
                children: res.sidebar
            })
            return false
        }

        if (!item.endsWith('.md')) {
            return false;
        }

        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data: matterData, content } = matter(fileContent, {});
        let title = matterData.title || item.split('.md')[0]

        // 首先检测下 title 是否存在
        if (!title) {
            throw new Error("文件：" + filePath + "的title 属性缺失")
        }

        // 除非title不存在,否则都需要处理
        let permalink = matterData.permalink || getPermalink(filePath)
        sidebar.push([getPermalink1(filePath), title, permalink])

        if (!matterData.permalink && permalink) {
            // 如果没有permalink 则需要回写到md中
            matterData.permalink = permalink
            const newFileContent = jsonToYaml.stringify(matterData).replace(/\n\s{2}/g, "\n").replace(/"/g, "") + '---' + os.EOL + content;
            // 把地址写入文件内
            fs.writeFileSync(filePath, newFileContent);
        }
    })

    return {
        sidebar
    }
}

// zh\01-about 01-about
function longestMatch (filePath) {
    let lang
    let current = 0
    if (Object.prototype.hasOwnProperty.call(LOCALES, filePath.split(path.sep)[0])) {
        // 非 zh
        lang = filePath.split(path.sep)[0]
        current = 1;

        if (filePath.split(path.sep).length === 1) {
            // 如果是语言，且只有一个的时候，直接返回
            return filePath
        }
    } else {
        // en
        lang = 'en'
        current = 0
    }

    const itemArr = filePath.split(path.sep).slice(current).map(path => {
        const pth = path.split('-')
        if (pth.length > 1) {
            pth.shift()
        }
        return pth.join('-')
    }).map((item, index, _this) => {
        const str = _this.slice(0, index + 1).join('/')
        // 先从根路径寻找全路径，然后再找本身翻译，最后返回自身
        return LOCALES[lang][str] || LOCALES[lang][item] || item
    })

    // 返回最后一项元素
    return itemArr[itemArr.length - 1]
}

// 简化sidebarData数据
function simplifySidebarData (sidebarData) {
    const result = {}
    Object.keys(sidebarData).forEach(key => {
        result[key] = []
        loop(sidebarData[key])
        function loop (array) {
            array.forEach(sider => {
                if ('path' in sider) {
                    if (sider.path) {
                        result[key].push({
                            old: sider.path,
                            new: sider.path
                        })
                    }
                    loop(sider.children)
                } else {
                    result[key].push({
                        old: sider[0],
                        new: sider[2]
                    })
                }
            })
        }
    })
    return result
}

module.exports = {
    createREADMEFileAndSetFrontmatterAndGetSideBar
}
