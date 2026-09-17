// 语料库工具:收集中英两棵内容树的 URL 映射,供 gen-rewrites / check-urls
// 及 .vitepress/markdown/legacy-links.ts(渲染期链接适配)共用。
// URL 模型:英文页 = permalink 原样;中文页 = permalink 加 /zh/ 前缀。
//
// 注意:本模块会被 esbuild 打包进 VitePress 配置(临时文件),不能用
// import.meta.dirname 推导仓库根;所有入口(dev/build/脚本)均从仓库根启动,
// 用 process.cwd() 定位。
import fs from 'node:fs'
import path from 'node:path'

export const ROOT = process.cwd()

export function parseFrontmatter(file) {
  const m = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const out = {}
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w+):\s*(.*)$/)
      if (kv) out[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
    }
  }
  return out
}

export function permalinkToUrl(permalink) {
  return permalink.trim().replace(/^\/+|\/+$/g, '')
}

function walkMd(dir, filter = () => true) {
  const result = []
  if (!fs.existsSync(dir)) return result
  for (const name of fs.readdirSync(dir).sort()) {
    if (!filter(name)) continue
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) result.push(...walkMd(full, filter))
    else if (name.endsWith('.md')) result.push(full)
  }
  return result
}

/**
 * 英文源树:CI 合并后位于 docs/<编号目录>,本地提交态回退到 translate/translated
 */
export function enTreeRoot() {
  return fs.existsSync(path.join(ROOT, 'docs/01-about'))
    ? path.join(ROOT, 'docs')
    : path.join(ROOT, 'translate/translated')
}

/**
 * @returns {{ enMap: Map<string,string>, zhMap: Map<string,string> }}
 *   url(无前后斜杠,如 'about/overview') -> srcDir 相对源文件路径
 *
 * 数据来源为 .vitepress/rewrites.generated.json(单一事实来源,反查其映射):
 *   - 本仓库提交态的该文件由 scripts/gen-rewrites.mjs 生成,内容与逐文件解析
 *     permalink 等价;
 *   - 企业版(df-help)构建时会在合并内容后重新生成该文件,额外包含大量无
 *     permalink 的历史页面(按去编号目录路径推导 URL),本函数随之自动覆盖,
 *     使 legacy-links 对这些页面的链接也能解析。
 */
export function collectMaps() {
  const enMap = new Map()
  const zhMap = new Map()

  const rewrites = JSON.parse(
    fs.readFileSync(path.join(ROOT, '.vitepress/rewrites.generated.json'), 'utf8')
  )
  for (const [src, target] of Object.entries(rewrites)) {
    const isZh = target.startsWith('zh/')
    const url = target.replace(/^zh\//, '').replace(/\.md$/, '')
    const map = isZh ? zhMap : enMap
    if (url && !map.has(url)) map.set(url, src)
  }

  return { enMap, zhMap }
}
