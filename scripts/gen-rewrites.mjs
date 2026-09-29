// 生成 VitePress rewrites 映射与迁移基线数据(无第三方依赖)。
//
// 数据来源:
//   1. translate/translated/**.md   英文源树(CI 构建时会被 mv 进 docs/,此脚本在提交态直接读取)
//   2. docs/zh/**.md                中文源树
//   3. downloadFile.json            CI 构建时额外下载生成的页面(如 Agent 配置页)
//
// URL 模型(与线上现状保持一致):
//   - 英文页 = permalink 原样(根路径 clean URL,如 /docs/about/overview)
//   - 中文页 = permalink 加 /zh/ 前缀(如 /docs/zh/about/overview)
//     (现状:中英同 permalink 互相覆盖、中文不可达;加前缀后两种语言都可达)
//
// 输出:
//   .vitepress/rewrites.generated.json  VitePress rewrites(srcDir 相对路径 -> 目标路径)
//   scripts/baseline-urls.json          URL 基线(重写后校验用)
//   nginx/zh-only-redirects.conf        仅中文页面的旧 URL -> /zh/ 新 URL 的 301
//
// 用法:node scripts/gen-rewrites.mjs

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const EN_DIR = path.join(ROOT, 'translate/translated')
const ZH_DIR = path.join(ROOT, 'docs/zh')
const DOWNLOAD_JSON = path.join(ROOT, 'downloadFile.json')

/** 解析 frontmatter 中的简单字符串字段(本项目 frontmatter 只有 title/permalink) */
function parseFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8')
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const out = {}
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w+):\s*(.*)$/)
      if (kv) out[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
    }
  }
  return out
}

/** permalink -> rewrites 目标段:/about/overview/ -> about/overview.md */
function permalinkToTarget(permalink) {
  return permalink.trim().replace(/^\/+|\/+$/g, '') + '.md'
}

function walkMd(dir, base = dir) {
  const result = []
  if (!fs.existsSync(dir)) return result
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) result.push(...walkMd(full, base))
    else if (name.endsWith('.md')) result.push(full)
  }
  return result
}

// ---- 收集两种语言的 URL 映射 ----------------------------------------------
// urlMap: clean url(无前后斜杠,如 'about/overview') -> { file, title }
function collectMap(dir, prefix) {
  const map = new Map()
  for (const file of walkMd(dir)) {
    const rel = path.relative(dir, file).split(path.sep).join('/')
    if (rel === 'README.md' || rel === 'index.md') continue // 首页单独处理
    const fm = parseFrontmatter(file)
    if (!fm.permalink) {
      console.warn(`[warn] 无 permalink,跳过: ${prefix}${rel}`)
      continue
    }
    const url = permalinkToTarget(fm.permalink).replace(/\.md$/, '')
    if (map.has(url)) throw new Error(`permalink 重复: ${url} (${map.get(url).file} 与 ${file})`)
    map.set(url, { file: `${prefix}${rel}`, title: fm.title || '' })
  }
  return map
}

const enMap = collectMap(EN_DIR, '')
const zhMap = collectMap(ZH_DIR, 'zh/')

// ---- downloadFile.json:CI 构建时下载生成的额外页面 -------------------------
if (fs.existsSync(DOWNLOAD_JSON)) {
  for (const { output, meta } of JSON.parse(fs.readFileSync(DOWNLOAD_JSON, 'utf8'))) {
    const rel = output.replace(/^\.\//, '').replace(/^docs\//, '')
    const url = permalinkToTarget(meta.permalink).replace(/\.md$/, '')
    const target = rel.startsWith('zh/') ? zhMap : enMap
    if (target.has(url)) {
      if (target.get(url).file !== rel) {
        console.warn(`[warn] downloadFile.json 覆盖已有映射: ${url} -> ${rel}`)
      }
    }
    target.set(url, { file: rel, title: meta.title || '' })
  }
}

// ---- 生成 rewrites ---------------------------------------------------------
const rewrites = {}
for (const [url, { file }] of enMap) rewrites[file] = `${url}.md`
for (const [url, { file }] of zhMap) rewrites[file] = `zh/${url}.md`

const targets = new Map()
for (const [src, dst] of Object.entries(rewrites)) {
  if (targets.has(dst)) throw new Error(`目标路径重复: ${dst}(${targets.get(dst)} 与 ${src})`)
  targets.set(dst, src)
}

fs.mkdirSync(path.join(ROOT, '.vitepress'), { recursive: true })
fs.writeFileSync(
  path.join(ROOT, '.vitepress/rewrites.generated.json'),
  JSON.stringify(rewrites, null, 2) + '\n'
)

// ---- URL 基线 --------------------------------------------------------------
const baseline = [...new Set([...enMap.keys(), ...zhMap.keys()])]
  .sort()
  .map((url) => ({
    url,
    en: enMap.get(url)?.file || null,
    zh: zhMap.get(url)?.file || null,
    // 迁移后该 URL 上实际提供的语言(zh-only 页面迁往 /zh/,根路径由 301 兜底)
    liveAt: enMap.has(url) ? 'root' : 'redirect-to-zh'
  }))
fs.mkdirSync(path.join(ROOT, 'scripts'), { recursive: true })
fs.writeFileSync(
  path.join(ROOT, 'scripts/baseline-urls.json'),
  JSON.stringify(baseline, null, 2) + '\n'
)

// ---- 仅中文页面的旧 URL 301 ------------------------------------------------
const zhOnly = baseline.filter((b) => b.liveAt === 'redirect-to-zh')
const conf = [
  '# 本文件由 scripts/gen-rewrites.mjs 生成,勿手改。',
  '# 仅中文版本(暂无英文翻译)的页面:旧根路径 URL -> /zh/ 新路径。',
  '# 注意:rewrite 不能出现在 http 上下文,本文件须由 server 块 include',
  '# (见 nginx/default.conf 与 Dockerfile),不能放进 /etc/nginx/conf.d/。',
  ...zhOnly.map(
    ({ url }) =>
      `rewrite ^/docs/${url}/?$ /docs/zh/${url}? permanent;\nrewrite ^/docs/${url}\\.html$ /docs/zh/${url}? permanent;`
  ),
  ''
].join('\n')
fs.writeFileSync(path.join(ROOT, 'nginx/zh-only-redirects.conf'), conf)

console.log(
  `EN 页面: ${enMap.size},ZH 页面: ${zhMap.size},rewrites: ${Object.keys(rewrites).length},` +
    `zh-only 重定向: ${zhOnly.length}`
)
