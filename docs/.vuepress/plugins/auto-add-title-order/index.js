// 自动补全title序号
module.exports = function (md, config) {
    const cacheTitleOrder = []
    let latest = ''
    md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
        const { relativePath } = env
        if (!relativePath) {
            return self.renderToken(tokens, idx, options, env);
        }
        if (relativePath !== latest) {
            latest = relativePath
            cacheTitleOrder.splice(0, cacheTitleOrder.length)
        }
        /**
         * 找到这个，然后把idx+1的xx内容修改为1.xx
         * 1. 找到token，并解析出级别，级别需要-1，从0开始
         * 2. 如果当前级别存在，则+1，同时清空cacheTitleIndex leavel后面的数据;不存在则赋值为1
         */
        const token = tokens[idx]
        let [, leavel] = token.tag.split('')
        leavel = leavel - 1; // 
        if (cacheTitleOrder[leavel]) {
            cacheTitleOrder[leavel] = cacheTitleOrder[leavel] + 1
            // 后面的清除掉
            cacheTitleOrder.splice(leavel + 1, cacheTitleOrder.length - leavel)
        } else {
            do {
                cacheTitleOrder[leavel--] = 1
            } while (!cacheTitleOrder[leavel] && leavel >= 0)
        }

        const _cacheTitleOrder = cacheTitleOrder.filter(Boolean) // [null, 1]

        const currentLeavel = _cacheTitleOrder.join('.') + (_cacheTitleOrder.length === 1 ? '. ' : ' ') // 1. 2.2
        const nextToken = tokens[idx + 1]
        nextToken.content = currentLeavel + nextToken.content
        nextToken.children[nextToken.children.length - 1].content = currentLeavel + nextToken.children[nextToken.children.length - 1].content

        return self.renderToken(tokens, idx, options, env);
    }
}