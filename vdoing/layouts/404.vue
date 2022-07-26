<template>
  <div class="theme-container">
    <div class="theme-vdoing-content">
      <span>404</span>
      <blockquote>{{ getMsg() }}</blockquote>
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script>
const LOCALES = require("../page-locales/index.js");
const msgs = [
  `这里什么都没有。`,
  `我是谁？我在哪？`,
  `这是一个Four-Oh-Four.`,
  `看来我们的链接坏掉了~`,
];

// 不存在的页面集合
const noPathCache = {};
export default {
  methods: {
    getMsg() {
      return msgs[Math.floor(Math.random() * msgs.length)];
    },
  },
  created() {
    // /test/a
    const path = this.$route.path;
    if (path === "/404.html") {
      return false;
    }
    const reuslt = path.split("/");
    noPathCache[path] = true; // 代表不存在
    reuslt.shift();
    let lang = "en";
    if (Object.prototype.hasOwnProperty.call(LOCALES, reuslt[0])) {
      lang = reuslt.shift();
    }
    // 确定语言类型 zh en
    switch (lang) {
      case "en":
        reuslt.unshift("zh");
        break;
      default:
    }
    reuslt.unshift("");
    const toPath = reuslt.join("/");
    if (noPathCache[toPath]) {
      return false;
    }
    this.$router.push(toPath);
  },
};
</script>

<style lang="stylus" scoped>
.theme-vdoing-content
  margin 3rem auto
  padding 1.5rem
  span
    font-size 6rem
    color $accentColor
</style>
