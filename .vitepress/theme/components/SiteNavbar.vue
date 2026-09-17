<template>
  <header :class="['df-navbar', 'global-nav', { 'nav-open': mobileOpen }]">
    <div class="wrap global-nav-inner">
      <a
        class="global-brand"
        :href="homeHref"
        v-bind="linkProps(homeHref)"
        @click="onLinkClick($event, homeHref)"
        aria-label="云杉网络 DeepFlow 首页"
      >
        <img
          class="global-brand-logo"
          :src="withBase('/img/yunshan-logo-white.png')"
          alt="云杉网络 YunShan"
        />
      </a>
      <nav class="global-nav-links" aria-label="全站导航" @mouseleave="openLabel = null">
        <template v-for="item in nav" :key="item.key">
          <a
            v-if="!item.groups"
            :href="item.href"
            :class="{ active: item.key === activeKey }"
            v-bind="linkProps(item.href)"
            @click="onLinkClick($event, item.href)"
            >{{ t(item.label) }}</a
          >
          <div
            v-else
            :class="['global-nav-item', { open: openLabel === item.key }]"
            @mouseenter="openLabel = item.key"
          >
            <button
              type="button"
              :class="['global-nav-item-trigger', { active: item.key === activeKey }]"
              :aria-expanded="openLabel === item.key"
              @click="openLabel === item.key ? (openLabel = null) : (openLabel = item.key)"
            >
              {{ t(item.label) }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              :class="['global-nav-dropdown', { mega: isMega(item) }]"
              :style="isMega(item) ? { gridTemplateColumns: megaColumns(item) } : undefined"
              role="menu"
            >
              <div
                v-for="group in item.groups"
                :key="group.key || item.key"
                class="global-nav-dropdown-group"
              >
                <span v-if="group.label" class="global-nav-dropdown-group-label">{{
                  t(group.label)
                }}</span>
                <a
                  v-for="child in group.items"
                  :key="child.href"
                  :class="['global-nav-dropdown-item', { current: isCurrent(child) }]"
                  :href="resolveHref(child.href)"
                  v-bind="linkProps(child.href)"
                  @click="onLinkClick($event, child.href)"
                >
                  <span class="global-nav-dropdown-item-label">
                    <img
                      v-if="child.icon"
                      class="global-nav-dropdown-item-icon"
                      :src="child.icon"
                      alt=""
                      aria-hidden="true"
                    />
                    {{ t(child.label) }}
                    <span v-if="child.badge" class="global-nav-dropdown-item-tag badge">{{
                      t(child.badge)
                    }}</span>
                  </span>
                  <span v-if="child.tagline" class="global-nav-dropdown-item-tagline">{{
                    t(child.tagline)
                  }}</span>
                </a>
              </div>
            </div>
          </div>
        </template>
      </nav>
      <div class="global-nav-actions">
        <!-- 搜索与语言切换已迁至侧边栏顶部(SidebarActions,sidebar-nav-before
             插槽):iframe 嵌入模式下导航栏隐藏后仍可用 -->
        <div
          :class="['launch-cta', { open: ctaOpen }]"
          @mouseenter="ctaOpen = true"
          @mouseleave="ctaOpen = false"
        >
          <button
            type="button"
            class="launch-cta-btn"
            :aria-expanded="ctaOpen"
            @click="ctaOpen = !ctaOpen"
          >
            {{ isZh ? '立即体验' : 'Get Started' }}
          </button>
          <div class="launch-cta-menu" role="menu">
            <a
              v-for="option in ctaOptions"
              :key="option.en"
              :href="option.href"
              target="_blank"
              rel="noopener noreferrer"
              >{{ isZh ? option.zh : option.en }}</a
            >
          </div>
        </div>
        <button
          class="nav-toggle"
          type="button"
          :aria-label="mobileOpen ? '关闭菜单' : '打开菜单'"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="global-nav-mobile">
      <div v-for="item in nav" :key="item.key" class="global-nav-mobile-group">
        <a
          :href="item.href"
          :class="{ active: item.key === activeKey }"
          v-bind="linkProps(item.href)"
          @click="mobileOpen = false; onLinkClick($event, item.href)"
          >{{ t(item.label) }}</a
        >
        <div v-if="item.groups" class="global-nav-mobile-children">
          <div v-for="group in item.groups" :key="group.key || item.key">
            <span v-if="group.label" class="global-nav-mobile-sublabel">{{ t(group.label) }}</span>
            <a
              v-for="child in group.items"
              :key="child.href"
              :href="resolveHref(child.href)"
              :class="{ current: isCurrent(child) }"
              v-bind="linkProps(child.href)"
              @click="mobileOpen = false; onLinkClick($event, child.href)"
              >{{ t(child.label)
              }}<span v-if="child.badge" class="nav-mobile-tag">{{ t(child.badge) }}</span></a
            >
          </div>
        </div>
      </div>
      <div class="global-nav-mobile-group">
        <span class="global-nav-mobile-label-static">{{ isZh ? '立即体验' : 'Get Started' }}</span>
        <div class="global-nav-mobile-children">
          <a
            v-for="option in ctaOptions"
            :key="option.en"
            :href="option.href"
            target="_blank"
            rel="noopener noreferrer"
            @click="mobileOpen = false"
            >{{ isZh ? option.zh : option.en }}</a
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'

// ===== 结构与数据对应 yunshan_insight src/data/globalNav.js =====

// 合并后大站(yunshan_insight)的线上地址:大站路由在其导航里是 SPA 相对路径,
// 文档站不在同一应用内,需从这里补全为绝对地址。文档站自身仍部署在
// deepflow.io/docs,文档链接保持站内相对路径。域名调整时只改这一处。
const HOST = 'https://deepflow.io'

const DeepflowIcon = withBase('/img/deepflow-icon.svg')

type Bi = { zh: string; en: string }
type NavChild = { label: Bi; href: string; icon?: string; tagline?: Bi; badge?: Bi }
type NavGroup = { key?: string; label?: Bi; items: NavChild[] }
type NavItem = { key: string; label: Bi; href: string; mega?: boolean; groups?: NavGroup[] }

// label/tagline/badge 为中英双语,按当前页面语言取值
const NAV: NavItem[] = [
  {
    key: 'home',
    label: { zh: '首页', en: 'Home' },
    href: HOST + '/'
  },
  {
    key: 'products',
    label: { zh: '产品', en: 'Products' },
    href: HOST + '/products/deepflow/',
    groups: [
      {
        key: 'platform',
        label: { zh: '平台', en: 'Platform' },
        items: [
          {
            label: { zh: 'DeepFlow 业务可观测性平台', en: 'DeepFlow Business Observability Platform' },
            href: HOST + '/products/deepflow/',
            icon: DeepflowIcon,
            tagline: {
              zh: '基于 eBPF 的零埋点业务全链路全栈可观测',
              en: 'Zero-code, full-stack business observability powered by eBPF'
            }
          },
          {
            label: { zh: 'DeepFlow 智能体平台', en: 'DeepFlow AI Agent Platform' },
            href: HOST + '/products/vitamind/',
            tagline: {
              zh: '把事实、场景和专业能力交给人和智能体使用',
              en: 'Facts, scenarios and expertise for humans and agents'
            }
          }
        ]
      },
      {
        key: 'core-tech',
        label: { zh: '核心技术', en: 'Core Technologies' },
        items: [
          {
            label: { zh: 'eBPF 可观测性', en: 'eBPF Observability' },
            href: HOST + '/products/ebpf/'
          }
        ]
      }
    ]
  },
  {
    key: 'solutions',
    label: { zh: '方案', en: 'Solutions' },
    href: HOST + '/solutions/finance-banking/',
    mega: true,
    groups: [
      {
        key: 'industries',
        label: { zh: '行业', en: 'Industries' },
        items: [
          { label: { zh: '银行金融', en: 'Banking & Finance' }, href: HOST + '/solutions/finance-banking/' },
          { label: { zh: '智能汽车', en: 'Smart Automotive' }, href: HOST + '/solutions/automotive/' },
          { label: { zh: '电力营销', en: 'Power Marketing' }, href: HOST + '/solutions/electricity-marketing/' },
          { label: { zh: '运营商', en: 'Telecom Carriers' }, href: HOST + '/solutions/telecom/' }
        ]
      },
      {
        key: 'scenarios',
        label: { zh: '场景', en: 'Scenarios' },
        items: [
          { label: { zh: 'AI 基础设施', en: 'AI Infrastructure' }, href: HOST + '/solutions/ai-infrastructure/' },
          { label: { zh: '容器化微服务', en: 'Containerized Microservices' }, href: HOST + '/solutions/container-microservice/' },
          { label: { zh: '混合云网络', en: 'Hybrid Cloud Networking' }, href: HOST + '/solutions/npmd/' }
        ]
      },
      {
        key: 'tech-stacks',
        label: { zh: '技术栈', en: 'Tech Stacks' },
        items: [
          { label: { zh: '阿里云', en: 'Alibaba Cloud' }, href: HOST + '/solutions/alibaba-cloud/' },
          { label: { zh: '腾讯云', en: 'Tencent Cloud' }, href: HOST + '/solutions/tencent-cloud/' }
        ]
      }
    ]
  },
  {
    key: 'cases',
    label: { zh: '案例', en: 'Cases' },
    href: HOST + '/cases/'
  },
  {
    key: 'resources',
    label: { zh: '资源', en: 'Resources' },
    href: HOST + '/blog/',
    groups: [
      {
        key: 'resources-list',
        items: [
          { label: { zh: '博客', en: 'Blog' }, href: HOST + '/blog/' },
          { label: { zh: '文档', en: 'Docs' }, href: '__DOCS__' },
          {
            label: { zh: '开源社区', en: 'Open Source Community' },
            href: 'https://github.com/deepflowio/deepflow',
            badge: { zh: '外部链接', en: 'External' }
          }
        ]
      }
    ]
  },
  {
    key: 'about',
    label: { zh: '关于', en: 'About' },
    href: HOST + '/about/',
    groups: [
      {
        key: 'about-list',
        items: [
          { label: { zh: '企业介绍', en: 'Company Profile' }, href: HOST + '/about/' },
          { label: { zh: '新闻中心', en: 'News Center' }, href: HOST + '/about/news/' },
          { label: { zh: '合作伙伴', en: 'Partners' }, href: HOST + '/about/partners/' },
          { label: { zh: '培训认证', en: 'Training & Certification' }, href: HOST + '/about/cert/' }
        ]
      }
    ]
  }
]

// 「立即体验」按钮的两个下一级入口
const CTA_OPTIONS = [
  { zh: '云服务版', en: 'Cloud Service', href: 'https://cloud.deepflow.yunshan.net/login.html' },
  { zh: '社区版', en: 'Community Edition', href: 'https://ce-demo.deepflow.yunshan.net/' }
]

const { lang, site } = useData()
const base = site.value.base // '/docs/'

const isZh = computed(() => lang.value?.startsWith('zh'))

const nav = NAV
const ctaOptions = CTA_OPTIONS
const openLabel = ref<string | null>(null)
const ctaOpen = ref(false)
const mobileOpen = ref(false)

const homeHref = HOST + '/'
// 文档站当前语言的首页地址(站内相对路径)
const docsHref = computed(() => base + (isZh.value ? 'zh/' : ''))
// 文档站属于「资源 → 文档」,该栏目在导航中高亮
const activeKey = 'resources'

const t = (text: Bi | string | undefined): string => {
  if (text && typeof text === 'object') {
    return (isZh.value ? text.zh : text.en) || text.zh
  }
  return text ?? ''
}

// 大站(HOST)链接:与文档站同源,当前窗口 location.replace 跳转——
// 不新开标签,也不把文档站地址留在浏览器历史里(返回键回到进站前页面)
const isHostHref = (href?: string): href is string => !!href && href.startsWith(HOST)

const onLinkClick = (event: MouseEvent, href?: string) => {
  if (!isHostHref(href)) return
  event.preventDefault()
  window.location.replace(href)
}

// 文档站站内链接(含 __DOCS__ 占位)当前窗口打开,其余站外链接新窗口打开
const linkProps = (href?: string): Record<string, string> => {
  if (!href || isHostHref(href) || href.startsWith('__DOCS__') || href.startsWith(base) || href.startsWith('#')) {
    return {}
  }
  return { target: '_blank', rel: 'noopener noreferrer' }
}

const resolveHref = (href: string) => (href === '__DOCS__' ? docsHref.value : href)

const isMega = (item: NavItem) => item.mega || (item.groups?.length ?? 0) > 1

const megaColumns = (item: NavItem) => {
  const n = item.groups?.length ?? 0
  return n === 2 ? '2fr 1fr' : `repeat(${n}, 1fr)`
}

const isCurrent = (child: NavChild) => resolveHref(child.href) === docsHref.value
</script>

<style scoped>
/* 完整移植自 f8d4ed3 / deepflow-insight src/components/Navigation.css,
   自包含设计令牌。文档站差异点:经 layout-top 插槽渲染,由 .df-navbar 固定在顶部;
   搜索框对接 VitePress 本地搜索(点击唤起弹层)。 */
.df-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40; /* var(--vp-z-index-layout-top):此栏经由 layout-top 插槽渲染 */
}

