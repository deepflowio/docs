import { h, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import SiteNavbar from './components/SiteNavbar.vue'
import DocHeader from './components/DocHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import HomeHero from './components/HomeHero.vue'
import EmbeddedSidebarButton from './components/EmbeddedSidebarButton.vue'
import SidebarActions from './components/SidebarActions.vue'
import './custom.css'
import './markdown.css'
import './search.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    const route = useRoute()
    const initZoom = () =>
      mediumZoom('.vp-doc img:not(.no-zoom)', { background: 'var(--vp-c-bg)' })
    onMounted(initZoom)
    watch(
      () => route.path,
      () => nextTick(initZoom)
    )
    return h(DefaultTheme.Layout, null, {
      // 顶部导航:还原旧版 DeepFlow 自定义导航栏(替代 VitePress 默认 navbar,
      // 默认导航已在 custom.css 中隐藏)
      'layout-top': () => [
        h(SiteNavbar),
        // doc-only 变体的 doc 专属顶栏:常规构建也渲染,但 html 未标记
        // doc-only 时由 custom.css 隐藏(显隐机制与 SiteNavbar 一致)
        h(DocHeader)
      ],
      // 首页 hero:还原旧版 vdoing Home 布局(单行大标题 + 描述)
      'home-hero-info': () => h(HomeHero),
      // 页脚:旧版深色链接矩阵 footer。组件内部按官方 VPFooter 的规则
      // 只在无侧边栏的页面(首页/404)渲染,内容页不显示
      'layout-bottom': () => h(SiteFooter),
      // 嵌入式(iframe)移动端:内容区左上角的侧边栏悬浮按钮(默认隐藏,
      // 仅 html.embedded 且 <960px 显示,见 custom.css)
      'doc-top': () => h(EmbeddedSidebarButton),
      // 侧边栏菜单上方的搜索 + 语言切换(自 SiteNavbar 迁来):iframe 嵌入
      // 模式下导航栏整体隐藏,这两项能力常驻侧边栏保持可用
      'sidebar-nav-before': () => h(SidebarActions)
    })
  }
}
