// 侧边栏生成器:在配置加载期(Node 环境)直接读取源码目录生成结构化侧边栏,
// 替代 vdoing 主题的 "structuring" 机制。排序沿用目录/文件名的数字前缀。
//
// 数据来源与 .vitepress/config.mts 的 rewrites 一致:
//   - 中文:docs/zh/**(提交态即存在)
//   - 英文:CI 构建时 translate/translated 会被合并进 docs/,故优先读 docs/
//     下的编号目录,本地 dev 回退读 translate/translated
//   - downloadFile.json 中声明的 CI 下载页面(如 Agent 配置)静态并入
import fs from 'node:fs'
import path from 'node:path'
import rewrites from './rewrites.generated.json'

const ROOT = path.resolve(import.meta.dirname, '..')

/** 分区清单:文档信息架构的唯一人工维护来源 */
const SECTIONS: Record<string, { en: string; zh: string }> = {
  '01-about': { en: 'About', zh: '关于 DeepFlow' },
  '02-ce-install': { en: 'Community Edition Installation', zh: '社区版安装' },
  '03-ee-install': { en: 'Enterprise Edition Installation', zh: '企业版安装' },
  '04-best-practice': { en: 'Best Practices', zh: '最佳实践' },
  '05-features': { en: 'Features', zh: '功能特性' },
  '06-guide': { en: 'Guide', zh: '使用指南' },
  '07-configuration': { en: 'Configuration', zh: '配置说明' },
  '08-integration': { en: 'Integration', zh: '集成' },
  '09-diagnose': { en: 'Troubleshooting', zh: '故障诊断' },
  '10-release-notes': { en: 'Release Notes', zh: '版本发布笔记' }
}

/** 常见缩写,避免 humanize 出现 "Ee Tenant" 这类展示名 */
const ACRONYMS: Record<string, string> = {
  ce: 'CE',
  ee: 'EE',
  k8s: 'K8s',
  api: 'API',
  sql: 'SQL',
  os: 'OS',
  id: 'ID',
  saas: 'SaaS'
}

interface LinkItem {
  text: string
  link: string
}
interface GroupItem {
  text: string
  collapsed: boolean
  items: (LinkItem | GroupItem)[]
}

/** 解析 frontmatter 的简单字符串字段 */
function parseFrontmatter(file: string): Record<string, string> {
  const m = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const out: Record<string, string> = {}
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w+):\s*(.*)$/)
      if (kv) out[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
    }
  }
  return out
}

/** 数字前缀排序:01-x < 02-x < ... < 99-x */
function byNumericPrefix(a: string, b: string): number {
  const na = parseInt(a.match(/^(\d+)-/)?.[1] ?? '999', 10)
  const nb = parseInt(b.match(/^(\d+)-/)?.[1] ?? '999', 10)
  return na !== nb ? na - nb : a.localeCompare(b)
}

/** 去掉数字前缀并把 kebab-case 转为首字母大写,用于目录展示名 */
function humanizeDir(name: string): string {
  return name
    .replace(/^\d+-/, '')
    .split('-')
    .map((w) => ACRONYMS[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** 源文件路径(srcDir 相对)-> 站点 URL(基于已生成的 rewrites) */
function linkFor(relPath: string): string | null {
  const target = (rewrites as Record<string, string>)[relPath]
  if (!target) return null
  return '/' + target.replace(/\.md$/, '')
}

function walkDir(dir: string, relBase: string): (LinkItem | GroupItem)[] {
  const items: (LinkItem | GroupItem)[] = []
  const entries = fs.readdirSync(dir).filter((n) => !n.startsWith('.')).sort(byNumericPrefix)
  for (const name of entries) {
    const full = path.join(dir, name)
    const rel = `${relBase}/${name}`
    if (fs.statSync(full).isDirectory()) {
      const children = walkDir(full, rel)
      if (children.length) items.push({ text: humanizeDir(name), collapsed: true, items: children })
      continue
    }
    if (!name.endsWith('.md') || name === 'README.md' || name === 'index.md') continue
    const link = linkFor(rel)
    if (!link) {
      console.warn(`[sidebar] 无 rewrites 映射,跳过: ${rel}`)
      continue
    }
    const title = parseFrontmatter(full).title || humanizeDir(name.replace(/\.md$/, ''))
    items.push({ text: title, link })
  }
  return items
}

function buildSidebar(treeRoot: string, prefix: string, lang: 'en' | 'zh'): GroupItem[] {
  const result: GroupItem[] = []
  for (const [dir, labels] of Object.entries(SECTIONS)) {
    const sectionDir = path.join(treeRoot, dir)
    if (!fs.existsSync(sectionDir)) continue
    const items = walkDir(sectionDir, `${prefix}${dir}`)
    if (items.length) result.push({ text: labels[lang], collapsed: true, items })
  }
  return result
}

/** downloadFile.json 声明的 CI 下载页面静态并入(本地 dev 时文件尚不存在) */
function mergeDownloadedPages(items: GroupItem[]): void {
  const jsonPath = path.join(ROOT, 'downloadFile.json')
  if (!fs.existsSync(jsonPath)) return
  for (const { output, meta } of JSON.parse(fs.readFileSync(jsonPath, 'utf8'))) {
    const rel = output.replace(/^\.\//, '').replace(/^docs\//, '')
    const section = rel.replace(/^zh\//, '').split('/')[0]
    let group = items.find((g) => g.text === SECTIONS[section]?.en || g.text === SECTIONS[section]?.zh)
    if (!group) {
      group = { text: SECTIONS[section]?.en ?? section, collapsed: true, items: [] }
      items.push(group)
    }
    const link = linkFor(rel)
    if (!link) continue
    group.items.push({ text: meta.title || humanizeDir(path.basename(rel)), link })
  }
}

// 英文源树:CI 合并后位于 docs/<编号目录>,本地 dev 时回退到 translate/translated
const enRoot = fs.existsSync(path.join(ROOT, 'docs/01-about'))
  ? path.join(ROOT, 'docs')
  : path.join(ROOT, 'translate/translated')

const enSidebar = buildSidebar(enRoot, '', 'en')
mergeDownloadedPages(enSidebar)
const zhSidebar = buildSidebar(path.join(ROOT, 'docs/zh'), 'zh/', 'zh')
mergeDownloadedPages(zhSidebar)

export const sidebar = {
  '/zh/': zhSidebar,
  '/': enSidebar
}
