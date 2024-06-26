<template>
  <main class="page content-layout-container">
    <div class="main-content">
      <slot name="siderbar" />

      <div :class="`theme-vdoing-wrapper ${bgStyle}`">
        <ArticleInfo v-if="isArticle()" />
        <!-- 本div用于给mermaid画gantt图使用，切勿删除 -->
        <div class="mermaid-contianer"></div>
        <component
          class="theme-vdoing-content"
          v-if="pageComponent"
          :is="pageComponent"
        />

        <div class="content-wrapper">
          <h1 v-if="showTitle">
            <img
              :src="currentBadge"
              v-if="$themeConfig.titleBadge === false ? false : true"
            />{{ title
            }}<span class="title-tag" v-if="$frontmatter.titleTag">{{
              $frontmatter.titleTag
            }}</span>
          </h1>
          <div class="docs-time">
            <span class="time"
              >{{ locales[lang].createdAt }}：{{ creatAt }}</span
            >
            <span class="time"
              >{{ locales[lang].updateAt }}：{{ updateAt }}</span
            >
          </div>

          <slot name="top" v-if="isShowSlotT" />

          <Content class="theme-vdoing-content" />
        </div>

        <slot name="bottom" v-if="isShowSlotB" />

        <!-- <PageEdit /> -->

        <!-- <PageNav v-bind="{ sidebarItems }" /> -->
      </div>

      <RightMenu />
    </div>
  </main>
</template>

<script>
import PageEdit from "@theme/components/PageEdit.vue";
import PageNav from "@theme/components/PageNav.vue";
import ArticleInfo from "./ArticleInfo.vue";
import RightMenu from "./RightMenu.vue";

import TitleBadgeMixin from "../mixins/titleBadge";

import locales from "./../locales/index";

export default {
  mixins: [TitleBadgeMixin],
  data() {
    return {
      locales,
      updateBarConfig: null,
    };
  },
  props: ["sidebarItems"],
  components: {
    PageEdit,
    PageNav,
    ArticleInfo,
    RightMenu,
  },
  created() {
    this.updateBarConfig = this.$themeConfig.updateBar;
  },
  computed: {
    creatAt() {
      return this.$frontmatter.creatAt?.split("T")[0] ?? '--'
    },
    updateAt() {
      return this.$frontmatter.updateAt?.split("T")[0] ?? '--'
    },
    title() {
      const {
        $page: { title, regularPath },
      } = this;
      return title || (regularPath.endsWith("/") ? "README" : "");
    },
    bgStyle() {
      const { contentBgStyle } = this.$themeConfig;
      return contentBgStyle ? "bg-style-" + contentBgStyle : "";
    },
    isShowUpdateBar() {
      return this.updateBarConfig &&
        this.updateBarConfig.showToArticle === false
        ? false
        : true;
    },
    showTitle() {
      return !this.$frontmatter.pageComponent;
    },
    showRightMenu() {
      const { $frontmatter, $themeConfig, $page } = this;
      const { sidebar } = $frontmatter;
      return (
        $themeConfig.rightMenuBar !== false &&
        $page.headers &&
        ($frontmatter && sidebar && sidebar !== false) !== false
      );
    },
    pageComponent() {
      return this.$frontmatter.pageComponent
        ? this.$frontmatter.pageComponent.name
        : false;
    },
    isShowSlotT() {
      return this.getShowStatus("pageTshowMode");
    },
    isShowSlotB() {
      return this.getShowStatus("pageBshowMode");
    },
    lang() {
      return this.$page.relativePath.indexOf("zh/") > -1 ? "zh" : "en";
    },
  },
  methods: {
    getShowStatus(prop) {
      const { htmlModules } = this.$themeConfig;
      if (!htmlModules) return false;
      if (htmlModules[prop] === "article") {
        // 仅文章页显示
        return this.isArticle();
      } else if (htmlModules[prop] === "custom") {
        // 仅自定义页显示
        return !this.isArticle();
      } else {
        // 全部显示
        return true;
      }
    },
    isArticle() {
      return this.$frontmatter.article !== false;
    },
  },
};
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page.content-layout-container
  position relative
  width: 100%
  box-sizing: border-box;
  padding-left: 24px;
  padding-right: 24px;
  margin: 0 auto
  @media (max-width $MQMobile)
    min-width 0
  .main-content
    box-shadow: none
    margin-top: calc(3.6rem + 36px)
    display: flex
    justify-content: space-between
    background-color: transparent
    align-items: flex-start
    padding 0
    @media (max-width $MQMobile)
      margin-top 0
      padding 0
      display: block
      position relative

