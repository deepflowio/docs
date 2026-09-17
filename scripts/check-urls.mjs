// 构建后校验:对比 VitePress 生成的 sitemap 与迁移基线,确认 URL 全部保持。
//
// 用法:pnpm build && node scripts/check-urls.mjs
// (可选参数:sitemap 路径,默认 dist/sitemap.xml)
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from './lib/corpus.mjs'

const sitemapPath = path.join(ROOT, process.argv[2] || 'dist/sitemap.xml')
const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/baseline-urls.json'), 'utf8'))

if (!fs.existsSync(sitemapPath)) {
  console.error(`未找到 ${path.relative(ROOT, sitemapPath)},请先执行构建`)
  process.exit(1)
}

// 从 <loc>...</loc> 提取站点绝对路径,去掉 hostname 与 /docs/ base
const locs = [...fs.readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  ([, loc]) => loc.replace(/^https?:\/\/[^/]+/, '').replace(/^\/docs\/?/, '').replace(/\/$/, '')
)
const live = new Set(locs.filter(Boolean))

const missing = []
for (const { url, en, zh } of baseline) {
  if (en && !live.has(url)) missing.push(`[en] ${url}`)
  if (zh && !live.has(`zh/${url}`)) missing.push(`[zh] zh/${url}`)
}

if (missing.length) {
  console.error(`缺失 ${missing.length} 个预期 URL:`)
  for (const m of missing) console.error('  ' + m)
  process.exit(1)
}
console.log(`URL 校验通过:基线 ${baseline.length} 个页面(en/zh 共 ${baseline.length * 2} 项)全部在 sitemap 中`)
