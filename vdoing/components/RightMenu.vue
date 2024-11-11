<template>
  <div class="right-menu-wrapper">
    <div class="right-menu-margin">
      <div class="right-menu-content">
        <div
          :class="[
            'right-menu-item',
            'level' + item.level,
            { active: item.slug === hashText },
          ]"
          v-for="(item, i) in headers"
          :key="i"
        >
          <a :href="'#' + item.slug">{{ item.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const isValid = (content) => {
  return /\{#(.+?)\}$/.test(content);
};
const getNewHeaders = (headers) => {
  return headers?.map((v) => {
    let title = v.title;
    let slug = v.slug;
    if (isValid(title)) {
      slug = title.match(/\{#(.+?)\}$/)[1];
      title = title.replace(/\{#(.+?)\}$/, "").trim();
    }
    return {
      ...v,
      slug,
      title,
    };
  });
};
export default {
  data() {
    return {
      headers: [],
      hashText: "",
    };
  },
  mounted() {
    this.getHeadersData();
    this.getHashText();
  },
  watch: {
    $route() {
      this.headers = getNewHeaders(this.$page.headers);
      this.getHashText();
    },
  },
  methods: {
    getHeadersData() {
      this.headers = getNewHeaders(this.$page.headers);
    },
    getHashText() {
      this.hashText = decodeURIComponent(window.location.hash.slice(1));
      if (!this.hashText && this.headers) {
        this.hashText = this.headers[0]?.slug;
      }
    },
  },
};
</script>

<style lang="stylus">
.right-menu-wrapper
  max-height calc(100vh - 3.6rem - 36px)
  width $rightMenuWidth
  overflow-y: auto
  // float right
  // margin-right -($rightMenuWidth + 55px)
  // margin-top -($navbarHeight *2 + 1.5rem)
  position sticky
  top calc(3.6rem + 36px)
  font-size 0.75rem
  .right-menu-margin
    // margin-top: ($navbarHeight + 1rem)
    border-radius 3px
   // overflow hidden
  .right-menu-title
    padding 10px 15px 0 15px
    background var(--mainBg)
    font-size 1rem
    &:after
      content ''
      display block
      width 100%
      height 1px
      background var(--borderColor)
      margin-top 10px
  .right-menu-content
    max-height 80vh
    position relative
    border-left: 3px solid #eee
    // overflow hidden
    background var(--mainBg)
    padding 0 3px 4px 0
    &::-webkit-scrollbar
      width 3px
      height 3px
    &::-webkit-scrollbar-track-piece
      background none
    &::-webkit-scrollbar-thumb:vertical
      background-color hsla(0, 0%, 49%, 0.3)
    &:hover
      //overflow-y auto
      padding-right 0
    .right-menu-item
      padding 0 15px
      line-height: 19px
      height: 19px
      margin-bottom: 16px
      // border-left 1px solid var(--borderColor)
      // overflow hidden
      // white-space nowrap
      // text-overflow ellipsis
      position relative
      &.level1
        a
          padding-left: 0
      &.level2
        font-size 0.8rem
      &.level3
        padding-left 27px
      &.level4
        padding-left 37px
      &.level5
        padding-left 47px
      &.level6
        padding-left 57px
      &.active
        &:before
          content ''
          position absolute
          top 0
          left -3px
          width 3px
          height 19px
          background $accentColor
          border-radius 0 4px 4px 0
          z-index: 100
        a
          color $accentColor
          opacity 1
      a
        font-weight 400
        font-size 14px
        color #666
        padding: 0 0
        display inline-block
        width 100%
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        padding-left: 10px
        &:hover
          color: #396aff
    &:hover
      color $accentColor
.have-body-img
  .right-menu-wrapper
    .right-menu-margin
      // padding 0.3rem 0
      // background var(--sidebarBg)
      // border-radius 5px

      .right-menu-item
        // border-color transparent
        // &.active
        // border-left 0.2rem solid $accentColor
        // &:hover
        // border-left 0.2rem solid $accentColor
</style>
