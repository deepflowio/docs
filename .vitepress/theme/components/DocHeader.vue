<template>
  <!-- doc-only 变体(build:doc-only)专属顶栏:常规构建也渲染本组件,但由
       custom.css 隐藏(html.doc-only 未标记时 .doc-header 不显示),与
       SiteNavbar 的显隐同由构建期写入 head 的 html 类驱动,无需构建开关。
       布局:左 logo / 中搜索 / 右语言切换 + 明暗主题切换。
       搜索/语言/主题的实现与 SidebarActions 一致:点击唤起 VitePress 本地
       搜索、router 切换中英路径、翻转 isDark。配色走 VitePress 主题变量,
       随明暗主题自适应(区别于刻意的深色品牌导航 SiteNavbar) -->
  <header class="doc-header">
    <div class="doc-header-inner">
      <a class="doc-brand" :href="docsHref" aria-label="DeepFlow Docs">
        <img class="doc-brand-logo" :src="withBase('/img/logo.png')" alt="DeepFlow" />
        <span class="doc-brand-name">DeepFlow</span>
      </a>

      <div class="doc-search-trigger">
        <span class="vpi-search search-icon" aria-hidden="true" />
        <input
          type="text"
          class="doc-search"
          readonly
          :placeholder="isZh ? '搜索文档' : 'Search docs'"
          :aria-label="isZh ? '搜索文档' : 'Search docs'"
          @mousedown.prevent="openSearch"
          @focus="openSearch"
        />
      </div>

      <div class="doc-actions">
        <div
          :class="['lang-switch', { open: langOpen }]"
          @mouseenter="langOpen = true"
          @mouseleave="langOpen = false"
        >
          <button
            type="button"
            class="lang-switch-trigger"
            :aria-expanded="langOpen"
            @click="langOpen = !langOpen"
          >
            {{ isZh ? '中' : 'Eng' }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div class="lang-menu" role="menu">
            <a
              v-for="option in langList"
              :key="option.type"
              :class="{ current: currentType === option.type }"
              href="javascript:void(0)"
              @click="switchLang(option.type)"
              >{{ option.text }}</a
            >
          </div>
        </div>
        <button
          type="button"
          class="theme-toggle"
          :aria-label="themeLabel"
          :title="themeLabel"
          @click="toggleTheme"
        >
          <!-- 两个图标常驻 DOM,由 html.dark 类控制显隐(该类在首帧前由
               VitePress 内联脚本按 localStorage 设置),避免水合闪烁 -->
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'

const { lang, site, isDark } = useData()
const router = useRouter()
const base = site.value.base // '/docs/'

const isZh = computed(() => lang.value?.startsWith('zh'))
const currentType = computed(() => (isZh.value ? 'zh' : 'en'))
const langList = [
  { type: 'zh', text: '简体中文' },
  { type: 'en', text: 'English' }
]
const langOpen = ref(false)

// 当前语言文档站首页(站内相对路径)
const docsHref = computed(() => base + (isZh.value ? 'zh/' : ''))

// isDark 由 VitePress 基于 useDark 提供:翻转该 ref 即切换 <html>.dark
// 类并写回 localStorage,详见 SidebarActions 同名实现
function toggleTheme() {
  isDark.value = !isDark.value
}

const themeLabel = computed(() =>
  isDark.value
    ? isZh.value
      ? '切换到浅色模式'
      : 'Switch to light mode'
    : isZh.value
      ? '切换到深色模式'
      : 'Switch to dark mode'
)

function switchLang(type: string) {
  if (type === currentType.value) return
  langOpen.value = false
  let rest = window.location.pathname.slice(base.length)
  if (isZh.value) rest = rest.replace(/^zh\//, '')
  router.go(base + (type === 'zh' ? 'zh/' : '') + rest)
}

function openSearch() {
  // VitePress 本地搜索内置 Cmd+K 监听,合成该事件唤起搜索弹层
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))
}
</script>

<style scoped>
.doc-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40; /* var(--vp-z-index-layout-top):与 SiteNavbar 同层 */
  height: var(--df-doc-header-height, 64px);
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}

.doc-header-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 0 20px;
}

/* 左:logo(彩色图标明暗主题均可用)+ 站名 */
.doc-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  justify-self: start;
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.doc-brand-logo {
  display: block;
  width: 28px;
  height: 28px;
}
.doc-brand-name {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

/* 中:搜索(readonly,点击唤起 VitePress 本地搜索弹层) */
.doc-search-trigger {
  position: relative;
  width: min(320px, 36vw);
  min-width: 0;
}
.doc-search-trigger .search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  color: var(--df-md-text-3);
  pointer-events: none;
}
.doc-search {
  width: 100%;
  height: 38px;
  line-height: 38px;
  padding: 0 1rem 0 2.1rem;
  color: var(--df-md-text-1);
  border: 1px solid var(--df-md-border-2);
  border-radius: 999px;
  font-size: 13.5px;
  font-family: inherit;
  cursor: pointer;
  background: var(--df-md-fill-1);
  transition: border-color 0.2s ease;
}
.doc-search:hover {
  border-color: var(--df-md-primary-6);
}
.doc-search:focus {
  border-color: var(--df-md-primary-6);
  outline: none;
}
.doc-search::placeholder {
  color: var(--df-md-text-3);
}

/* 右:语言切换 + 主题切换 */
.doc-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-self: end;
}

.lang-switch {
  position: relative;
}
.lang-switch-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 38px;
  padding: 0 14px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}
.lang-switch-trigger svg {
  width: 11px;
  height: 11px;
}
.lang-switch:hover .lang-switch-trigger {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}
.lang-switch-trigger:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.lang-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 22;
  display: none;
  width: 132px;
  margin-top: 8px;
  padding: 6px;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-2);
}
/* 透明桥接层:填补 trigger 与弹出层之间 8px 间隙(margin-top 造成的空白
   不属于任何元素,鼠标穿越时会触发容器 mouseleave 导致弹出层关闭) */
.lang-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
}
.lang-switch.open .lang-menu {
  display: block;
}
.lang-menu a {
  display: block;
  padding: 9px 10px;
  color: var(--vp-c-text-2);
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
}
.lang-menu a:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
.lang-menu a.current {
  color: var(--vp-c-brand-1);
}

/* 主题切换:幽灵圆钮,与语言切换同高;图标指示当前主题(暗色显太阳、
   浅色显月亮),点击切换 */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}
.theme-toggle svg {
  width: 16px;
  height: 16px;
}
.theme-toggle:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}
.theme-toggle:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.theme-toggle .icon-moon {
  display: none;
}
html.dark .theme-toggle .icon-sun {
  display: none;
}
html.dark .theme-toggle .icon-moon {
  display: block;
}

/* 移动端:三段改为 auto 1fr auto,搜索占满中间;窄屏收起站名 */
@media (max-width: 719px) {
  .doc-header-inner {
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    padding: 0 14px;
  }
  .doc-search-trigger {
    width: 100%;
  }
}
@media (max-width: 480px) {
  .doc-brand-name {
    display: none;
  }
}
</style>
