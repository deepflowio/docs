// 解决代码选项卡无法加载的问题
import Vue from 'vue'
import Router from 'vue-router'
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import CodeBlock from "@theme/global-components/CodeBlock.vue"
import CodeGroup from "@theme/global-components/CodeGroup.vue"
// Register the Vue global component
Vue.component(CodeBlock)
Vue.component(CodeGroup)

function decode (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("Error decoding \"" + str + "\". Leaving it intact."));
    }
  }
  return str
}

function getUrlParam (string, name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(string) || [, ""])[1].replace(/\+/g, '%20')) || null
}

const VueRouterMatch = Router.prototype.match
Router.prototype.match = function match (raw, currentRoute, redirectedFrom) {
  if (typeof raw === 'string') {
    raw = decode(raw)
  }
  return VueRouterMatch.call(this, raw, currentRoute, redirectedFrom)
}

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // 修复ISO8601时间格式为普通时间格式，以及添加作者信息
  siteData.pages.map(item => {
    const { frontmatter: { date, author } } = item
    if (typeof date === 'string' && date.charAt(date.length - 1) === 'Z') {
      item.frontmatter.date = repairUTCDate(date)
    }
    if (author) {
      item.author = author
    } else {
      if (siteData.themeConfig.author) {
        item.author = siteData.themeConfig.author
      }
    }
  })

  // 暂时只需要线上数据
  getEnv() === 'production' && Sentry.init({
    Vue,
    dsn: "https://eb2402a29dcf400cb100ea34d0538e3f@deepflow.yunshan.net/sentry/8",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["localhost", "deepflow.yunshan.net", /^\//],
        beforeNavigate: context => {
          if (typeof window === 'undefined') {
            return context
          }
          context.name = window.location.pathname
          const from = getUrlParam(window.location.href, 'from') || sessionStorage.getItem("YS_COMMUNITY_DOCS_FROM") || ''
          from && sessionStorage.setItem("YS_COMMUNITY_DOCS_FROM", from)
          context.tags = context.tags || {}
          context.tags.from = context.tags.from || from || 'default'
          // 增加来源tag处理，只有pagload需要处理
          context.op === 'pageload' && (context.tags.referrer = referrerTransform(window.document.referrer))
          return context
        },
      }),
    ],
    environment: 'production',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

/**
 * 分为5个来源
 * 1. ce-demo
 * 2. self
 * 3. deepflow.yunshan.net
 * 4. github
 * 5. gitlab
 * 6. 其他==自建来源
 * @param {*} referrer 
 * @returns 
 */
function referrerTransform (referrer) {
  if (referrer.startsWith('https://ce-demo.deepflow.yunshan.net/')) {
    return referrer
  }
  if (referrer.startsWith('https://deepflow.yunshan.net')) {
    return 'https://deepflow.yunshan.net/'
  }
  if (referrer.startsWith('https://github.com/')) {
    return 'https://github.com/'
  }
  if (referrer.startsWith('https://gitlab.yunshan.net/')) {
    return 'https://gitlab.yunshan.net/'
  }
  return referrer || 'self'
}

// 修复ISO8601时间格式为普通时间格式
function repairUTCDate (date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return `${date.getUTCFullYear()}-${zero(date.getUTCMonth() + 1)}-${zero(date.getUTCDate())} ${zero(date.getUTCHours())}:${zero(date.getUTCMinutes())}:${zero(date.getUTCSeconds())}`;
}
// 小于10补0
function zero (d) {
  return d.toString().padStart(2, '0')
}

// 获取下环境变量
function getEnv () {
  if (typeof window === 'undefined') {
    return 'building'
  }
  if (process.env.NODE_ENV === 'development') {
    return 'development'
  }
  if (window.location.port === '7788') {
    return 'test'
  }
  return 'production'
}