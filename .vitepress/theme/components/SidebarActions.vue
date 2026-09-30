<template>
  <!-- 侧边栏顶部的主题切换 + 搜索 + 语言切换(自 SiteNavbar 迁来):iframe
       嵌入模式下导航栏整体隐藏(custom.css 的 html.embedded 部分),这几项
       能力经 sidebar-nav-before 插槽常驻侧边栏,桌面端与移动端抽屉中均可用。
       仅文档页有侧边栏,首页等页面不渲染 -->
  <div class="sidebar-actions">
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
    <div class="search-trigger">
      <span class="vpi-search search-icon" aria-hidden="true" />
      <input
        type="text"
        class="search-box"
        readonly
        :placeholder="isZh ? '搜索' : 'Search'"
        aria-label="Search"
        @mousedown.prevent="openSearch"
        @focus="openSearch"
      />
    </div>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, useRouter } from 'vitepress'

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

// isDark 由 VitePress 基于 useDark 提供(storageKey 为
// vitepress-theme-appearance):初始化优先读 localStorage,无记录回退
// config 的 appearance 默认值(dark);翻转该 ref 即切换 <html>.dark
// 类并自动写回 localStorage
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
  // (VitePress 自身程序化打开搜索用的同一方式)
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))
}
</script>

<style scoped>
/* 样式自 SiteNavbar 的 global-nav 迁移:沿用其暗色玻璃设计令牌;布局改为
   侧边栏窄列(桌面端与下方 VPSidebarGroup 的内容列宽
   calc(var(--vp-sidebar-width) - 64px) 对齐) */
.sidebar-actions {
  --border-1: rgba(178, 193, 217, 0.12);
  --border-2: rgba(178, 193, 217, 0.22);
  --border-3: rgba(178, 193, 217, 0.36);
  --text-1: #edf2f8;
  --text-2: #aebbd0;
  --text-3: #8997ab;
  --primary-4: #9a9cff;
  --primary-5: #7c7eff;
  --fill-1: rgba(255, 255, 255, 0.045);
  --glass-surface-strong: rgba(13, 19, 29, 0.96);
  --glass-blur: 10px;
  --shadow-1: 0 28px 80px rgba(0, 0, 0, 0.32);

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  /* 与下方侧边栏分组间的分隔线,颜色同分组分隔线 */
  border-bottom: 1px solid var(--vp-c-divider);
}
/* 浅色模式令牌:本区域嵌在 VPSidebar 内,浅色下侧边栏为白底,暗色玻璃
   令牌换用浅色等价物(导航栏/页脚为刻意的深色品牌设计,不随主题变化) */
html:not(.dark) .sidebar-actions {
  --border-1: rgba(60, 60, 67, 0.12);
  --border-2: rgba(60, 60, 67, 0.22);
  --border-3: rgba(60, 60, 67, 0.36);
  --text-1: var(--vp-c-text-1);
  --text-2: var(--vp-c-text-2);
  --text-3: var(--vp-c-text-3);
  --primary-4: var(--vp-c-brand-1);
  --primary-5: var(--vp-c-brand-1);
  --fill-1: rgba(60, 60, 67, 0.06);
  --glass-surface-strong: rgba(255, 255, 255, 0.98);
  --shadow-1: 0 28px 80px rgba(0, 0, 0, 0.12);
}
.embedded .sidebar-actions {
  padding-top: 0;
}


@media (min-width: 960px) {
  .sidebar-actions {
    width: calc(var(--vp-sidebar-width) - 64px);
  }
}

/* 主题切换:幽灵圆钮,与搜索框同高;图标指示当前主题(暗色显太阳、
   浅色显月亮),点击切换 */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  color: var(--text-2);
  border: 1px solid var(--border-2);
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
  color: var(--text-1);
  border-color: var(--border-3);
}
.theme-toggle:focus-visible {
  outline: 2px solid var(--primary-5);
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

/* 搜索框:暗色玻璃输入框,点击唤起 VitePress 本地搜索 */
.search-trigger {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
}
.search-trigger .search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  color: var(--text-3);
  pointer-events: none;
}
.search-box {
  width: 100%;
  height: 36px;
  line-height: 36px;
  padding: 0 0.5rem 0 2rem;
  color: var(--text-1);
  border: 1px solid var(--border-2);
  border-radius: 2rem;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  background: var(--fill-1);
  transition: border-color 0.2s ease;
}
.search-box:focus {
  border-color: var(--primary-5);
  outline: none;
}
.search-box::placeholder {
  color: var(--text-3);
}

/* 语言切换:玻璃下拉,触发器为幽灵胶囊(左对齐,下拉向下方展开) */
.lang-switch {
  /* 暂时隐藏 */
  display: none;
  position: relative;
}
.lang-switch-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 36px;
  padding: 0 13px;
  color: var(--text-2);
  border: 1px solid var(--border-2);
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
  color: var(--text-1);
  border-color: var(--border-3);
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
  border: 1px solid var(--border-2);
  border-radius: 10px;
  background: var(--glass-surface-strong);
  box-shadow: var(--shadow-1);
  -webkit-backdrop-filter: blur(var(--glass-blur));
  backdrop-filter: blur(var(--glass-blur));
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
  color: var(--text-1);
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
}
.lang-menu a:hover {
  background: var(--fill-1);
}
.lang-menu a.current {
  color: var(--primary-4);
}
</style>
