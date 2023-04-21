<template>
  <div class="search-box">
    <input
      ref="input"
      aria-label="Search"
      :value="query"
      :class="{ focused: focused }"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      @input="query = $event.target.value"
      @focus="focused = true"
      @blur="focused = false"
      @keyup.enter="go(focusIndex)"
      @keyup.up="onUp"
      @keyup.down="onDown"
    />
    <ul
      v-if="showSuggestions"
      class="suggestions"
      :class="{ 'align-right': alignRight }"
      @mouseleave="unfocus"
    >
      <li
        v-for="(s, i) in suggestions"
        :key="i"
        class="suggestion"
        :class="{ focused: i === focusIndex }"
        @mousedown="go(i)"
        @mouseenter="focus(i)"
      >
        <a :href="s.path + s.slug" @click.prevent>
          <div
            v-if="s.parentPageTitle"
            class="parent-page-title"
            v-html="s.parentPageTitle"
          />
          <div class="suggestion-row">
            <div class="page-title">{{ s.title || s.path }}</div>
            <div class="suggestion-content">
              <!-- prettier-ignore -->
              <div v-if="s.headingStr" class="header">
                {{ s.headingDisplay.prefix }}<span class="highlight">{{ s.headingDisplay.highlightedContent }}</span>{{ s.headingDisplay.suffix }}
              </div>
              <!-- prettier-ignore -->
              <div v-if="s.contentStr">
                {{ s.contentDisplay.prefix }}<span class="highlight">{{ s.contentDisplay.highlightedContent }}</span>{{ s.contentDisplay.suffix }}
              </div>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
let flexsearchSvc = undefined;
const DEEPFLOW_DOCS_SEARCHKEY = "DEEPFLOW-DOCS-SEARCHKEY";
const scrollBySearcKey = (searchKey) => {
  if (!searchKey) {
    // 没有内容则不要执行
    return false;
  }
  searchKey = searchKey.split(" ，")[0];
  ["p", "tr", "li", "h1", "h2", "h3", "td", "span"].find((label) => {
    const dom = document
      .evaluate(
        ".//" + label + "[contains(., '" + searchKey + "')]",
        document.querySelector(".content-wrapper"),
        null,
        XPathResult.ANY_TYPE
      )
      .iterateNext();
    if (dom) {
      dom.classList.add("anchor-tag");
      setTimeout(() => {
        dom.classList.remove("anchor-tag");
      }, 1000);
      dom.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      return true;
    }
  });
};
/** 增强搜索的内容后的定位
 * 1. highlightedContent 长度超过100，截取前100
 * 2. prefix + highlightedContent 长度超过100，截取后100
 * 3. prefix + highlightedContent + suffix 长度超过100，截取前100
 * @param {*} param0 返回4种 整体 前置 后置 本身
 */
