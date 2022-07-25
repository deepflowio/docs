<template>
  <div class="articleInfo-wrap">
    <div class="articleInfo">
      <!-- 面包屑 -->
      <ul class="breadcrumbs">
        <li>
          <router-link :to="homeUrl" class="iconfont icon-home" title="首页" />
        </li>

        <li v-for="item in classifyList" :key="item">
          <!-- 跳目录页 -->
          <!-- <router-link :to="getLink(item)">{{ item }}</router-link> -->
          <span>{{ item }}</span>
        </li>
      </ul>

      <!-- 作者&日期 -->
      <div class="info">
        <div class="author iconfont icon-touxiang" title="作者" v-if="author">
          <a
            :href="author.href || author.link"
            v-if="
              author.href || (author.link && typeof author.link === 'string')
            "
            target="_blank"
            class="beLink"
            title="作者"
            >{{ author.name }}</a
          >
          <a v-else href="javascript:;">{{ author.name || author }}</a>
        </div>
        <div class="date iconfont icon-riqi" title="创建时间" v-if="date">
          <a href="javascript:;">{{ date }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const LOCALES = require("../page-locales/index.js");

export default {
  data() {
    return {
      date: "", // 创建时间
      classifyList: [], // 面包屑
      cataloguePermalink: "", //
      author: null, // 作者信息
    };
  },
  created() {
    this.getPageInfo();
  },
  watch: {
    "$route.path"() {
      this.classifyList = [];
      this.getPageInfo();
    },
  },
  computed: {
    homeUrl() {
      return this.$page.relativePath.indexOf("zh/") > -1 ? "/zh/" : "/";
    },
  },
  methods: {
    getPageInfo() {
      const pageInfo = this.$page;
      const { relativePath } = pageInfo;

      // 调整面包屑获取函数
      // 先过滤掉空的部分
      let reuslt = relativePath.split("/").filter(Boolean);
      // 清除掉最后一位
      reuslt.pop();
      // 默认是en
      let lang = "en";
      if (Object.prototype.hasOwnProperty.call(LOCALES, reuslt[0])) {
        lang = reuslt[0];
        reuslt.shift();
      }
      reuslt = reuslt
        .map((item) => {
          const itemArr = item.split("-");
          if (itemArr.length === 1) {
            // 只有一个的时候是不需要去掉头部的
            return item;
          }
          itemArr.shift();
          return itemArr.join("-");
        })
        .map((item, index, _this) => {
          const str = _this.slice(0, index + 1).join("/");
          // 先从根路径寻找全路径，然后再找本身翻译，最后返回自身
          return LOCALES[lang][str] || LOCALES[lang][item] || item;
        });
      // 如果存在 - 则截取 - 后面部分；否则直接返回
      this.classifyList = reuslt;

      // 提取时间有以及作者
      this.author = this.$frontmatter.author || this.$themeConfig.author; // 作者
      this.date = (pageInfo.frontmatter.date || "").split(" ")[0]; // 文章创建时间
    },
  },
};
</script>

<style lang="stylus" scoped>
@require '../styles/wrapper.styl'

.articleInfo-wrap
  @extend $wrapper
  position relative
  z-index 1
  color #888
  .articleInfo
    overflow hidden
    font-size 0.92rem
    .breadcrumbs
      margin 0
      padding 0
      overflow hidden
      display inline-block
      line-height 2rem
      @media (max-width 960px)
        width 100%
      li
        list-style-type none
        float left
        padding-right 5px
        &:after
          content '/'
          margin-left 5px
          color #999
        &:last-child
          &:after
            content ''
        a
          color #888
          &:before
            font-size 0.92rem
          &:hover
            color $accentColor
        .icon-home
          text-decoration none
    .info
      float right
      line-height 32px
      @media (max-width 960px)
        float left
      div
        float left
        margin-left 20px
        font-size 0.8rem
        @media (max-width 960px)
          margin 0 20px 0 0
        &:before
          margin-right 3px
        a
          color #888
          &:hover
            text-decoration none
        a.beLink
          &:hover
            color $accentColor
            text-decoration underline
</style>