.global-nav {
  --bg-0: #070a10;
  --border-1: rgba(178, 193, 217, 0.12);
  --border-2: rgba(178, 193, 217, 0.22);
  --border-3: rgba(178, 193, 217, 0.36);
  --text-1: #edf2f8;
  --text-2: #aebbd0;
  --text-3: #8997ab;
  --text-white: #ffffff;
  --primary-4: #9a9cff;
  --primary-5: #7c7eff;
  --primary-6: #6f72f2;
  --info-6: #5aa9ff;
  --fill-1: rgba(255, 255, 255, 0.045);
  --glass-surface-strong: rgba(13, 19, 29, 0.96);
  --glass-blur: 10px;
  --shadow-1: 0 28px 80px rgba(0, 0, 0, 0.32);

  font-family:
    'PingFang SC',
    'Noto Sans CJK SC',
    'Microsoft YaHei',
    sans-serif;
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  background: var(--bg-0);
  border-bottom: 1px solid var(--border-1);
  box-shadow: none;
}
.global-nav * {
  box-sizing: border-box;
}
.global-nav a {
  color: inherit;
  text-decoration: none;
}
.global-nav button,
.global-nav a {
  -webkit-tap-highlight-color: transparent;
}
.global-nav button {
  font: inherit;
}
.global-nav :focus-visible {
  outline: 2px solid var(--primary-5);
  outline-offset: 4px;
}
.global-nav .wrap {
  width: min(1280px, calc(100% - 48px));
  margin: 0 auto;
}