const getSearchKey = ({ highlightedContent = "", prefix = "", suffix = "" }) => {
  const MAX_LENGTH = 100;
  // 如果高亮内容大于50直接截至100
  if (highlightedContent.length >= MAX_LENGTH) {
    return highlightedContent.slice(0, MAX_LENGTH);
  }
  while (prefix.startsWith("\n")) {
    prefix = prefix.replace(/^\n/g, "");
  }
  if (prefix.startsWith("   * ")) {
    // 如果是 *
    prefix = prefix.slice(5);
  }
  if (prefix.startsWith("...")) {
    // 如果是...开头
    prefix = prefix.slice(3);
  }
  while (prefix.endsWith("\n")) {
    suffix = suffix.replace(/\n$/g, "");
  }
  if (suffix.endsWith("...")) {
    // 如果是...结尾
    suffix = suffix.slice(0, -3);
  }
  prefix = prefix.slice(1);
  suffix = suffix.slice(0, -1);
  // 空格的两侧存在中文，基本上是超链接，截取即可
  const prefixs = prefix.split(/[\u4e00-\u9fa5]+\s+[\u4e00-\u9fa5]/);
  prefix = prefixs[prefixs.length - 1];
  suffix = suffix.split(/[\u4e00-\u9fa5]+\s+[\u4e00-\u9fa5]/)[0];
  if (prefix.length + highlightedContent.length >= MAX_LENGTH) {
    return (prefix + highlightedContent)
      .slice(-MAX_LENGTH)
      .replace(/\s\s+/g, " ");
  }
  return (prefix + highlightedContent + suffix)
    .slice(0, MAX_LENGTH)
    .replace(/\s\s+/g, " ");
};
/* global SEARCH_MAX_SUGGESTIONS, SEARCH_PATHS, SEARCH_HOTKEYS */
export default {
  name: "SearchBox",
  data() {
    return {
      query: "",
      focused: false,
      focusIndex: 0,
      placeholder: undefined,
      suggestions: null,
    };
  },
  computed: {
    queryTerms() {
      if (!flexsearchSvc) {
        return [];
      }
      if (!this.query) return [];
      const result = flexsearchSvc
        .normalizeString(this.query)
        .split(/[^\p{L}\p{N}_]+/iu)
        .filter((t) => t);
      return result;
    },
    showSuggestions() {
      return this.focused && this.suggestions && this.suggestions.length;
    },

    // make suggestions align right when there are not enough items
    alignRight() {
      const navCount = (this.$site.themeConfig.nav || []).length;
      const repo = this.$site.repo ? 1 : 0;
      return navCount + repo <= 2;
    },
  },
  watch: {
    query() {
      this.getSuggestions();
    },
    $route() {
      const searchKey = sessionStorage.getItem(DEEPFLOW_DOCS_SEARCHKEY);
      if (searchKey) {
        sessionStorage.removeItem(DEEPFLOW_DOCS_SEARCHKEY);
        setTimeout(() => scrollBySearcKey(searchKey), 500);
      }
    },
  },
  /* global OPTIONS */
  mounted() {
    const options = OPTIONS || {};
    Promise.all([
      import("./../services/flexsearchSvc"),
      import("@dynamic/searchData"),
    ]).then(([{ default: _flexsearchSvc }, { SEARCH_DATA }]) => {
      flexsearchSvc = _flexsearchSvc;
      flexsearchSvc.buildIndex(this.$site.pages, options, SEARCH_DATA);
    });

    this.placeholder = this.$site.themeConfig.searchPlaceholder || "";
    document.addEventListener("keydown", this.onHotkey);

    // set query from URL
    const params = this.urlParams();
    if (params) {
      const query = params.get("query");
      if (query) {
        this.query = decodeURI(query);
        this.focused = true;
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.onHotkey);
  },
  methods: {
    async getSuggestions() {
      if (!this.query || !this.queryTerms.length) {
        this.suggestions = [];
        return;
      }
      let suggestions = flexsearchSvc
        ? await flexsearchSvc.match(
            this.query,
            this.queryTerms,
            this.$site.themeConfig.searchMaxSuggestions ||
              SEARCH_MAX_SUGGESTIONS
          )
        : [];
      const isZH = this.$page.path.indexOf("/zh/") > -1;
      suggestions = suggestions.filter((item) => {
        if (isZH && item.path.startsWith("/zh/")) {
          return true;
        } else if (!isZH && !item.path.startsWith("/zh/")) {
          return true;
        } else {
          return false;
        }
      });
      this.suggestions = suggestions.map((s) => ({
        ...s,
        headingDisplay: highlight(s.headingStr, s.headingHighlight),
        contentDisplay: highlight(s.contentStr, s.contentHighlight),
      }));
    },
    getPageLocalePath(page) {
      for (const localePath in this.$site.locales || {}) {
        if (localePath !== "/" && page.path.indexOf(localePath) === 0) {
          return localePath;
        }
      }
      return "/";
    },
    isSearchable(page) {
      let searchPaths = SEARCH_PATHS;
      // all paths searchables
      if (searchPaths === null) {
        return true;
      }
      searchPaths = Array.isArray(searchPaths)
        ? searchPaths
        : new Array(searchPaths);
      return (
        searchPaths.filter((path) => {
          return page.path.match(path);
        }).length > 0
      );
    },
    onHotkey(event) {
      if (
        event.srcElement === document.body &&
        SEARCH_HOTKEYS.includes(event.key)
      ) {
        this.$refs.input.focus();
        event.preventDefault();
      }
    },
    onUp() {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--;
        } else {
          this.focusIndex = this.suggestions.length - 1;
        }
      }
    },
    onDown() {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++;
        } else {
          this.focusIndex = 0;
        }
      }
    },
    go(i) {
      if (!this.showSuggestions) {
        return;
      }
      // 执行2次，如果contentDisplay没有内容，则使用headingDisplay
      const searchKey =
        getSearchKey(this.suggestions[i].contentDisplay) ||
        getSearchKey(this.suggestions[i].headingDisplay);
      sessionStorage.setItem(DEEPFLOW_DOCS_SEARCHKEY, searchKey);
      if (this.$route.path === this.suggestions[i].path) {
        setTimeout(() => {
          scrollBySearcKey(searchKey);
        }, 100);
        sessionStorage.removeItem(DEEPFLOW_DOCS_SEARCHKEY);
      } else if (this.suggestions[i].external) {
        window.open(
          this.suggestions[i].path + this.suggestions[i].slug,
          "_blank"
        );
      } else {
        this.$router.push(this.suggestions[i].path + this.suggestions[i].slug);
        this.query = "";
        this.focusIndex = 0;
        this.focused = false;

        // reset query param
        const params = this.urlParams();
        if (params) {
          params.delete("query");
          const paramsString = params.toString();
          const newState =
            window.location.pathname + (paramsString ? `?${paramsString}` : "");
          history.pushState(null, "", newState);
        }
      }
    },
    focus(i) {
      this.focusIndex = i;
    },
    unfocus() {
      this.focusIndex = -1;
    },
    urlParams() {
      if (!window.location.search) {
        return null;
      }
      return new URLSearchParams(window.location.search);
    },
  },
};

