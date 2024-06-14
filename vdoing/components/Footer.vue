<template>
  <div class="footer">
    <div class="footer mobile" :style="mobileBg">
      <div class="footrigcon" v-if="lang === 'zh'">
        <h4>产品</h4>
        <div class="lia">
          <a href="https://www.yunshan.net/products/deepflow.html"
            >DeepFlow Enterprise</a
          >
          <span></span>
          <a href="http://cloud.deepflow.yunshan.net/">DeepFlow Cloud</a>
        </div>
        <h4>DeepFlow Enterprise 解决方案</h4>
        <div class="lia">
          <a href="https://www.yunshan.net/solutions/npb.html"
            >NPB 混合云全网流量采集与分发</a
          >
          <span></span>
          <a href="https://www.yunshan.net/solutions/npmd.html"
            >NPMD 混合云网络监控诊断</a
          >
          <span></span>
          <a href="https://www.yunshan.net/solutions/5GC.html"
            >5G核心网网络功能服务监控</a
          >
          <span></span>
          <a href="https://www.yunshan.net/solutions/dfcon.html" target="_blank"
            >容器化微服务可观测性方案</a
          >
        </div>
        <h4>DeepFlow Enterprise 案例学习</h4>
        <div class="lia">
          <a href="https://www.yunshan.net/cases/deepflow.html">客户案例</a>
          <span></span>
          <a
            href="https://www.yunshan.net/cooperation/ysaliyun.html"
            target="_blank"
            >阿里混合云网络监控实践</a
          >
          <span></span>
          <a
            href="https://www.yunshan.net/cooperation/ystencentcloud.html"
            target="_blank"
            >腾讯金融行业云监控实践</a
          >
        </div>
        <h4>关于</h4>
        <div class="lia">
          <a href="https://www.yunshan.net/about.html#description">关于我们</a>
          <span></span>
          <a href="https://www.yunshan.net/about.html#founders">创始人</a>
          <span></span>
          <a href="https://www.yunshan.net/about.html#investors">投资者</a>
          <span></span>
          <a href="https://www.yunshan.net/about.html#history">云杉历程</a>
          <span></span>
          <a href="https://www.yunshan.net/about.html#contact">联系我们</a>
        </div>
      </div>
      <p class="copyright">
        Copyright© <span class="year">2022</span> YUNSHAN Networks
      </p>
    </div>
    <div class="links-container web">
      <div class="links-container-box">
        <ul class="links-list" v-if="lang === 'zh'">
          <li class="links-item">
            <span class="links-title">产品</span>
            <a
              href="https://www.yunshan.net/products/deepflow.html"
              target="_blank"
              >DeepFlow Enterprise</a
            >
            <a href="https://cloud.deepflow.yunshan.net/" target="_blank"
              >DeepFlow Cloud</a
            >
          </li>
          <li class="links-item">
            <span class="links-title">DeepFlow Enterprise 解决方案</span>
            <a href="https://www.yunshan.net/solutions/npb.html" target="_blank"
              >NPB 混合云全网流量采集与分发</a
            >
            <a
              href="https://www.yunshan.net/solutions/npmd.html"
              target="_blank"
              >NPMD 混合云网络监控诊断</a
            >
            <a href="https://www.yunshan.net/solutions/5GC.html" target="_blank"
              >5G核心网网络功能服务监控</a
            >
            <a
              href="https://www.yunshan.net/solutions/dfcon.html"
              target="_blank"
              >容器化微服务可观测性方案</a
            >
          </li>
          <li class="links-item">
            <span class="links-title">DeepFlow Enterprise 案例学习</span>
            <a
              href="https://www.yunshan.net/cases/deepflow.html"
              target="_blank"
              >客户案例</a
            >
            <a
              href="https://www.yunshan.net/cooperation/ysaliyun.html"
              target="_blank"
              >阿里混合云网络监控实践</a
            >
            <a
              href="https://www.yunshan.net/cooperation/ystencentcloud.html"
              target="_blank"
              >腾讯金融行业云监控实践</a
            >
          </li>
          <li class="links-item">
            <span class="links-title">关于</span>
            <a
              href="https://www.yunshan.net/about.html#description"
              target="_blank"
              >关于我们</a
            >
            <a
              href="https://www.yunshan.net/about.html#founders"
              target="_blank"
              >创始人</a
            >
            <a
              href="https://www.yunshan.net/about.html#investors"
              target="_blank"
              >投资者</a
            >
            <a href="https://www.yunshan.net/about.html#history" target="_blank"
              >云杉历程</a
            >
            <a href="https://www.yunshan.net/about.html#contact" target="_blank"
              >联系我们</a
            >
          </li>
        </ul>
        <p class="foot-content">
          Copyright© <span class="year">2022</span> YUNSHAN Networks
        </p>
      </div>
    </div>

    <div class="ys-model" style="display: none">
      <div class="ys-model-masking"></div>
      <span id="copy-content">https://cloud.deepflow.yunshan.net</span>
      <div class="ys-model-contianer captcha-box">
        <div class="ys-model-contianer-title">温馨提示</div>
        <div class="ys-model-contianer-content">
          <p class="content-text">请切换到PC端，登录DeepFlow</p>
        </div>
        <div class="ys-model-contianer-footer">
          <button id="copy-button" class="primary-button">复制网址</button>
        </div>
      </div>
    </div>

    <div id="ys-toast" class="ys-toast hide" style="display: none">
      <svg
        t="1643013372801"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2147"
        width="16"
        height="16"
      >
        <path
          d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667 85.333333 747.637333 85.333333 512 276.362667 85.333333 512 85.333333z m182.613333 297.354667a32 32 0 0 0-45.258666 0.032L458.922667 573.44l-84.341334-83.989333a32 32 0 0 0-45.162666 45.344l106.986666 106.549333a32 32 0 0 0 45.226667-0.064l213.013333-213.333333a32 32 0 0 0-0.032-45.258667z"
          p-id="2148"
          fill="#67C23A"
        ></path></svg><span>复制成功！</span>
    </div>
    <div class="nav-list mobile">
      <div class="masking"></div>
      <ul class="nav-list-box" style="height: 1px">
        <li class="nav-link" data-name="deepflow-cloud">
          {{ locales[lang].product }}
        </li>
        <li class="nav-link" data-name="eBPF">
          {{ locales[lang].eBPF }}
        </li>
        <li class="nav-link active" data-name="docs">
          {{ locales[lang].docs }}
        </li>
        <li class="nav-link" data-name="blog">
          {{ locales[lang].blog }}
         
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import locales from "./../locales/index";
export default {
  data() {
    return {
      locales,
      mobileBg:
        "background: url(https://www.yunshan.net/news/images/footer/footbg.png) no-repeat center;background-size: cover;",
    };
  },
  computed: {
    social() {
      return this.$themeConfig.social;
    },
    footer() {
      return this.$themeConfig.footer;
    },
    lang() {
      return this.$page.relativePath.indexOf("zh/") > -1 ? "zh" : "en";
    },
  },
  mounted() {
    setTimeout(() => {
      const year = new Date().getFullYear();
      document.querySelectorAll(".year").forEach((dom) => {
        dom.innerHTML = year;
      });
    }, 500);
  },
};
</script>

<style lang="stylus">
// $mobileSidebarWidth = $sidebarWidth * 0.82
.footer
  // padding 5rem 1.5rem 2.5rem
  // text-align center
  color #666
  box-sizing border-box
  font-size 0.85rem
  transition all 0.2s ease
  > span
    line-height 1.5rem
  .icons
    margin-bottom 12px
    .iconfont
      padding 0 10px
      font-size 1.3rem
  a
    color inherit
    &:hover
      color $accentColor
@media (min-width ($MQMobile + 1px))
  .sidebar-open .footer
    width auto
    // padding-left: ($sidebarWidth + 1.5rem)
@media (min-width 1520px)
  .have-rightmenu .footer
    // padding-right: ($rightMenuWidth + 1.5rem)
.no-sidebar .footer
  width auto
  // padding-left 1.5rem
</style>
