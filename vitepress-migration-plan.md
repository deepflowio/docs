# DeepFlow 文档站改造方案:VuePress 1 + vdoing → VitePress

> 调研基准日期:**2026-09-17**。文中所有版本号、能力、配置写法均以当日 VitePress 官方文档(vitepress.dev)、官方 CHANGELOG(github.com/vuejs/vitepress)及各插件官方文档为准。本仓库为 `deepflow-websites/docs`(下称"仓库根")。

---

## 1. TL;DR

| 项 | 结论 |
|---|---|
| 目标框架 | **VitePress 1.6.4(当前最新稳定版)**,Vue 3 + Vite 5,Node 18+ |
| 为什么不是 2.0 | VitePress 2.0 仍处于 alpha(最新 `2.0.0-alpha.20`,2026-09-04,基于 Vite 8、要求 Node 22+),生产文档站不跟 alpha;本方案附录给出 1.x→2.0 的升级预告 |
| 主题 | **移除 vdoing,改用官方默认主题 + 轻量扩展**(`.vitepress/theme/`):页脚备案、图片缩放、中文文案 |
| URL | **180 个内容页 URL 100% 保持不变**:内容文件原样不动,用官方 `rewrites` 能力由脚本从现有 `permalink` frontmatter 生成映射 |
| 内容改动量 | 极小:18 处 `code-tabs` 转 `code-group`、2 个首页 frontmatter 重写;`tip/warning` 容器、任务列表、脚注语法天然兼容 |
| 高级能力 | 内置容器(tip/info/warning/danger/details)、**自定义容器**(markdown-it-container)、GFM Alerts、代码组、Shiki 高亮、代码导入、数学公式等,详见 §5 |
| 搜索 | 官方本地搜索(minisearch)+ `Intl.Segmenter` 中文分词,替代自研 FlexSearch 插件 |
| Mermaid | `vitepress-plugin-mermaid` + mermaid 11,替代 mermaid 8.14 自研插件 |
| 工程化 | CI Node 12→22、pnpm 6→10,去掉 `--openssl-legacy-provider`;构建产物仍输出 `dist/`,Dockerfile 基本不动 |
| 预估工作量 | 骨架 + codemod + 验证约 **3~5 人日**,分 6 个阶段(§9) |

---

## 2. 现状盘点(迁移基线)

### 2.1 技术栈现状

- **VuePress 1.9.7**(Vue 2 + webpack 4),非 VitePress;主题为本地魔改的 `vuepress-theme-vdoing`(仓库根 `vdoing/` 目录,约 20 个子目录:layouts、global-components、styles、locales 等)。
- CI 使用 **Node 12 + pnpm 6**,构建命令带 `--openssl-legacy-provider`(OpenSSL 3 兼容 hack)和 `--max-old-space-size=4096 --max-concurrency=500`(webpack 构建慢、内存压力大的补丁)。
- `package.json` 中 mermaid 锁在 **8.14.0**(2022 年版本,与当前语法有差距)。

### 2.2 内容资产(已全量扫描)

| 资产 | 数量 | 说明 |
|---|---|---|
| Markdown 文件 | 182 | 180 个中文内容页(`docs/zh/`)+ 2 个首页(`docs/README.md` 英文、`docs/zh/README.md` 中文,vdoing `home: true` 格式) |
| 内容分区 | 10 | `01-about` ~ `10-release-notes`,编号前缀是 vdoing "structuring" 侧边栏的排序机制 |
| frontmatter | 180 页均有 `title` + `permalink` | **permalink 全部是干净 URL**(如 `/about/overview`、`/guide/ee-tenant/dashboard/panel/line/`),不含 `/zh/`、不含编号前缀 |
| `::: code-tabs#shell` | 18 处(48 个 `@tab`) | vdoing 自定义容器语法 |
| `::: tip` / `::: warning` | 7 / 3 处 | 语法与 VitePress 完全一致 |
| mermaid 代码块 | 26 块(20 个文件) | 经自研 `mermaidjs` 插件渲染 |
| 任务列表 `- [ ]` | 48 行 | 经自研 `todo` 插件渲染 |
| 脚注 `[^n]` | 5 处 | 经自研 `footnote` 插件渲染 |
| 相对链接 | 587 处;`.md` 后缀链接仅 6 处 | 图片绝大多数为外链(阿里云 OSS),少量 `./imgs/` 相对引用 |
| 未使用的能力 | — | `Badge`/`CodeTabs` 全局组件 0 处、demo-block 0 处、标题自定义锚点 `{#id}` 0 处 |

### 2.3 自研插件清单(全部在 `docs/.vuepress/plugins/`,共 11 个)