function highlight(str, strHighlight) {
  if (!str) return {};
  if (!strHighlight) return { prefix: str };
  const [start, length] = strHighlight;
  const end = start + length;

  const prefix = str.slice(0, start);
  const highlightedContent = str.slice(start, end);
  const suffix = str.slice(end);
  return { prefix, highlightedContent, suffix };

  // return `${prefix}<span class="highlight">${highlightedContent}</span>${suffix}`
}
</script>

<style lang="stylus">
.search-box
  display inline-block
  position relative
  margin-right 19px
  input
    cursor text
    width 6rem
    height: 2rem
    color lighten($textColor, 25%)
    display inline-block
    border 1px solid darken($borderColor, 10%)
    border-radius 2rem
    font-size 0.9rem
    line-height 2rem
    padding 0 0.5rem 0 2rem
    outline none
    transition all .2s ease
    background #fff url(../assets/search.svg) 0.6rem 0.5rem no-repeat
    background-size 1rem
    &:focus
      cursor auto
      border-color $accentColor
  .suggestions
    background #fff
    min-width 500px
    max-width 700px
    position absolute
    top 2 rem
    border 1px solid darken($borderColor, 10%)
    border-radius 6px
    padding 0.4rem
    list-style-type none
    &.align-right
      right 0
  .suggestion
    line-height 1.4
    // padding 0.4rem 0.6rem
    border-radius 4px
    cursor pointer
    width 100%
    a
      display block
      white-space normal
      color lighten($textColor, 15%)
      width 100%
      .parent-page-title
        color white
        font-weight 600
        background-color $accentColor
        padding 5px

      .suggestion-row
        border-collapse collapse
        width 100%
        display table
        .page-title
          width: 35%
          border 1px solid $borderColor
          background: #f5f5f5
          border-left none
          display table-cell
          text-align right
          padding 5px
          font-weight 600
        .suggestion-content
          .highlight
            text-decoration: underline
          border 1px solid $borderColor
          font-weight 400
          border-right none
          width: 65%
          display table-cell
          padding 5px
          .header
            font-weight 600

    &.focused
      background-color #f3f4f5
@media (max-width: $MQNarrow)
  .search-box
    input
      cursor pointer
      width 0
      border-color transparent
      position relative
      &:focus
        cursor text
        left 0
        width 10rem
// Match IE11
@media all and (-ms-high-contrast: none)
  .search-box input
    height 2rem
@media (max-width: $MQNarrow) and (min-width: $MQMobile)
  .search-box
    .suggestions
      left 0
@media (max-width: $MQMobile)
  .search-box
    margin-right 0
    input
      left 1rem
    .suggestions
      right 0
@media (max-width: $MQMobileNarrow)
  .search-box
    .suggestions
      width calc(100vw - 4rem)
    input:focus
      width 8rem
</style>
<style>
.anchor-tag {
  animation: anchor 1s 3;
}

@keyframes anchor {
  from {
    background-color: white;
    border-color: rgba(#409eff, 0);
    box-shadow: none;
  }
  to {
    background-color: rgba(#409eff, 0.1);
    border-color: #409eff;
    box-shadow: 0 0 10px 5px #409eff;
  }
}

@-webkit-keyframes anchor /*Safari and Chrome*/ {
  from {
    background-color: white;
    border-color: rgba(#409eff, 0);
    box-shadow: none;
  }
  to {
    background-color: rgba(#409eff, 0.1);
    border-color: #409eff;
    box-shadow: 0 0 10px 5px #409eff;
  }
}
</style>