.global-nav-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 68px;
  gap: 28px;
}
.global-brand {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  justify-self: start;
}
.global-brand-logo {
  display: block;
  height: 52px;
  width: auto;
}
.global-nav-links {
  display: flex;
  align-items: center;
  justify-self: center;
  gap: 30px;
}
.global-nav-links > a {
  color: var(--text-2);
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s ease;
}
.global-nav-links > a:hover {
  color: var(--text-1);
}
.global-nav-links > a.active,
.global-nav-item-trigger.active {
  color: var(--text-1);
  font-weight: 600;
}

.global-nav-item {
  position: relative;
}
.global-nav-item-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  color: var(--text-2);
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}
.global-nav-item-trigger svg {
  width: 13px;
  height: 13px;
  transition: transform 0.2s ease;
}
.global-nav-item:hover .global-nav-item-trigger,
.global-nav-item.open .global-nav-item-trigger {
  color: var(--text-1);
}
.global-nav-item.open .global-nav-item-trigger svg {
  transform: rotate(180deg);
}

.global-nav-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 22;
  display: none;
  width: 280px;
  padding: 8px;
  transform: translateX(-50%);
  border: 1px solid var(--border-2);
  border-radius: 12px;
  background: var(--glass-surface-strong);
  box-shadow: var(--shadow-1);
  -webkit-backdrop-filter: blur(var(--glass-blur));
  backdrop-filter: blur(var(--glass-blur));
}
.global-nav-item.open .global-nav-dropdown {
  display: block;
}
.global-nav-dropdown-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px 10px 10px;
  border-left: 2px solid transparent;
  border-radius: 8px;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}
