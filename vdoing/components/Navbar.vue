<template>
  <header class="navbar blur">
    <!-- <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')" />

    <router-link
      :to="$localePath"
      class="home-link"
    >
      <img
        class="logo"
        v-if="$site.themeConfig.logo"
        :src="$withBase($site.themeConfig.logo)"
        :alt="$siteTitle"
      />
      <span
        ref="siteName"
        class="site-name"
        v-if="$siteTitle"
        :class="{ 'can-hide': $site.themeConfig.logo }"
      >{{ $siteTitle }}</span>
    </router-link>

    <div
      class="links"
      :style="linksWrapMaxWidth ? {
        'max-width': linksWrapMaxWidth + 'px'
      } : {}"
    >
      <AlgoliaSearchBox
        v-if="isAlgoliaSearch"
        :options="algolia"
      />
      <SearchBox
        v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false"
      />
      <NavLinks class="can-hide" />
    </div> -->
    <div class="logo-login-container mobile">
      <div class="flex-y">
        <img
          :src="'/docs/img/side.svg'"
          style="height: 1.625rem; margin-right: 0.7811rem"
          @click="$emit('toggle-sidebar')"
          alt=""
        />
        <img
          class="logo-image"
          @click="linkToHome"
          :src="'/docs/img/logo.svg'"
          alt="logo"
        />
        <div class="blank"></div>
        <div class="lang">
          <img :src="'/docs/img/lang.svg'" alt="" />
          <div class="intl-options-wrapper">
            <ul class="intl-options">
              <li v-for="item in langList" :key="item.prefix">
                <a
                  :class="['lang-a', currentLang === item.type ? 'active' : '']"
                  href="javascript:void(0)"
                  :data-prefix="item.prefix"
                  :data-type="item.type"
                  >{{ item.text }}</a
                >
              </li>
            </ul>
          </div>
        </div>
        <ul class="button-list flex-y">
          <!-- <li class="login-button">
            <a id="signin-m" href="javascript:void(0)">登录</a>
          </li> -->
          <!-- <li id="signup-m" v-if="currentLang === 'zh'" class="to-signup sign-button color-nomal">
            立即体验
          </li> -->
          <li class="color-nomal nav-button" id="nav">
            <img :src="'/docs/img/nav.svg'" alt="nav.png" />
          </li>
        </ul>
      </div>
    </div>
    <div class="logo-login-container web">
      <div class="flex-y width1200">
        <div class="log-image-box">
          <img
            class="logo-image"
            @click="linkToHome"
            :src="'/docs/img/logo.svg'"
            alt="logo"
          />
        </div>
        <ul class="feature-list font-nomal flex-y">
          <li class="feature-item" data-name="deepflow-cloud">
            <span>{{ locales[currentLang].product }}</span>
          </li>
          <li class="feature-item" data-name="community">
            <span>{{ locales[currentLang].openSource }}</span>
          </li>
          <li class="feature-item" data-name="blog">
            <span>{{ locales[currentLang].blog }}</span>
          </li>
          <li class="feature-item active" data-name="docs">
            <span>{{ locales[currentLang].docs }}</span>
          </li>
        </ul>

        <SearchBox
          v-if="
            $site.themeConfig.search !== false &&
            $page.frontmatter.search !== false
          "
        />
        <ul class="button-list flex-y" v-if="currentLang === 'zh'">
          <!-- <li class="login-button">
            <a
              class="color-nomal"
              target="_blank"
              id="signin"
              href="https://cloud.deepflow.yunshan.net/"
              >登录</a
            >
          </li> -->
          <li id="signup" class="sign-button color-nomal to-signup">
            立即体验
          </li>
        </ul>
        <div class="lang">
          <img :src="'/docs/img/lang.svg'" alt="" />
          <div class="intl-options-wrapper">
            <ul class="intl-options">
              <li v-for="item in langList" :key="item.prefix">
                <a
                  :class="['lang-a', currentLang === item.type ? 'active' : '']"
                  href="javascript:void(0)"
                  :data-prefix="item.prefix"
                  :data-type="item.type"
                  >{{ item.text }}</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="option-box"></div>
    </div>
    <div class="top-blank"></div>
  </header>
</template>

<script>
import AlgoliaSearchBox from "@theme/components/AlgoliaSearchBox.vue";
import SearchBox from "@SearchBox";
import SidebarButton from "@theme/components/SidebarButton.vue";
import NavLinks from "@theme/components/NavLinks.vue";
import locales from "./../locales/index";
import { initHead, unbind } from "./../util/header";