.page
  flex: 1
  padding-bottom 2rem
  display block
  @media (max-width $MQMobile)
    padding-top $navbarHeight
  @media (min-width $MQMobile)
    // padding-top: ($navbarHeight + 1.5rem)
  >*
    @extend $vdoing-wrapper
.theme-vdoing-wrapper
  margin-left: 24px;
  margin-right: 30px;
  flex: 1;
  min-width: 0;
  background-color: var(--mainBg)
  @media (max-width $MQMobile)
    margin: 0
  .content-wrapper
    position relative
  h1
    margin-bottom: 10px
    .title-tag
      height 1.5rem
      line-height 1.5rem
      border 1px solid $activeColor
      color $activeColor
      font-size 1rem
      padding 0 0.4rem
      border-radius 0.2rem
      margin-left 0.5rem
      transform translate(0, -0.25rem)
      display inline-block
    img
      margin-bottom -0.2rem
      margin-right 0.2rem
      width 2.2rem
      height 2.2rem
  .docs-time
    display: flex
    gap: 1.2rem
    align-items: center
    font-size: 0.7rem
    padding-left: 2.4rem

.theme-vdoing-wrapper
  --linesColor rgba(50, 0, 0, 0.05)
  &.bg-style-1 // 方格
    background-image linear-gradient(90deg, var(--linesColor) 3%, transparent 3%), linear-gradient(0deg, var(--linesColor) 3%, transparent 3%)
    background-position center center
    background-size 20px 20px
  &.bg-style-2 // 横线
    background-image repeating-linear-gradient(0, var(--linesColor) 0, var(--linesColor) 1px, transparent 0, transparent 50%)
    background-size 30px 30px
  &.bg-style-3 // 竖线
    background-image repeating-linear-gradient(90deg, var(--linesColor) 0, var(--linesColor) 1px, transparent 0, transparent 50%)
    background-size 30px 30px
  &.bg-style-4 // 左斜线
    background-image repeating-linear-gradient(-45deg, var(--linesColor) 0, var(--linesColor) 1px, transparent 0, transparent 50%)
    background-size 20px 20px
  &.bg-style-5 // 右斜线
    background-image repeating-linear-gradient(45deg, var(--linesColor) 0, var(--linesColor) 1px, transparent 0, transparent 50%)
    background-size 20px 20px
  &.bg-style-6 // 点状
    background-image radial-gradient(var(--linesColor) 1px, transparent 1px)
    background-size 10px 10px
// 背景纹适应深色模式
.theme-mode-dark
  .theme-vdoing-wrapper
    --linesColor rgba(125, 125, 125, 0.05)
/**
 * 右侧菜单的自适应
 */
@media (min-width 720px) and (max-width 1279px)
  .have-rightmenu
    .page
      padding-right 0.8rem !important
@media (max-width 1279px)
  .have-rightmenu
    .right-menu-wrapper
      display none
@media (min-width 1280px)
  .have-rightmenu
    .sidebar .sidebar-sub-headers
      display none
// 左侧边栏只有一项且没有右侧边栏时
.theme-container.only-sidebarItem:not(.have-rightmenu)
  .sidebar, .sidebar-button
    display none
  @media (min-width ($MQMobile + 1px))
    .page
      padding-left 0.8rem !important
  @media (max-width $MQMobile)
    .page
      padding-left 0rem !important
    .sidebar, .sidebar-button
      display block
// 左侧边栏只有一项且有右侧边栏时
.theme-container.only-sidebarItem.have-rightmenu
  @media (min-width 720px) and (max-width 1279px)
    .sidebar, .sidebar-button
      display block
  @media (min-width 1280px)
    .sidebar, .sidebar-button
      display none
</style>