.global-nav-dropdown-item:hover {
  border-left-color: var(--primary-5);
  background: rgba(103, 106, 240, 0.16);
}
.global-nav-dropdown-item-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-1);
  font-size: 13.5px;
  font-weight: 600;
}
.global-nav-dropdown-item-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}
.global-nav-dropdown-item.current .global-nav-dropdown-item-label {
  color: var(--primary-4);
}
.global-nav-dropdown-item-tag {
  padding: 1px 8px;
  color: var(--primary-4);
  border: 1px solid rgba(124, 126, 255, 0.38);
  border-radius: 99px;
  background: rgba(103, 106, 240, 0.1);
  font-size: 10px;
  font-weight: 600;
}
.global-nav-dropdown-item-tag.pending {
  color: var(--text-3);
  border: 1px dashed var(--border-3);
  background: transparent;
}
.global-nav-dropdown-item-tag.badge {
  color: var(--text-3);
  border-color: var(--border-2);
  background: var(--fill-1);
}
.global-nav-dropdown-item-tagline {
  color: var(--text-3);
  font-size: 11.5px;
  line-height: 1.5;
}

.global-nav-dropdown-group + .global-nav-dropdown-group {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border-1);
}
.global-nav-dropdown-group-label {
  display: block;
  margin: 4px 0 4px 12px;
  color: var(--text-3);
  font-size: 10.5px;
  letter-spacing: 0.1em;
}
.global-nav-dropdown.mega {
  width: 620px;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}
