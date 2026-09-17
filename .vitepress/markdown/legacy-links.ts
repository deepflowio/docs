// vdoing 时代相对链接的运行时适配(内容文件保持原语法,不改写)。
//
// 移植自旧版 docs/.vuepress/plugins/auto-complete-url 插件:旧站链接按
// 「源文件目录(去掉数字前缀)」解析,再映射到目标页 permalink。本插件在
// 渲染期做同样的解析,并按新的双语 URL 模型输出最终地址:
//   - 中文页(docs/zh/**)上的链接 -> /zh/<permalink>
//   - 英文页(CI 合并后的 docs/<编号目录>/**)上的链接 -> /<permalink>
//   - 目标仅有另一语言版本时自动回退
//
// 解析失败仅告警并保留原链接,不阻断构建(死链检测仍会兜底)。
// 另:去掉 vdoing 图片语法 ?align=xxx 查询参数。
import type MarkdownIt from 'markdown-it'
import { collectMaps } from '../../scripts/lib/corpus.mjs'

const enMap: Map<string, string> = new Map()
const zhMap: Map<string, string> = new Map()
let mapsReady = false

function ensureMaps() {
  if (mapsReady) return
  const maps = collectMaps()
  for (const [k, v] of maps.enMap) enMap.set(k, v)
  for (const [k, v] of maps.zhMap) zhMap.set(k, v)
  mapsReady = true
}

/** 与资源后缀(含 .md/.pcap 等)的链接交给 VitePress 原生处理 */
const ASSET_RE = /\.[a-z0-9]+([?#]|$)/i

/** 源文件路径 -> 去 数字前缀 后的目录段(旧插件的解析基准) */
function strippedDir(relativePath: string): string[] {
  return relativePath
    .split('/')
    .slice(0, -1)
    .map((seg) => seg.replace(/^\d+-/, ''))
}

function resolveTarget(
  relativePath: string,
  href: string,
  indexPage = false
): string | null {
  const parts = strippedDir(relativePath)
  // README/index 页经 rewrites 折叠后,页面 URL 即其目录本身,目录层级比源
  // 文件少一段;这类页面上的首个 ../ 按旧站 URL 相对语义不应再向上弹一级
  let firstDotDot = indexPage
  for (const seg of href.split('/')) {
    if (seg === '..') {
      if (firstDotDot) {
        firstDotDot = false
        continue
      }
      parts.pop()
    } else if (seg !== '.' && seg !== '') parts.push(seg)
  }
  let url = parts.join('/')
  if (url.startsWith('zh/')) url = url.slice(3)
  if (!url) return null

  const isZhPage = relativePath.startsWith('zh/')
  if (isZhPage) {
    if (zhMap.has(url)) return '/zh/' + url
    if (enMap.has(url)) return '/' + url
  } else {
    if (enMap.has(url)) return '/' + url
    if (zhMap.has(url)) return '/zh/' + url
  }
  return null
}

/**
 * 绝对链接(/guide/x/、/zh/guide/x)的适配:
 * 旧站单树模型下绝对路径通用;新双语模型里中文页位于 /zh/ 前缀下,且尾斜杠
 * 会被 VitePress 按 <目录>/index 页解析(死链)。这里按当前页面语言补前缀,
 * 并归一化尾斜杠与 .md 后缀。企业版文档大量使用这种写法。
 */
function resolveAbsoluteTarget(relativePath: string, href: string): string | null {
  let url = href.replace(/^\/+|\/+$/g, '').replace(/\.md$/, '')
  if (url.startsWith('zh/')) url = url.slice(3)
  if (!url) return null

  const isZhPage = relativePath.startsWith('zh/')
  if (isZhPage) {
    if (zhMap.has(url)) return '/zh/' + url
    if (enMap.has(url)) return '/' + url
  } else {
    if (enMap.has(url)) return '/' + url
    if (zhMap.has(url)) return '/zh/' + url
  }
  return null
}

export function legacyLinks(md: MarkdownIt): void {
  ensureMaps()

  const prevLink = md.renderer.rules.link_open
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const i = token.attrIndex('href')
    const href = i >= 0 ? token.attrs![i][1] : ''
    const relativePath: string = env?.relativePath || ''

    if (relativePath && href && !/^(https?:|mailto:|#|\/\/)/i.test(href)) {
      // 先切出路径部分再做资源后缀判断:锚点里常出现 ".raw" 这类
      // 形似扩展名的片段(如 ../configuration/agent/#processors.xxx.raw),
      // 用完整 href 判断会把页面链接误当成资源跳过
      const qIdx = href.search(/[?#]/)
      const pathPart = qIdx === -1 ? href : href.slice(0, qIdx)
      const rest = qIdx === -1 ? '' : href.slice(qIdx)
      if (pathPart && !ASSET_RE.test(pathPart)) {
        // realPath 为 rewrites 生效前的源文件路径,据此识别 README/index 页
        const realPath: string = env?.realPath || ''
        const indexPage = /\/(README|index)\.md$/.test(realPath)
        const target = href.startsWith('/')
          ? resolveAbsoluteTarget(relativePath, pathPart)
          : resolveTarget(relativePath, pathPart, indexPage)
        if (target) {
          token.attrs![i][1] = target + rest
        } else {
          console.warn(`[legacy-links] 未解析链接,保留原样: ${relativePath}: ${href}`)
        }
      }
    }

    return prevLink
      ? prevLink(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
  }

  const prevImage = md.renderer.rules.image
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const i = token.attrIndex('src')
    if (i >= 0) {
      // vdoing 的 ?align=center 图片参数在 VitePress 下会破坏资源解析
      token.attrs![i][1] = token.attrs![i][1].replace(/\?align=[\w-]+/, '')
    }
    return prevImage
      ? prevImage(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
  }
}
