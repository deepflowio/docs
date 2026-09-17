<template>
  <!-- 对齐旧版 vdoing/components/Footer.vue:深色链接矩阵(仅中文页)+ 居中版权行。
       渲染规则与官方 VPFooter 一致:仅在无侧边栏的页面(首页/404)显示,
       内容页(侧边栏可见)不渲染,避免与全高侧边栏重叠 -->
  <footer v-if="show" class="df-footer">
    <!-- 桌面端 -->
    <div class="web">
      <ul v-if="isZh" class="links-list">
        <li v-for="col in columns" :key="col.title" class="links-item">
          <span class="links-title">{{ col.title }}</span>
          <a
            v-for="link in col.links"
            :key="link.text"
            :href="link.href"
            target="_blank"
            rel="noopener"
            >{{ link.text }}</a
          >
        </li>
      </ul>
      <p class="foot-content">Copyright© {{ year }} YUNSHAN Networks</p>
    </div>

    <!-- 移动端(对齐旧版 .footer.mobile,含云杉背景图) -->
    <div class="mobile" :style="mobileBg">
      <div v-if="isZh" class="footrigcon">
        <template v-for="col in columns" :key="col.title">
          <h4>{{ col.title }}</h4>
          <div class="lia">
            <template v-for="(link, i) in col.links" :key="link.text">
              <span v-if="i > 0" class="divider"></span>
              <a :href="link.href">{{ link.text }}</a>
            </template>
          </div>
        </template>
      </div>
      <p class="copyright">Copyright© {{ year }} YUNSHAN Networks</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang, page, frontmatter, theme } = useData()
const isZh = computed(() => lang.value?.startsWith('zh'))
const year = new Date().getFullYear()
const mobileBg =
  'background: url(https://www.yunshan.net/news/images/footer/footbg.png) no-repeat center;background-size: cover;'

// 判定逻辑对齐官方 useSidebar:有侧边栏的内容页不渲染 footer。
// 注意 sidebar 可能是数组,也可能是多侧边栏对象 { '/zh/': [...], '/': [...] }
const show = computed(() => {
  if (frontmatter.value.footer === false) return false
  const sb = theme.value.sidebar
  const sidebarConfigured = Array.isArray(sb) ? sb.length > 0 : !!sb
  const hasSidebar =
    sidebarConfigured &&
    !page.value.isNotFound &&
    frontmatter.value.layout !== 'home' &&
    frontmatter.value.layout !== 'page'
  return !hasSidebar
})

// 链接矩阵与旧版 Footer.vue 完全一致
const columns = [
  {
    title: '产品',
    links: [
      { text: 'DeepFlow Enterprise', href: 'https://www.yunshan.net/products/deepflow.html' },
      { text: 'DeepFlow Cloud', href: 'https://cloud.deepflow.yunshan.net/' }
    ]
  },
  {
    title: 'DeepFlow Enterprise 解决方案',
    links: [
      { text: 'NPB 混合云全网流量采集与分发', href: 'https://www.yunshan.net/solutions/npb.html' },
      { text: 'NPMD 混合云网络监控诊断', href: 'https://www.yunshan.net/solutions/npmd.html' },
      { text: '5G核心网网络功能服务监控', href: 'https://www.yunshan.net/solutions/5GC.html' },
      { text: '容器化微服务可观测性方案', href: 'https://www.yunshan.net/solutions/dfcon.html' }
    ]
  },
  {
    title: 'DeepFlow Enterprise 案例学习',
    links: [
      { text: '客户案例', href: 'https://www.yunshan.net/cases/deepflow.html' },
      { text: '阿里混合云网络监控实践', href: 'https://www.yunshan.net/cooperation/ysaliyun.html' },
      {
        text: '腾讯金融行业云监控实践',
        href: 'https://www.yunshan.net/cooperation/ystencentcloud.html'
      }
    ]
  },
  {
    title: '关于',
    links: [
      { text: '关于我们', href: 'https://www.yunshan.net/about.html#description' },
      { text: '创始人', href: 'https://www.yunshan.net/about.html#founders' },
      { text: '投资者', href: 'https://www.yunshan.net/about.html#investors' },
      { text: '云杉历程', href: 'https://www.yunshan.net/about.html#history' },
      { text: '联系我们', href: 'https://www.yunshan.net/about.html#contact' }
    ]
  }
]
</script>

<style scoped>
.df-footer {
  font-family:
    PingFangSC-Regular,
    'PingFang SC',
    sans-serif;
  position: relative;
  z-index: 21;
}

@media screen and (min-width: 801px) {
  .mobile {
    display: none;
  }
}
@media screen and (max-width: 800px) {
  .web {
    display: none;
  }
}

/* ===== 桌面端(对齐旧版 .links-container) ===== */
.web {
  background-color: rgb(37, 37, 37);
  padding: 50px 0 38px 0;
}
.links-list {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  margin: 0 0 120px 0;
  padding: 0;
  list-style: none;
}
.links-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.links-title {
  color: #d7d8d9;
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 10px;
  font-weight: 500;
}
.links-item > a {
  color: #9b9ea0;
  font-size: 14px;
  line-height: 25px;
  text-decoration: none;
}
.links-item > a:hover {
  color: #0a72ef;
}
.foot-content {
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  color: #939393;
  margin: 0;
}

/* ===== 移动端(对齐旧版 .footer.mobile) ===== */
.mobile {
  padding: 1px 2.2568rem;
  color: #dddddd;
  font-size: 14px;
  box-sizing: border-box;
}
.footrigcon {
  padding: 1.7121rem 0 0 0;
  color: #dcdfe6;
}
.footrigcon h4 {
  margin-top: 0.7877rem;
  margin-bottom: 0;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.40625rem;
}
.footrigcon .lia a {
  color: #dddddd;
  line-height: 1.5625rem;
  text-decoration: none;
}
.footrigcon .lia a:hover {
  color: #396aff;
}
.divider {
  width: 0.0625rem;
  height: 0.9375rem;
  background: #dddddd;
  display: inline-block;
  margin: 0 0.3124rem;
}
.copyright {
  margin: 1rem 0 0;
}
</style>