.global-nav-item.open .global-nav-dropdown.mega {
  display: grid;
}
.global-nav-dropdown.mega .global-nav-dropdown-group {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
.global-nav-dropdown.mega .global-nav-dropdown-group + .global-nav-dropdown-group {
  border-top: 0;
  border-left: 1px solid var(--border-1);
  padding-left: 4px;
}
.global-nav-dropdown.mega .global-nav-dropdown-item-label {
  font-size: 13px;
}

.launch-cta {
  position: relative;
  flex-shrink: 0; /* 不被操作行压缩,避免按钮文本换行 */
}
.launch-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 22px;
  color: var(--text-white);
  border: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--info-6), var(--primary-6));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 6px 20px rgba(111, 114, 242, 0.38);
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap; /* 文本不换行,按钮宽度随内容自适应 */
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.launch-cta-btn:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 8px 26px rgba(111, 114, 242, 0.5);
  transform: translateY(-1px);
}
.launch-cta-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 22;
  display: none;
  width: 168px;
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
.launch-cta-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
}
.launch-cta.open .launch-cta-menu {
  display: block;
}
.launch-cta-menu a {
  display: block;
  padding: 9px 10px;
  color: var(--text-1);
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
}
.launch-cta-menu a:hover {
  background: var(--fill-1);
}

.global-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-self: end;
}
.global-nav-mobile {
  display: none;
  padding: 10px 18px 18px;
  border-top: 1px solid var(--border-1);
  max-height: calc(100vh - 90px);
  overflow-y: auto;
}
.global-nav-mobile-group {
  padding: 4px 0;
}
.global-nav-mobile-group > a,
.global-nav-mobile-label-static {
  display: block;
  padding: 10px 4px;
  color: var(--text-1);
  font-size: 14px;
  font-weight: 600;
}
.global-nav-mobile-group > a.active {
  color: var(--primary-4);
}
.global-nav-mobile-sublabel {
  display: block;
  margin: 8px 0 2px;
  padding-left: 4px;
  color: var(--text-3);
  font-size: 10.5px;
  letter-spacing: 0.08em;
}
.global-nav-mobile-children {
  display: flex;
  flex-direction: column;
  padding-left: 14px;
}
.global-nav-mobile-children a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  color: var(--text-2);
  font-size: 13px;
}
.global-nav-mobile-children a.current {
  color: var(--primary-4);
}
.nav-mobile-tag {
  padding: 1px 7px;
  color: var(--text-3);
  border: 1px dashed var(--border-3);
  border-radius: 99px;
  font-size: 9.5px;
}

.nav-toggle {
  display: none;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  color: var(--text-1);
  border: 0;
  background: transparent;
  cursor: pointer;
}
.nav-toggle svg {
  width: 21px;
  height: 21px;
}

@media (max-width: 980px) {
  .global-nav .wrap {
    width: min(100% - 36px, 720px);
  }
  .global-nav-links {
    display: none;
  }
  .global-nav-inner {
    grid-template-columns: auto 1fr auto;
  }
  .nav-toggle {
    display: inline-flex;
  }
  .global-nav.nav-open .global-nav-mobile {
    display: block;
  }
}
@media (max-width: 640px) {
  .global-nav .wrap {
    width: min(100% - 30px, 520px);
  }
  .global-nav-inner {
    height: 56px;
  }
  .global-brand-logo {
    height: 44px;
  }
  .launch-cta-btn {
    min-height: 34px;
    padding: 0 15px;
    font-size: 12px;
  }
}
</style>
