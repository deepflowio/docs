// vdoing 时代 code-tabs 语法的运行时适配(内容文件保持原语法,不改写):
//
//   ::: code-tabs#shell
//   @tab 标题
//   ```bash
//   ...
//   ```
//   :::
//
// 转换发生在 markdown-it 解析之后的 token 层:
//   1. @tab 段落被移除,标题写入其后第一个围栏的 info(bash [标题])
//   2. 容器 token 改名为 container_code-group_*,直接复用 VitePress
//      内置 code-group 的渲染(标签页 UI、active 态、复制按钮全部原生)
import container from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'

const TAB_RE = /^@tab\s+(.+)$/

export function legacyCodeTabs(md: MarkdownIt): void {
  md.use(container as any, 'code-tabs', {
    validate: (params: string) => /^code-tabs(#[\w-]+)?\s*$/.test(params.trim())
  })

  md.core.ruler.push('legacy_code_tabs', (state) => {
    const tokens = state.tokens
    const removals: number[] = []

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'container_code-tabs_open') continue

      let title: string | null = null
      let j = i + 1
      for (; tokens[j].type !== 'container_code-tabs_close'; j++) {
        const t = tokens[j]
        // @tab 行解析为 paragraph_open + inline + paragraph_close
        if (t.type === 'paragraph_open' && tokens[j + 1]?.type === 'inline') {
          const m = tokens[j + 1].content.match(TAB_RE)
          if (m) {
            title = m[1].trim()
            removals.push(j, j + 1, j + 2)
            j += 2
            continue
          }
        }
        if (t.type === 'fence' && title !== null) {
          t.info = `${t.info.trim()} [${title}]`
          title = null
        }
      }

      // 交给 VitePress 内置 code-group 渲染规则接管
      tokens[i].type = 'container_code-group_open'
      tokens[j].type = 'container_code-group_close'

      i = j
    }

    for (const idx of removals.sort((a, b) => b - a)) tokens.splice(idx, 1)
  })
}