| 插件 | 类型 | 迁移处置 |
|---|---|---|
| `code-tabs` | markdown-it | **删除**,转官方内置 `::: code-group`(需 18 处语法转换) |
| `footnote` | markdown-it(415 行) | **删除**,换 `markdown-it-footnote` |
| `todo` | markdown-it | **删除**,换 `markdown-it-task-lists`(1.6.4 无内置;2.0 已内置) |
| `auto-add-title-order` | markdown-it | 渲染期给 H1/H2 自动编号("1. "、"2.2 ")。**建议弃用**(现代文档惯例不编号,编号信息已由目录序号承担);若必须保留,见 §5.5 |
| `auto-complete-url` / `disable-url-encode` | markdown-it | VuePress 1 链接处理 hack,VitePress 原生路由/链接处理替代,**删除**(迁移期验证) |
| `fulltext-search` | VuePress 插件(FlexSearch) | **删除**,换官方本地搜索(§7) |
| `one-click-copy` | VuePress 插件 | **删除**,VitePress 默认主题代码块自带复制按钮 |
| `vuepress-keyword` | VuePress 插件(meta keywords) | **删除**,keywords SEO 价值极低;如需保留用 `head` 配置 |
| `mermaidjs` | VuePress 插件 | **删除**,换 `vitepress-plugin-mermaid`(§7.3) |
| `love-me` | VuePress 插件 | 内容中未见使用,**删除** |

### 2.4 部署现状

- `base: '/docs/'`,产物 `dist/`;Dockerfile 基于 `nginx:1.20`,将 `dist` 拷到 `/usr/share/nginx/html/docs`,`try_files $uri $uri/ /docs/index.html`。
- 周边脚本与框架弱耦合,基本不受影响:`translate/`(调 API 的翻译流水线,读写 md + frontmatter)、`downloadCSV.js`/`downloadFile.js`、`addTime.js`(vdoing 博客用的时间戳脚本,可随迁移废弃)。
- `LOCALES/en|zh.json` 是 vdoing 主题 UI 文案,随主题一起废弃。

---

## 3. 版本选型(以 2026-09-17 官方发布为准)

### 3.1 官方版本现状

| 通道 | 版本 | 日期 | 底层 | Node |
|---|---|---|---|---|
| 稳定版 | **1.6.4** | 2025-01 | Vue 3.5 + Vite ^5.4.14 | ≥ 18 |
| 预发布 | 2.0.0-alpha.20 | 2026-09-04 | Vite ^8.3.0 | ≥ 22 |

