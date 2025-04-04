<script>
import { isActive, hashRE, groupHeaders } from "../util";

export default {
  functional: true,

  props: ["item", "sidebarDepth"],

  render(
    h,
    {
      parent: { $page, $site, $route, $themeConfig, $themeLocaleConfig },
      props: { item, sidebarDepth },
    }
  ) {
    // use custom active class matching logic
    // due to edge case of paths ending with / + hash
    const selfActive = isActive($route, item.path);
    // for sidebar: auto pages, a hash link should be active if one of its child
    // matches
    const active =
      item.type === "auto"
        ? selfActive ||
          item.children.some((c) =>
            isActive($route, item.basePath + "#" + c.slug)
          )
        : selfActive;
    const link =
      item.type === "external"
        ? renderExternal(h, item.path, item.title || item.path)
        : renderLink(h, item.path, item.title || item.path, active);

    const maxDepth = [
      $page.frontmatter.sidebarDepth,
      sidebarDepth,
      $themeLocaleConfig.sidebarDepth,
      $themeConfig.sidebarDepth,
      1,
    ].find((depth) => depth !== undefined);

    const displayAllHeaders =
      $themeLocaleConfig.displayAllHeaders || $themeConfig.displayAllHeaders;

    if (item.type === "auto") {
      return [
        link,
        renderChildren(h, item.children, item.basePath, $route, maxDepth),
      ];
    } else if (
      (active || displayAllHeaders) &&
      item.headers &&
      !hashRE.test(item.path)
    ) {
      const children = groupHeaders(item.headers);
      return [link, renderChildren(h, children, item.path, $route, maxDepth)];
    } else {
      return link;
    }
  },
};

function renderLink(h, to = "", text, active) {
  return h(
    "router-link",
    {
      props: {
        to,
        activeClass: "",
        exactActiveClass: "",
      },
      class: {
        active,
        "sidebar-link": true,
      },
    },
    text
  );
}

const getSlug = (title, slug) => {
  const titles = title.split(".");
  const slugs = slug.split("-");
  return titles
    .reduce((res, s) => {
      if (slugs.includes(s)) {
        res = res + s + ".";
      } else {
        let s1 = s.slice(0);
        let index = 0;
        let s2;
        while (s1) {
          s2 = s1.slice(0, index);
          if (slugs.includes(s2)) {
            if (index === s1.length) {
              res = res + s2 + ".";
            } else {
              res = res + s2 + "_";
            }
            s1 = s1.slice(index);
            index = 0;
          } else {
            index++;
            if (index > s1.length) {
              res = res.slice(0, -1) + s2 + ".";
              break;
            }
          }
        }
      }
      return res;
    }, "")
    .slice(0, -1);
};
const isValid = (content) => {
  return /\{#(.+?)\}$/.test(content);
};
const getSlugAndTitle = (v) => {
  let title = v.title;
  let slug = v.slug;
  if (isValid(title)) {
    slug = getSlug(title.match(/\{#(.+?)\}$/)[1], v.slug);
    title = title.replace(/\{#(.+?)\}$/, "").trim();
  }
  return {
    slug,
    title,
  };
};

function renderChildren(h, children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null;
  return h(
    "ul",
    { class: "sidebar-sub-headers" },
    children.map((c) => {
      const { slug, title } = getSlugAndTitle(c);
      const active = isActive(route, path + "#" + slug);
      return h("li", { class: "sidebar-sub-header level" + c.level }, [
        renderLink(h, path + "#" + slug, title, active),
        renderChildren(h, c.children, path, route, maxDepth, depth + 1),
      ]);
    })
  );
}

function renderExternal(h, to, text) {
  return h(
    "a",
    {
      attrs: {
        href: to,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      class: {
        "sidebar-link": true,
      },
    },
    [text, h("OutboundLink")]
  );
}
</script>

<style lang="stylus">
.sidebar-group ul
  padding-left 1.2em!important
.sidebar .sidebar-sub-headers
  padding-left 1rem
  font-size 0.95em
  .level4
    padding-left 0.2rem
  .level5
    padding-left 0.4rem
  .level6
    padding-left 0.6rem
a.sidebar-link
  font-size 14px
  font-weight 400
  display inline-block
  color var(--textColor)
  border-left none
  padding 0.35rem 1.5rem 0.35rem 0.8rem
  line-height 1.4
  width 100%
  box-sizing border-box
  &:hover
    color $accentColor
  &.active
    font-weight 600
    color $accentColor
    border-left-color $accentColor
  .sidebar-group &
    // padding-left 2rem
  .sidebar-sub-headers &
    padding-top 0.25rem
    padding-bottom 0.25rem
    border-left none
    &.active
      font-weight 500
</style>
