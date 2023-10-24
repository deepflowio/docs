// 自动补全相对路径
const ignoreFileSuffix = ['.pcap']
module.exports = function (md, config) {
    const original = md.renderer.rules.link_open
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const { relativePath } = env
        if (relativePath) {
            const token = tokens[idx]
            const hrefIndex = token.attrIndex('href')
            if (hrefIndex >= 0) {
                const link = token.attrs[hrefIndex]
                const href = link[1]
                const isExternal = /^https?:/.test(href)
                /**
                 * 1. 不是https/http
                 * 2. 不是#开头
                 * 3. 不是/开头
                 * 4. 非ignoreFileSuffix忽略的文件后缀
                 */
                if (!isExternal && !href.startsWith('#') && !href.startsWith('/') && !ignoreFileSuffix.some(etx => href.endsWith(etx))) {
                    // 需要去掉目录的序号 01-about=>about
                    const relativePaths = relativePath.split('/').map(key => {
                        const pth = key.split('-')
                        if (pth.length > 1) {
                            pth.shift()
                        }
                        return pth.join('-')
                    })
                    // 最后一层（文件名称）去掉 
                    // ./A/ 是寻找当前文件(B)的上一级目录下的A，故需要去掉B这一层
                    relativePaths.pop();
                    // 第一个插入空元素
                    relativePaths.unshift('');
                    const hrefs = href.split('/');
                    hrefs.forEach(element => {
                        if (element === '..') {
                            relativePaths.pop()
                            return
                        }
                        if (element !== '.') {
                            relativePaths.push(element)
                        }
                    });
                    link[1] = addSuffixAndCheckValidUrl(relativePaths.join('/'), options.sidebar, '/', { relativePath, idx })
                }
            }
        }

        return original.call(null, tokens, idx, options, env, self)
    }
}

/**
 * 自动补全/ 以及判断是否是一个有效的地址
 * 有效理由：现有的页面列表中存在当前地址
 * @param { string} url 
 * @param { array} sidebar 
 * @param { string} suffix 
 */
function addSuffixAndCheckValidUrl (url = '', sidebar = {}, suffix = '/', { relativePath, idx } = {}) {
    const totalPage = []
    Object.keys(sidebar).map(key => {
        sidebar[key].forEach(path => {
            if(!path.new){
                return false
            }
            // 补全 / 后缀
            let newPath = path.new.endsWith(suffix) ? path.new : path.new + suffix
            // 去掉第一个 / 然后添加语言
            newPath = key + newPath.slice(1)
            totalPage.push(newPath)
        })
    })
    let reallyUrl = url.split('?')[0].split('#')[0]
    // url的其他数据
    const otherUrl = url.split(reallyUrl)[1] || ''
    // 如果不是/结尾的，补充一下
    reallyUrl = reallyUrl.endsWith(suffix) ? reallyUrl : reallyUrl + suffix
    // 补充以后还找不到链接，那么就是无效的地址
    if (!totalPage.includes(reallyUrl)) {
        console.log('当前sidebar==', JSON.stringify(sidebar))
        console.log('当前页面地址==', totalPage)
        console.log('无效的目的页面地址==', reallyUrl)
        console.log('md==', relativePath)
        throw new Error('无效的目的页面地址')
    }
    return reallyUrl + otherUrl
}