import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import taskLists from 'markdown-it-task-lists'
import container from 'markdown-it-container'
import { withMermaid } from 'vitepress-plugin-mermaid'
import rewrites from './rewrites.generated.json'
import { sidebar } from './sidebar'
import { legacyCodeTabs } from './markdown/legacy-code-tabs'
import { legacyLinks } from './markdown/legacy-links'

const GITHUB_DOCS = 'https://github.com/deepflowio/docs'

// 构建变体(由 package.json 的 dev:doc-only / build:doc-only /
// preview:doc-only 注入 DOCS_MODE=doc-only;产品内嵌模式为 doc-embedded):
//   默认    —— 供主站嵌入,全站导航栏/页脚始终隐藏(产物 dist);
//   doc-only —— 独立文档站,渲染 doc 专属顶栏(DocHeader)、无页脚
//              (产物 dist-doc-only);
//   doc-embedded —— 产品内嵌文档,无 Logo/站名,搜索位于左侧,正文顶距 32px
//              (产物 dist-doc-embedded)。差异均由构建期写进 head 的
//              html 类标记驱动,见下方 head 与 theme/custom.css
const DOC_ONLY = process.env.DOCS_MODE === 'doc-only'
const DOC_EMBEDDED = process.env.DOCS_MODE === 'doc-embedded'

