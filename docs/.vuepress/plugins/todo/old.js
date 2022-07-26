// 实现todo样式 自己实现的
module.exports = function (md, config) {
    md.renderer.rules.bullet_list_open = (tokens, idx, options, env, self) => {
        const parentToken = tokens[idx]
        const contentToken = tokens[idx + 3]
        const needDisabledAddInput = contentToken.content.startsWith('[x] ')
        const needAddInput = contentToken.content.startsWith('[ ] ')
        if (needDisabledAddInput || needAddInput) {
            // 先给li 增加一个标签
            parentToken.attrs = [['class', 'todo-list']]
        }
        return self.renderToken(tokens, idx, options, env);
    }
    md.renderer.rules.list_item_open = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const contentToken = tokens[idx + 2]
        const needDisabledAddInput = contentToken.content.startsWith('[x] ')
        const needAddInput = contentToken.content.startsWith('[ ] ')
        if (needDisabledAddInput || needAddInput) {
            // 先给li 增加一个标签
            token.attrs = [['class', 'todo-list-item']]
            // 处理内容
            contentToken.content = contentToken.content.slice(4)
            contentToken.children[0].content = contentToken.children[0].content.slice(4)
            tokens.splice(idx + 1, 1, {
                attrs: null,
                block: false,
                content: '',
                hidden: false,
                children: [{
                    attrs: [[
                        'type',
                        'checkbox'
                    ], [
                        'class',
                        'todo-list-checkbox'
                    ], needDisabledAddInput ? ['checked', 'checked'] : [], needDisabledAddInput ? [
                        'disabled',
                        'disabled'
                    ] : []],
                    block: false,
                    content: '',
                    hidden: false,
                    info: '',
                    leavel: 1,
                    map: [],
                    markup: null,
                    meta: null,
                    nesting: 0,
                    tag: 'input',
                    type: 'ys_todo_input'
                }, {
                    attrs: null,
                    block: false,
                    content: '',
                    hidden: false,
                    info: '',
                    leavel: 1,
                    map: [],
                    markup: null,
                    meta: null,
                    nesting: -1,
                    tag: 'input',
                    type: 'ys_todo_input'
                }],
                info: '',
                leavel: 1,
                map: [],
                markup: null,
                meta: null,
                nesting: 0,
                tag: 'input',
                type: 'inline'
            })
        }
        return self.renderToken(tokens, idx, options, env);
    }
}