const { resolve } = require("path");
const json5 = require('json5')
const dayjs = require("dayjs");

module.exports = ({
  theme: resolve(__dirname, "../../vdoing"), // 使用本地主题包
  dest: 'dist',

  locales: {
    "/": {
      lang: "en-US",
      title: "DeepFlow Docs",
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'DeepFlow 文档',
    },
  },
  shouldPrefetch: false,
  base: "/docs/", // 默认'/'。如果你想将你的网站部署到如 https://foo.github.io/bar/，那么 base 应该被设置成 "/bar/",（否则页面将失去样式等文件）

  // 主题配置
  themeConfig: {
    // 导航配置
    nav: [
      {
        text: "PS",
        link: "/PS/0.0/", //目录页链接，此处link是vdoing主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
      },
    ],
    sidebarDepth: 2, // 侧边栏显示深度，默认1，最大2（显示到h3标题）
    logo: "/img/logo.png", // 导航栏logo
    // repo: 'xugaoyi/vuepress-theme-vdoing', // 导航栏右侧生成Github链接
    searchMaxSuggestions: 10, // 搜索结果显示最大数
    lastUpdated: "上次更新", // 开启更新时间，并配置前缀文字   string | boolean (取值为git提交时间)
    docsDir: "docs", // 编辑的文件夹
    editLinks: true, // 启用编辑
    editLinkText: "编辑",

    // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | <自定义>    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为'structuring',将无法使用目录页
    sidebar: "structuring",

    // 页脚信息
    footer: {
      createYear: 2014, // 博客创建年份
      copyrightInfo:
        ' YUNSHAN Networks | 京 ICP 备 14036633号-4 京公网安备 ', // 博客版权信息，支持a标签或换行标签</br>
    },

    // 扩展自动生成frontmatter。（当md文件的frontmatter不存在相应的字段时将自动添加。不会覆盖已有的数据。）
    extendFrontmatter: {},
  },

  // 注入到页面<head>中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
  head: [
    ["link", { rel: "icon", href: "/img/favicon.ico" }], //favicons，资源放在public文件夹
    ["meta", { name: "theme-color", content: "#0a72ef" }], // 移动浏览器主题颜色
  ],

  // 插件配置
  plugins: [
    require("./plugins/fulltext-search/index.js"),
    [require("./plugins/one-click-copy/index.js"), {
      en: {
        copyMessage: "Copied successfully!",
        toolTipMessage: "Copy to clipboard"
      },
      zh: {
        copyMessage: "复制成功",
        toolTipMessage: "复制代码"
      }
    }],
    [
      "vuepress-plugin-zooming", // 放大图片
      {
        selector: ".theme-vdoing-content img:not(.no-zoom)", // 排除class是no-zoom的图片
        options: {
          bgColor: "rgba(0,0,0,0.6)",
        },
      },
    ],
    [
      require("./plugins/mermaidjs/index.js"),
      {
        themeVariables: {
          critBorderColor: "red", // crit 对应的颜色
          critBkgColor: "red", // crit 对应的背景色
          doneTaskBorderColor: "grey", // done 对应的颜色
          doneTaskBkgColor: "lightgrey", // done 对应的背景颜色
          activeTaskBorderColor: "#46bd87", // active 对应的颜色
          activeTaskBkgColor: "#46bd87", // active 对应的颜色
          taskBorderColor: "#46bd87", // 无状态 对应的颜色
          taskBkgColor: "#46bd87", // 无状态 对应的颜色
        },
      },
    ],
  ],

  markdown: {
    lineNumbers: true,
    extractHeaders: ["h1", "h2", "h3", "h4", "h5", "h6"], // 提取标题到侧边栏的级别，默认['h2', 'h3']
    chainMarkdown: md => {
      md.plugin('ys-todo').use(require("./plugins/todo/index")).end();
    },
    extendMarkdown: (md) => {
      md.use(require("./plugins/disable-url-encode/index"));
      md.use(require("./plugins/auto-complete-url/index"));
      md.use(require("./plugins/auto-add-title-order/index"));
      md.use(require("./plugins/footnote/index"));
    },
  },

  // 监听文件变化并重新构建
  extraWatchFiles: ["./../.vuepress/config.js"],

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.json$/,
          type: 'json',
          parser: {
            parse: json5.parse
          }
        }
      ]
    }
  }
});