export default withMermaid(
  defineConfig({
    lang: 'en-US',
    title: 'DeepFlow',
    description:
      'DeepFlow leverages eBPF and Wasm to achieve zero-code and full-stack observability, enabling continuous innovation in cloud-native and AI applications.',

    srcDir: 'docs',
    // 产物输出到仓库根 dist(默认是 .vitepress/dist),与 Dockerfile 的 COPY ./dist
    // 及 df-help 企业版 CI 的 mv ./docs/dist/* 对齐;doc-only 变体单独输出到
    // dist-doc-only / dist-doc-embedded,避免不同形态互相覆盖
    outDir: DOC_EMBEDDED ? 'dist-doc-embedded' : DOC_ONLY ? 'dist-doc-only' : 'dist',
    base: '/docs/',
    // 主题默认 dark(旧站观感)。'dark' 下 VitePress 优先读 localStorage
    // (vitepress-theme-appearance),无记录时回退此默认值,切换时写回;
    // 切换入口为侧边栏搜索栏左侧的主题按钮(SidebarActions)。
    // 注意 appearance 是根级配置项,放在 themeConfig 下不会生效(源码读
    // userConfig.appearance)
    appearance: 'dark',
    cleanUrls: true,
    lastUpdated: true,
    // 死链豁免:Agent 配置页(/configuration/agent)由 CI 构建前的
    // downloadFile.js 从 deepflow 主仓库下载生成(见 downloadFile.json 与
    // .github/workflows/build.yml),提交态仓库中无此文件,指向它的链接在
    // 本地构建时必然悬空。仅本地(无 CI 环境变量)豁免这两个精确地址;
    // CI 下不豁免,下载步骤失效时构建仍以死链失败兜底。本地要构建出该
    // 页面的完整产物,可先手动执行 `node downloadFile.js main`
    ignoreDeadLinks: process.env.CI ? [] : ['/configuration/agent', '/zh/configuration/agent'],
    sitemap: { hostname: 'https://deepflow.io' },

    // URL 模型(与迁移前线上一致):
    //   英文页(CI 时由 translate/translated 合并进 docs/)位于根路径 clean URL;
    //   中文页位于 /zh/ 前缀下。映射由 scripts/gen-rewrites.mjs 生成。
    rewrites: rewrites as Record<string, string>,

    locales: {
      root: {
        label: 'English',
        lang: 'en-US',
        description:
          'DeepFlow leverages eBPF and Wasm to achieve zero-code and full-stack observability, enabling continuous innovation in cloud-native and AI applications.',
        themeConfig: {
          nav: [
            { text: 'Quick Start', link: '/guide/quick-start/5w-method' },
            { text: 'Features', link: '/features/l7-protocols/overview' },
            { text: 'Release Notes', link: '/release-notes/release-7.2-ce' }
          ]
        }
      },
      zh: {
        label: '简体中文',
        lang: 'zh-CN',
        description:
          'DeepFlow 旨在为复杂的云原生和 AI 应用提供深度可观测性。DeepFlow 基于 eBPF 实现了应用性能指标、分布式追踪、持续性能剖析等观测信号的零侵扰(Zero Code)采集,并结合智能标签(SmartEncoding)技术实现了所有观测信号的全栈(Full Stack)关联和高效存取。',
        themeConfig: {
          nav: [
            { text: '快速开始', link: '/zh/guide/quick-start/5w-method' },
            { text: '功能特性', link: '/zh/features/l7-protocols/overview' },
            { text: '版本发布', link: '/zh/release-notes/release-7.2-ce' }
          ],
          outline: { level: [2, 3], label: '本页目录' },
          lastUpdated: { text: '上次更新' },
          docFooter: { prev: '上一篇', next: '下一篇' },
          returnToTopLabel: '回到顶部',
          sidebarMenuLabel: '菜单',
          darkModeSwitchLabel: '主题',
          lightModeSwitchTitle: '切换到浅色模式',
          darkModeSwitchTitle: '切换到深色模式',
          // 中文内容为源文件,英文为 CI 生成的机器翻译,只开放中文侧的编辑入口
          editLink: {
            pattern: `${GITHUB_DOCS}/edit/main/docs/:path`,
            text: '编辑此页'
          }
        }
      }
    },

    head: [
      ['link', { rel: 'icon', href: '/img/favicon.ico' }],
      ['meta', { name: 'theme-color', content: '#0a72ef' }],
      // html 类标记(内联在 head 中于首帧前执行,无闪烁),配合
      // theme/custom.css 控制全站 chrome 的显隐:
      //   - embedded:隐藏全站导航栏/页脚(SiteNavbar/SiteFooter)并清空其
      //     占位。首行的 iframe 检测保留(参考 eaf3930)——后续若恢复
      //     "仅 iframe 嵌入时隐藏"的策略,删掉下方无条件标记即可;
      //     目前常规构建也始终隐藏
      //   - doc-only:独立站与产品内嵌变体共用,恢复 doc 专属顶栏(DocHeader)
      //     的高度占位,页脚保持隐藏
      //   - doc-embedded:产品内嵌变体添加,在共用布局上调整品牌区和间距
      [
        'script',
        {},
        [
          "if (window.self !== window.top) document.documentElement.classList.add('embedded');",
          "document.documentElement.classList.add('embedded');",
          DOC_ONLY || DOC_EMBEDDED ? "document.documentElement.classList.add('doc-only');" : '',
          DOC_EMBEDDED ? "document.documentElement.classList.add('doc-embedded');" : ''
        ]
          .filter(Boolean)
          .join('')
      ]
    ],

    markdown: {
      lineNumbers: true,
      config: (md) => {
        // vdoing 时代语法的运行时适配(内容文件保持原样,不改写)
        md.use(legacyCodeTabs)
        md.use(legacyLinks)
        md.use(footnote)
        md.use(taskLists)
        // 自定义容器示例:通过 markdown-it-container 注册(2.0 起可改为声明式
        // markdown.container.customContainers)
        md.use(container, 'success', {
          render: (tokens, idx) =>
            tokens[idx].nesting === 1
              ? '<div class="tip custom-block"><p class="custom-block-title">SUCCESS</p>\n'
              : '</div>\n'
        })
      }
    },

    // mermaid 由插件客户端代码动态 import,逃过 Vite 依赖扫描,未预构建时
    // 其内部对 dayjs(UMD)的 ESM 具名导入会在 dev 下报错,强制预构建修复
    vite: {
      optimizeDeps: {
        include: ['mermaid', 'dayjs']
      }
    },

    themeConfig: {
      logo: '/img/logo.png',
      socialLinks: [{ icon: 'github', link: 'https://github.com/deepflowio/deepflow' }],
      sidebar,

      search: {
        provider: 'local',
        options: {
          // MiniSearch 默认按空白分词,中文整句无法命中,改用 Intl.Segmenter 分词
          miniSearch: {
            options: {
              tokenize: (text: string) =>
                [...new Intl.Segmenter('zh-CN', { granularity: 'word' }).segment(text)].map(
                  (s) => s.segment
                )
            }
          }
        }
      }
    }
  })
)
