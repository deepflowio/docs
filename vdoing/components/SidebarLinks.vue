<template>
  <ul class="sidebar-links" v-if="items.length">
    <li v-for="(item, i) in items" :key="i">
      <SidebarGroup
        v-if="item.type === 'group'"
        :item="item"
        :open="i === openGroupIndex"
        :collapsable="item.collapsable || item.collapsible"
        :depth="depth"
        @toggle="toggleGroup(i)"
      />
      <SidebarLink v-else :sidebarDepth="sidebarDepth" :item="item" />
    </li>
  </ul>
</template>

<script>
import SidebarGroup from "@theme/components/SidebarGroup.vue";
import SidebarLink from "@theme/components/SidebarLink.vue";
import { isActive } from "../util";
import _ from "lodash";

export default {
  name: "SidebarLinks",

  components: { SidebarGroup, SidebarLink },

  props: [
    "items",
    "depth", // depth of current sidebar links
    "sidebarDepth", // depth of headers to be extracted
    "initialOpenGroupIndex",
  ],

  data() {
    return {
      openGroupIndex: this.initialOpenGroupIndex || 0,
      isMQMobile: false,
    };
  },

  beforeMount() {
    this.isMQMobile = window.innerWidth < 720 ? true : false;

    window.addEventListener("resize", () => {
      this.isMQMobile = window.innerWidth < 720 ? true : false;
    });
  },
  created() {
    this.refreshIndex();
  },

  mounted() {
    const { hash } = this.$route;
    if (hash) {
      this.listenHash(hash);
    }
  },

  watch: {
    $route() {
      this.refreshIndex();
    },
    "$route.hash"(n) {
      this.listenHash(n);
    },
  },

  methods: {
    listenHash(n) {
      if (this.isMQMobile && n.indexOf(".")) {
        this.scrollToElementById(n.replace(/\./g, "\\."));
      }
    },
    scrollToElementById: _.debounce((id) => {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error(`没有找到 ID 为 ${id} 的元素`);
      }
    }, 100),
    refreshIndex() {
      const index = resolveOpenGroupIndex(this.$route, this.items);
      if (index > -1) {
        this.openGroupIndex = index;
      }
    },

    toggleGroup(index) {
      this.openGroupIndex = index === this.openGroupIndex ? -1 : index;
    },

    isActive(page) {
      return isActive(this.$route, page.regularPath);
    },
  },
};

function resolveOpenGroupIndex(route, items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (descendantIsActive(route, item)) {
      return i;
    }
  }
  return -1;
}

function descendantIsActive(route, item) {
  if (item.type === "group") {
    if (item.path === route.path) {
      return true;
    }
    return item.children.some((child) => {
      if (child.type === "group") {
        return descendantIsActive(route, child);
      } else {
        return child.type === "page" && isActive(route, child.path);
      }
    });
  }
  return false;
}
</script>