export default {
  components: { SidebarButton, NavLinks, SearchBox, AlgoliaSearchBox },

  data() {
    return {
      linksWrapMaxWidth: null,
      langList: [
        {
          prefix: "/zh/",
          type: "zh",
          text: "中文",
        },
        {
          prefix: "/",
          type: "en",
          text: "English",
        },
      ],
      locales,
    };
  },

  mounted() {
    initHead();
    // 执行zoom
    if (window.YS_ZOOM) {
      var featureList = document.getElementsByClassName("feature-list")[0];
      if (featureList) {
        var childrenLen = featureList && featureList.children.length;
        var innerWidth = window.innerWidth;
        var domWidth = innerWidth * 0.07;
        domWidth = Math.max(domWidth, 130);
        featureList.style.width =
          (domWidth / window.YS_ZOOM) * childrenLen + "px";
        if (innerWidth > 1920) {
          featureList.style.fontSize =
            (innerWidth * 0.0083) / window.YS_ZOOM + "px";
        }
      }
    }

    document.querySelectorAll(".lang-a").forEach((element) => {
      const type = element.getAttribute("data-type");
      const prefix = element.getAttribute("data-prefix");
      element.addEventListener("click", () => {
        const currentLang = this.currentLang;
        if (type === currentLang) {
          // 如果是当前语言 就不用跳转
          return false;
        }
        let href1 = "";
        let href2 = "";
        if (currentLang === "en") {
          // 如果当前是英文
          [href1, href2] = window.location.href.split("/docs/");
          href1 = href1 + "/docs";
        } else {
          [href1, href2] = window.location.href.split("/" + currentLang + "/");
        }
        // window.location.href = href1 + prefix + href2;
        this.$router.push("/" + (href1 + prefix + href2).split("/docs/")[1]);
      });
    });

    const MOBILE_DESKTOP_BREAKPOINT = 719; // refer to config.styl
    const NAVBAR_VERTICAL_PADDING =
      parseInt(css(this.$el, "paddingLeft")) +
      parseInt(css(this.$el, "paddingRight"));
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null;
      } else {
        this.linksWrapMaxWidth =
          this.$el.offsetWidth -
          NAVBAR_VERTICAL_PADDING -
          ((this.$refs.siteName && this.$refs.siteName.offsetWidth) || 0);
      }
    };
    handleLinksWrapWidth();
    window.addEventListener("resize", handleLinksWrapWidth, false);
  },

  beforeDestroy() {
    unbind();
  },

  computed: {
    algolia() {
      return (
        this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
      );
    },

    isAlgoliaSearch() {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName;
    },

    currentLang() {
      return this.$page.relativePath.indexOf("zh/") > -1 ? "zh" : "en";
    },
  },
  methods: {
    linkToHome() {
      const currentLang = this.currentLang;
      this.$router.push(currentLang === "en" ? "/" : `/${currentLang}`);
    },
  },
};

function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView;
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property];
}
</script>

<style lang="stylus">
$navbar-vertical-padding = 0.7rem;
$navbar-horizontal-padding = 1.5rem;

.navbar {
  // width: 100vw !important
  // padding $navbar-vertical-padding $navbar-horizontal-padding
  line-height: $navbarHeight - 1.4rem;
  transition: transform 0.3s;

  a, span, img {
    display: inline-block;
  }

  .logo {
    height: $navbarHeight - 1.4rem;
    min-width: $navbarHeight - 1.4rem;
    margin-right: 0.8rem;
    vertical-align: top;
  }

  .site-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--textColor);
    position: relative;
  }

  .links {
    padding-left: 1.5rem;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 0.9rem;
    position: absolute;
    right: $navbar-horizontal-padding;
    top: $navbar-vertical-padding;
    display: flex;

    .search-box {
      flex: 0 0 auto;
      vertical-align: top;
    }
  }
}

.hide-navbar {
  .navbar {
    transform: translateY(-100%);
  }
}

// 959
@media (max-width: $MQNarrow) {
  .navbar {
    .site-name {
      display: none;
    }
  }
}

@media (max-width: $MQMobile) {
  .navbar {
    // padding-left 4rem
    .can-hide {
      display: none;
    }

    .links {
      padding-left: 1.5rem;
    }

    .site-name {
      width: calc(100vw - 9.4rem);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.feature-item {
  position: relative;
}

.option-box {
  width: 100%;
  position: absolute;
  top: 100%;
  display: block;
  height: 62px;
  line-height: 62px;
  left: 0;
  transform: translateY(-300%);
  background-color: rgba(255, 255, 255, 0.2);

  a {
    font-size: var(--font-size-tip);
    display: inline-block;
    height: 100%;
    text-decoration: none;
    color: #0073C0;
  }

  a:hover {
    color: #0088E4;
  }
}
</style>