依据:官方 [CHANGELOG](https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md)、[vitepress.dev](https://vitepress.dev/) 版本切换器、v1.6.4 tag 的 `package.json`(vite ^5.4.14)与 Getting Started(Node 18+)。

### 3.2 决策:生产上 1.6.4 稳定版

- 2.0 处于 alpha(2026-03 起持续发 alpha,尚未 beta),文档站是生产系统,**不跟 alpha** 是 2026 年的稳妥最佳实践。
- 1.6.4 的能力(容器、代码组、rewrites、本地搜索、sitemap、暗色模式)完全覆盖本站需求;不足的两点(脚注、任务列表)各加一个 markdown-it 插件即可,成本一行配置。
- 本方案的配置写法尽量采用"面向 2.0"的形式(如 `outline.label`、`lastUpdated.text`),并在附录 A 列出未来 1.x→2.0 的已知差异,降低二次升级成本。
- CI 直接上 **Node 22 LTS**(向前兼容 2.0 的 Node 要求)。

---

## 4. 目标架构

### 4.1 目录结构(before → after)

```
仓库根/                                   仓库根/
├─ docs/                                 ├─ .vitepress/            # ★ 新增:项目根配置
│  ├─ .vuepress/        # 删除           │  ├─ config.mts          # 主配置
│  │  ├─ config.js                       │  ├─ rewrites.generated.json  # 脚本生成(§4.4)
│  │  ├─ plugins/*                       │  ├─ sidebar.mts         # 侧边栏生成器(§6.3)
│  │  ├─ public/img                      │  └─ theme/              # 默认主题扩展(§6)
│  │  └─ styles/*.styl   # 删除           │     ├─ index.ts
│  ├─ README.md          # 英文首页       │     ├─ custom.css
│  └─ zh/**              # 内容,原样保留  ├─ docs/                  # srcDir(内容目录不变)
├─ vdoing/               # 删除           │  ├─ index.md            # ★ 由 zh/README.md 转换
├─ LOCALES/              # 删除           │  ├─ public/img          # ★ 由 .vuepress/public 移入
├─ package.json                           │  └─ zh/**              # ★ 180 个内容页不动
├─ Dockerfile                             ├─ package.json          # 重写依赖
└─ nginx/default.conf                     └─ Dockerfile            # 基本不变
```

要点:

- **项目根 = 仓库根**(package.json 所在),`.vitepress/` 放仓库根,`srcDir: 'docs'`。这是官方推荐布局(官方文档自身即如此拆分,见 vitepress 仓库 `docs/.vitepress/config/`)。
- **`docs/zh/` 全部 180 个内容文件一字不动**——编号前缀继续承担排序职责(侧边栏生成器消费它),URL 由 `rewrites` 负责(§4.4)。这是"零内容移动、零 git 历史破坏"的关键。
- 首页:`git mv docs/zh/README.md docs/index.md` 并重写 frontmatter(§9 codemod-2)。旧英文首页 `docs/README.md` 是一个仅含 hero 与"Read Now →"按钮、实际链向中文内容的单页,建议直接由中文首页取代 `/docs/`(决策点,见 §4.5)。

### 4.2 package.json(新)

```jsonc
{
  "name": "deepflow-docs",
  "private": true,
  "packageManager": "pnpm@10.x",
  "scripts": {
    "dev": "vitepress dev",            // 项目根即 vitepress root
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
  "devDependencies": {
    "vitepress": "^1.6.4",
    "mermaid": "^11",
    "vitepress-plugin-mermaid": "^2.0.16",
    "markdown-it-footnote": "^4",       // 1.6.4 无内置脚注(2.0 已内置)
    "markdown-it-task-lists": "^2",     // 1.6.4 无内置任务列表(2.0 已内置)
    "markdown-it-container": "^4"       // 自定义容器(§5.2)
  }
}
```

删除全部 VuePress 1 / vdoing / 自研插件依赖(共 17 个)。`--openssl-legacy-provider`、`--max-old-space-size` 等参数全部移除。

### 4.3 主配置骨架 `.vitepress/config.mts`

```ts
import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import taskLists from 'markdown-it-task-lists'
import container from 'markdown-it-container'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { sidebar } from './sidebar'
import rewrites from './rewrites.generated.json'

export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: 'DeepFlow 文档',
    description: '基于 eBPF 和 Wasm 的云原生及 AI 应用深度可观测性平台文档',

    srcDir: 'docs',
    outDir: '../dist',              // 保持 Dockerfile 的 COPY ./dist 不变
    base: '/docs/',
    cleanUrls: true,                // /about/overview 而非 .html(配 nginx,见 §8.2)
    lastUpdated: true,              // 取 git 提交时间,替代 addTime.js
    sitemap: { hostname: 'https://deepflow.io' },   // 自动生成 sitemap.xml

    // URL 映射:由脚本从 180 个 permalink 生成(§4.4)
    rewrites,

    locales: {
      root: { label: '简体中文', lang: 'zh-CN' }
      // 未来英文内容就绪后:en: { label: 'English', lang: 'en-US' },内容放 docs/en/
    },

    head: [
      ['link', { rel: 'icon', href: '/img/favicon.ico' }],
      ['meta', { name: 'theme-color', content: '#0a72ef' }]
    ],

    markdown: {
      lineNumbers: true,            // 对齐现有 markdown.lineNumbers: true
      config: (md) => {
        md.use(footnote)
        md.use(taskLists)
        // 自定义容器(§5.2)
        md.use(container, 'success', {
          render: (tokens, idx) =>
            tokens[idx].nesting === 1
              ? '<div class="tip custom-block"><p class="custom-block-title">SUCCESS</p>\n'
              : '</div>\n'
        })
      }
    },

    themeConfig: {
      logo: '/img/logo.png',
      outline: { level: [2, 3], label: '本页目录' },
      lastUpdated: { text: '上次更新' },
      docFooter: { prev: '上一篇', next: '下一篇' },
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '菜单',
      darkModeSwitchLabel: '主题',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',

      editLink: {
        pattern: 'https://github.com/deepflowio/docs/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页'
      },
      // nav / sidebar 见 §6
      search: { /* §7 本地搜索 */ }
    }
  })
)
```

> 注:`outline.label` / `lastUpdated.text` 是面向 2.0 的新写法;若 1.6.4 对个别键报警告,回退老写法 `outlineTitle` / `lastUpdatedText` 即可(两者在 1.x 均受支持,2.0 中老写法移除,见附录 A)。

### 4.4 URL 保持策略(本方案的核心保障)

现状:180 页的线上 URL = `base(/docs/) + permalink`,如 `permalink: /guide/ee-tenant/dashboard/panel/line/` → `https://deepflow.io/docs/guide/ee-tenant/dashboard/panel/line/`。文件路径(`zh/06-guide/02-ee-tenant/.../01-line.md`)与 permalink **不同构**。

方案:**不改文件,用官方 `rewrites`**。VitePress 的 `rewrites` 支持映射表、动态参数和函数三种形式(官方 Routing → Route Rewrites)。步骤:

1. 写一次性脚本 `scripts/gen-rewrites.mjs`:遍历 `docs/zh/**/*.md`,解析 frontmatter 的 `permalink`,输出 `.vitepress/rewrites.generated.json`:

   ```json
   {
     "zh/01-about/01-overview.md": "about/overview.md",
     "zh/06-guide/01-quick-start/01-5w-method.md": "guide/quick-start/5w-method.md"
   }
   ```

   (permalink 需归一化:去首尾 `/`、补 `.md`;无 permalink 的文件回退为"去 `zh/` 前缀 + 去编号段"的推导值。)

2. `config.mts` 直接 `import` 该 JSON 作为 `rewrites`。
3. **校验**:构建后对比 VitePress 生成的 sitemap.xml 与脚本导出的旧 permalink 清单,必须 180/180 全等;任何不等项进显式映射修正。
4. permalink 字段本身留在 frontmatter 中不动(VitePress 会忽略未知字段),避免一次性触碰 180 个文件的 git 记录;后续清理可选。

备选方案(不推荐):物理重排目录(`git mv zh/01-about → about`)。URL 同样可保持,但 180 个文件全部移动,git blame/PR diff 噪音大,且丢失"编号即排序"的隐含约定。

### 4.5 站点语言模型(实施时按发现的事实修订)

> **修订记录(2026-09-17 实施期)**:初版方案误以为英文内容只有一个首页。实际核查发现 `translate/translated/` 中**提交了 180 个英文机翻页面**(与中文树同构、同 permalink),CI 构建时合并进 `docs/`。旧站因中英两树 permalink 相同,构建时互相覆盖、**英文胜出**——线上 clean URL 上实际是英文内容,中文页面反而不达。据此本节结论修订如下。

实施采用的双语言模型:

- **英文(源:`translate/translated/`,CI 合并至 `docs/` 根)→ 根路径 clean URL**:与线上现状完全一致,英文 URL 保持率 100%(180/180,含 17 个仅英文的旧版本笔记)。
- **中文(源:`docs/zh/`)→ `/zh/` 前缀**:中文页面首次真正可达(旧站被覆盖),`/docs/zh/` 首页的入口链接同步修复。
- 双语页面在 VitePress `locales` 中配置(root=en、zh=/zh/),导航栏自动出现语言切换菜单。
- **首页默认中文**:`/docs/` 由 nginx 无条件 302 到 `/docs/zh/`(`location = /docs/`)。语言切换不受影响——内容页上的语言菜单是深链直达对应语言页面的,仅"站在中文首页切英文"会经 `/docs/` 弹回中文首页。英文首页(dev 与 sitemap 中仍存在)经此重定向不对访客暴露。
- 仅中文的页面(如尚未翻译的 EE 7.2 版本笔记)由 nginx 301 从旧根路径跳转到 `/zh/`(`nginx/zh-only-redirects.conf`,由 `gen-rewrites.mjs` 生成)。
- `downloadFile.json` 声明的 CI 下载页(Agent 配置)中英各一,同规则处理。
- 旧英文首页(hero 单页)由中文首页逻辑对等的英文 VitePress home 取代,内容原样转换。

---

## 5. Markdown 高级能力(2026 官方形态)

以下均为 VitePress 开箱能力,来源:官方 [Markdown Extensions](https://vitepress.dev/guide/markdown)(2.0-alpha 文档;逐项已对照 v1.6.4 tag 源码/文档核实,差异处已标注)。

### 5.1 内置容器(无需任何配置)

```md
::: info / ::: tip / ::: warning / ::: danger     # 四种提示容器
::: details 标题                                  # 折叠块,可加 {open} 默认展开(2.0)
::: danger STOP                                   # 自定义标题:类型后直接跟文字
:::: tip                                          # 嵌套:外层围栏加长
::: tip 内层
:::
::::
::: raw                                           # 隔离样式/路由冲突
```

现有内容里的 7 处 `::: tip`、3 处 `::: warning` **语法完全兼容,零改动**。

另支持 GitHub 风格 Alerts(v1.6.4 起内置 `githubAlerts` 插件,已核实源码存在):

```md
> [!NOTE] / > [!TIP] / > [!IMPORTANT] / > [!WARNING] / > [!CAUTION]
```

### 5.2 自定义容器(用户点名的能力)

**1.6.4(本方案采用)**:官方文档 "Advanced Configuration" 方式,在 `markdown.config` 里用 `markdown-it-container` 注册(vitepress 自身也依赖它,显式安装以获得版本控制):

```ts
markdown: {
  config: (md) => {
    md.use(container, 'success', { render: ... })   // 见 §4.3 骨架
  }
}
```

**2.0(升级后可换声明式)**:`markdown.container.customContainers: { success: 'SUCCESS' }`,并支持 `::: tip {no-title}` 无标题容器、`note/important/caution` 新内置类型(均见 2.0 CHANGELOG:#962f00e、#4c7a030、#3b560a0)。

### 5.3 代码相关(对文档站价值最大)

| 能力 | 语法 | 备注 |
|---|---|---|
| Shiki 高亮 | ` ```bash ` | 替代 prismjs,内置 |
| 行高亮 | ` ```bash{4,7-13} ` 或行内 `# [!code highlight]` | 现有内容未用,新能力 |
| Diff/错误标记 | `// [!code ++]`、`// [!code --]`、`// [!code warning]` | 新能力 |
| 行号 | `markdown.lineNumbers: true`(已配)或逐块 `:line-numbers` | 对齐现状 |
| **代码组** | `::: code-group` + ```` ```bash [标题] ```` | **替代 code-tabs**,见 §9 codemod-3 |
| 导入文件 | `<<< @/snippets/example.sh{2}`(支持 region) | 新能力,适合 Helm values 等长配置 |
| md 包含 | `<!--@include: ./part.md-->` | 新能力 |

### 5.4 其他内置

frontmatter(YAML)、表格、**任务列表**(2.0 内置;1.6.4 需 `markdown-it-task-lists`,已配)、**脚注 `[^1]`**(2.0 内置;1.6.4 需 `markdown-it-footnote`,已配,现有 5 处用法语法兼容)、emoji `:tada:`、TOC `[[toc]]`、数学公式(可选 `markdown: { math: true }`,需装 `markdown-it-mathjax3`)、图片懒加载(2.0:`image.lazyLoad`)。

中文友好增强(可选):`markdown-it-cjk-friendly` 解决 `中文**加粗**中文` 这类 CJK 相邻强调解析问题;2.0 中该行为默认开启(`cjkFriendlyEmphasis: true`,已核实源码),1.6.4 上可手动加同作者插件。

### 5.5 标题自动编号(现状功能,建议弃用)

`auto-add-title-order` 在**渲染期**给标题加 "1. / 2.2 " 编号,文件内容本身无编号,因此弃用**不需要改任何内容**,仅是视觉变化。建议弃用的理由:与锚点/TOC/搜索引擎摘要无关的装饰性编号、多一层插件维护成本、现代文档站惯例是无编号正文 + 编号目录。若产品坚持保留,可用约 30 行的 renderer 规则平移该逻辑(实现同款 `heading_open` hook),不阻塞迁移主线。

---

## 6. 主题定制:用官方默认主题替代 vdoing

原则:**extends DefaultTheme,只做加法**(官方 [Extending the Default Theme](https://vitepress.dev/guide/extending-default-theme))。

### 6.1 vdoing 功能映射表

| vdoing 能力 | VitePress 替代 | 成本 |
|---|---|---|
| structuring 侧边栏(按编号目录自动生成) | `sidebar.mts` 生成器(§6.3) | 中 |
| home 首页(heroText/features/actionLink) | 官方 `layout: home` frontmatter(hero/features/actions) | 低,codemod-2 |
| lastUpdated(上次更新) | 内置(git 时间) | 0 |
| editLinks(编辑此页) | 内置 `editLink.pattern` | 0 |
| one-click-copy(代码复制) | 默认主题内置 | 0 |
| 页脚备案号 | `layout-bottom` slot 自定义组件 | 低 |
| LOCALES UI 中文化 | `themeConfig` 各 label(已在 §4.3 骨架配齐) | 0 |
| 暗色模式 | 内置(appearance 切换) | 0 |
| 移动端/搜索框/outline | 默认主题内置 | 0 |
| stylus 主题样式(palette/index.styl) | CSS 变量覆盖 + `custom.css` | 低 |
| 图片点击放大(vuepress-plugin-zooming) | 官方指南的 medium-zoom 集成示例 | 低 |
| 目录页(__autoGenerate__ 结构化目录) | 未在内容中使用,不迁移 | 0 |

### 6.2 主题扩展文件

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { mediumZoom } from './medium-zoom'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 页脚:备案信息,替代 vdoing footer
      'layout-bottom': () => h('footer', { class: 'footer' },
        'YUNSHAN Networks | 京 ICP 备 14036633号-4 京公网安备')
    })
  },
  enhanceApp({ app, router }) {
    if (typeof window !== 'undefined') mediumZoom(router)  // 图片缩放
  }
}
```

`custom.css` 只覆盖品牌变量与少量布局(主色 `--vp-c-brand-1: #0a72ef` 对齐现有 theme-color 等),**不搬 vdoing 的 stylus 全量样式**——默认主题的排版/响应式/暗色质量远高于魔改 vdoing,全量平移只会拖住后腿。

### 6.3 侧边栏生成器 `.vitepress/sidebar.mts`

官方迁移指南明确:VitePress 侧边栏不再从 frontmatter 自动生成,需自行读取数据([migration-from-vuepress](https://vitepress.dev/guide/migration-from-vuepress))。实现要点:

```ts
// 伪代码:配置期直接跑在 Node,可同步用 fs
import fs from 'node:fs'

const SECTIONS = {                       // 分区标题清单(唯一的排序/命名来源)
  '01-about': '关于 DeepFlow',
  '02-ce-install': '社区版安装',
  '03-ee-install': '企业版安装',
  '04-best-practice': '最佳实践',
  '05-features': '功能特性',
  '06-guide': '使用指南',
  '07-configuration': '配置说明',
  '08-integration': '集成',
  '09-diagnose': '故障诊断',
  '10-release-notes': '版本发布笔记'
}

export function sidebar() {
  // 遍历 docs/zh/<section>/**,目录/文件名按前缀数字自然排序,
  // 文本取 frontmatter title(缺省用去编号的文件名),
  // link 指向 rewrite 后的 URL(读 rewrites.generated.json 反查)
  return { '/': buildItems() }
}
```

收益:目录结构调整时零配置维护;`SECTIONS` 是唯一需要人工维护的清单,天然充当文档信息架构的声明文件。

---

## 7. 搜索与图表

### 7.1 本地搜索(替代自研 FlexSearch 插件)

官方支持开箱即用的浏览器端全文搜索(minisearch,[Search 参考](https://vitepress.dev/reference/default-theme-search))。中文站必须自定义分词,否则整句无法命中。2026 年社区通用做法是 `Intl.Segmenter`:

```ts
themeConfig: {
  search: {
    provider: 'local',
    options: {
      translations: {                   // UI 中文化(键名以官方 reference 为准)
        button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
        modal: {
          noResultsText: '未找到结果',
          resetButtonTitle: '清除查询',
          footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
        }
      },
      miniSearch: {
        options: {
          // 中文按词切分(Intl.Segmenter 为运行时内置 API,Node 18+ 与现代浏览器均支持)
          tokenize: (text) =>
            [...new Intl.Segmenter('zh-CN', { granularity: 'word' }).segment(text)]
              .map((s) => s.segment)
        }
      }
    }
  }
}
```

`miniSearch.options` 可定制 `extractField / tokenize / processTerm`(v1.6.4 类型定义已核实)。**实施时验证点**:自定义 `tokenize` 在构建期索引与浏览器查询期的一致性(官方 issue #3496 附近有讨论);若效果不理想,备选方案是 `vitepress-plugin-pagefind`(对中文分词更友好,npm 包,一行接入)。远期若需要更强的相关性排序再评估 Algolia DocSearch(免费但需申请)。

### 7.2 搜索结果噪音

mermaid 源码文本会进入搜索索引(26 处图源可能产生噪音)。实施时在本地搜索 `_render`/索引侧过滤 `language-mermaid` 块或接受现状,以实际搜索体验定夺(该问题在 vitepress-plugin-mermaid 的 issue 区亦有讨论)。

### 7.3 Mermaid

```ts
// 已体现在 §4.3:withMermaid 包裹整个 defineConfig 结果
import { withMermaid } from 'vitepress-plugin-mermaid'
export default withMermaid(defineConfig({ ... }))
```

- 依赖:`vitepress-plugin-mermaid@^2`(当前 2.0.16)+ `mermaid@^11`;现有 ```` ```mermaid ```` 围栏语法直接兼容,26 处无需改动。
- 暗色模式:插件检测 body 上的 dark 类自动切换主题,替代现有手写的 themeVariables 配色。
- 从 mermaid 8 升到 11 有少量语法差异(如 `%%{init}%%` 指令行为、个别图表关键字),26 张图需人工过一遍(纳入 §9 验证清单)。
- 注意:该插件目前面向 VitePress 1.x;VitePress 2 兼容性待其官方确认(官方讨论 vuejs/vitepress#4999),这也是"生产不上 2.0 alpha"的佐证之一。

---

## 8. 构建与部署

### 8.1 CI(GitHub Actions)

- Node 12 矩阵 → 固定 **Node 22 LTS**;pnpm 6 → pnpm 10(`corepack` 或 `pnpm/action-setup`,配 `packageManager` 字段)。
- 删除所有 `NODE_OPTIONS` hack;Vite 构建无 webpack 内存问题。
- 步骤:checkout(fetch-depth: 0,lastUpdated 需要 git 历史)→ pnpm install → `pnpm build` → 原有镜像构建推送流程不变。
- VitePress 构建自带**死链检测**(dead links 导致构建失败),这本身就是迁移验证工具;对历史遗留死链可临时 `ignoreDeadLinks` 白名单。

### 8.2 Nginx 与 Dockerfile

Dockerfile 不变(仍 COPY `./dist`)。`nginx/default.conf` 需适配 `cleanUrls` 产物(无 `.html` 后缀文件):

```nginx
location /docs/ {
    root /usr/share/nginx/html;

    # 旧 URL 带尾斜杠(/docs/about/overview/),统一 301 到无尾斜杠规范形
    rewrite ^(/docs/.+)/$ $1 permanent;

    # cleanUrls:产物为 about/overview.html,同时兼容 .html 直接访问
    try_files $uri $uri.html $uri/ =404;
}
```

### 8.3 SEO

- `sitemap: { hostname }` 自动产出 sitemap.xml;`public/robots.txt` 指向之。
- canonical:用 `transformHead` 钩子按 `cleanUrls` 规范形注入 `<link rel="canonical">`,消化旧 URL(尾斜杠/`.html` 变体)的重复收录。
- title/description 语义保持现状(每页 frontmatter `title` 继续生效)。meta keywords 弃用(§2.3)。

---

## 9. 实施计划

### Phase 0 · 准备(0.5 天)

- 新建分支 `refactor/vitepress`;冻结 main 内容合入(或约定迁移期间 PR 需 rebase)。
- 全量导出基线:旧 URL 清单(permalink)、每页 title、构建产物快照,供 Phase 5 比对。

### Phase 1 · 骨架(1 天)

- 重写 `package.json`(§4.2),`pnpm install`;落 `.vitepress/config.mts`、`theme/`、`sidebar.mts`(§4.3、§6)。
- `git mv docs/zh/README.md docs/index.md`,`git mv docs/.vuepress/public docs/public`。
- 删除 `vdoing/`、`docs/.vuepress/`、`LOCALES/`(单独一个 commit,便于回溯)。
- 里程碑:空内容下 `pnpm dev` 可起、`pnpm build` 通过。

### Phase 2 · 内容 codemod(1 天,全部脚本化)

| # | 脚本 | 输入 → 输出 |
|---|---|---|
| 1 | `gen-rewrites.mjs` | 180 个 permalink → `rewrites.generated.json`(§4.4) |
| 2 | 首页转换 | vdoing home frontmatter → VitePress `layout: home`(`hero:{text,tagline,actions}` + `features:` 映射,一次性手写亦可) |
| 3 | code-tabs 转换 | `::: code-tabs#shell` 块内每个 `@tab 标题` + 围栏 → `::: code-group` + ```` ```bash [标题] ````(18 处、48 个 tab,规则确定,正则可完成;转换后人工抽检) |
| 4 | 校验脚本 | 对比 sitemap.xml 与基线 URL 清单,输出 diff(必须为空) |

明确**不动**的:`title`/`permalink` frontmatter、`::: tip|warning`、任务列表、脚注、mermaid 围栏、相对链接(587 处,VitePress 原生处理)。

### Phase 3 · 功能对齐(1 天)

- 本地搜索 + 中文分词调通(§7.1),搜索质量抽查(专有名词如 "AutoTagging"、"智能编码"、长句)。
- mermaid 11 视觉与语法回归(26 张图逐张过)。
- 主题细节:logo、品牌色、页脚备案、medium-zoom、暗色模式走查。
- 决策项落地:标题编号是否保留(§5.5)、英文首页文案去向(§4.5)。

### Phase 4 · 验证清单(0.5 天)

- [ ] URL 对照 180/180 全等(Phase 2-4 脚本)
- [ ] `pnpm build` 零死链(或白名单评审)
- [ ] 旧 URL 尾斜杠 / `.html` 变体 301 抽查
- [ ] 全站人工走查:10 个分区首页 + 抽样 20 页(容器、代码组、表格、图片、脚注、任务列表)
- [ ] Lighthouse(性能/SEO/可访问性)基线记录
- [ ] `translate/` 流水线在新型 frontmatter 下干跑一次

### Phase 5 · 上线(0.5 天)

- 镜像发布走现有流程;保留旧镜像 tag 用于快速回滚。
- 上线后观察:搜索使用情况、404 监控(nginx 日志按 `/docs/` 聚合)、Google Search Console 覆盖率(sitemap 重新提交)。

### 里程碑与回滚

- 每 Phase 一个合并点,`refactor/vitepress` 分支可随时放弃,main 上旧 VuePress 构建链路在 Phase 5 前完整可用——**回滚 = 不合并不部署**,无数据迁移、无外部依赖变更,风险天然受限。

---

## 10. 风险登记

| 风险 | 概率 | 缓解 |
|---|---|---|
| rewrites 与 permalink 不一致导致 URL 漂移 | 低 | 生成器单一来源 + sitemap 全量 diff 校验(Phase 2-4) |
| minisearch 中文分词效果不达预期 | 中 | Intl.Segmenter 调参;备选 pagefind(切换成本半天) |
| mermaid 8→11 语法差异 | 中 | 26 张图人工回归清单 |
| vitepress-plugin-mermaid 与本地搜索的索引噪音 | 低 | §7.2 处理;最坏情况搜索结果多余词条 |
| 旧 URL 已被收录的变体(尾斜杠/.html) | 低 | nginx 301 + canonical(§8.2/8.3) |
| 迁移窗口与内容 PR 冲突 | 中 | Phase 0 起内容冻结或快速 rebase(改动均为增量 md,冲突面小) |
| 2.0 正式发布后二次升级成本 | 低 | 附录 A 已列差异;本方案配置写法已尽量面向 2.0 |

---

## 附录 A:1.6.4 → 2.0 升级预告(依据官方 CHANGELOG,2026-09)

2.0.0 正式发布后建议尽快跟进(预计为纯配置级改动):

- **要求**:Node ≥ 22、Vite 8。
- markdown 能力内置化:脚注、GitHub 任务列表、`cjkFriendlyEmphasis`(默认开)——届时可删 `markdown-it-footnote`、`markdown-it-task-lists` 两个依赖。
- 自定义容器改声明式:`markdown.container.customContainers: { success: 'SUCCESS' }`;新增内置 `note/important/caution` 容器与 `{no-title}` 属性。
- 破坏性改名(本方案已按新写法预防):`lastUpdatedText` → `lastUpdated.text`、`outlineTitle` → `outline.label`、`markdown.image.lazyLoading` → `lazyLoad`、本地搜索 `disableDetailedView` 移除(用 `detailedView: false`)。
- 围栏代码块上的 markdown-it-attrs 被禁用(如需给代码块加类,改用 shiki transformer)。
- 每语言 markdown 文案(`markdown.container.tipLabel` 等)与 navbar 重设计等新能力可按需启用。
- 前置条件:`vitepress-plugin-mermaid` 官方确认 2.0 支持(vuejs/vitepress#4999 跟踪)。

## 附录 B:官方文档索引(实施时的权威依据)

| 主题 | URL |
|---|---|
| 入门 / 环境要求 | https://vitepress.dev/guide/getting-started |
| Markdown 扩展(容器/代码组/导入) | https://vitepress.dev/guide/markdown |
| 从 VuePress 迁移 | https://vitepress.dev/guide/migration-from-vuepress |
| 路由与 rewrites | https://vitepress.dev/guide/routing |
| i18n | https://vitepress.dev/guide/i18n |
| 扩展默认主题 | https://vitepress.dev/guide/extending-default-theme |
| 站点配置(srcDir/rewrites/sitemap…) | https://vitepress.dev/reference/site-config |
| 默认主题配置(nav/sidebar/outline…) | https://vitepress.dev/reference/default-theme-config |
| 本地搜索 | https://vitepress.dev/reference/default-theme-search |
| sitemap | https://vitepress.dev/guide/sitemap-generation |
| CHANGELOG | https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md |
| Mermaid 插件 | https://emersonbottero.github.io/vitepress-plugin-mermaid/ |

> 阅读提示:vitepress.dev 当前默认展示 2.0-alpha 版文档,右上角版本切换器切到 **1.6.4** 再对照实施;本方案所有 1.6.4 结论均已按 v1.6.4 tag 的文档与源码核实。

## 附录 C:实施记录(2026-09-17,分支 `refactor/vitepress`)

按 §9 的分阶段计划执行,与原方案的主要差异及补充事实:

| 阶段 | 提交内容 | 与方案的差异 |
|---|---|---|
| Phase 0 | `scripts/gen-rewrites.mjs` + 359 条 rewrites + URL 基线 | 删除了 `07-configuration/` 下中英两个无入链的占位存根;英文树按 **URL 空间**实际覆盖全部 180 页(近期翻译已跟上) |
| Phase 1 | `.vitepress/`(config/sidebar/theme)+ 双语首页 + 依赖收敛(17 → 7 个直接依赖) | i18n 采用 §4.5 修订版(英文根路径 + 中文 `/zh/`),新增 `scripts/lib/corpus.mjs` |
| Phase 2 | ~~codemod 改写内容~~ **已返工为运行时插件适配** | 初版直接改写了 233 个内容文件(code-tabs → code-group、1141 处链接绝对化)。按维护方决策回滚全部内容改动:内容文件保持 vdoing 原语法,改由两个 markdown-it 插件在渲染期适配(`.vitepress/markdown/legacy-code-tabs.ts` 把 `@tab` 转入 fence info 并复用内置 code-group 渲染;`legacy-links.ts` 移植旧 `auto-complete-url` 插件的「源文件目录去数字前缀」解析规则,输出最终 URL)。收益:`translate/` 流水线 md5 不受扰动、英文树再生语法天然兼容、git 历史干净 |
| Phase 3 | CI(Node 22 + pnpm 10 + actions 升级)、nginx(cleanUrls 301 规则)、Dockerfile、`scripts/check-urls.mjs` | `downloadCSV.js` 依赖 axios,补入 devDependencies;CI 去掉 addTime 调用(VitePress 用 git 时间) |

实施期待用户执行的验证(遵循"改完即止"约定,未代跑):

```sh
pnpm install && pnpm build          # 构建含死链检测
node scripts/check-urls.mjs         # sitemap 与基线 180+180 项全量比对
pnpm preview                        # 人工走查:容器/代码组/mermaid/任务列表/脚注/暗色
```

遗留事项:mermaid 8 → 11 的 26 张图人工回归;本地搜索中文分词质量抽查;英文页 lastUpdated 依赖 CI 全量 checkout(git 历史在,但英文文件为构建期产物,时间戳取自构建机上移入后的路径,可能为空)。
