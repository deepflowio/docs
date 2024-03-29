<template>
  <div>
    <div class="code-tabs">
      <div class="code-tabs-nav">
        <button
          v-for="(item, index) in data"
          :key="item.title"
          @click="switchActive(index)"
          :class="['code-tabs-nav-tab', activeIndex === index ? 'active' : '']"
        >
          {{ item.title }}
        </button>
      </div>
      <div
        :class="['code-tab', activeIndex === index ? 'active' : '']"
        v-for="(item, index) in data"
        :key="item.title"
      >
        <slot :name="'tab' + index" :title="item.title" :value="item.value" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CodeTabs",

  props: {
    active: { type: Number, default: 0 },
    data: {
      type: Array,
      required: true,
    },
    tabId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeIndex: this.active,
    };
  },
  methods: {
    switchActive(index) {
      this.activeIndex = index;
    },
  },
};
</script>

<style lang="stylus">

.code-tabs-nav {
  overflow-x: auto;

  margin: 0.85rem 0 -0.85rem;
  padding: 0;
  border-radius: 6px 6px 0 0;

  background-color: var(--code-tabs-nav-bg-color, rgba(00,203,251,0.5));
  list-style: none;

  white-space: nowrap;

  transition: background-color var(--color-transition, 0.3s ease);

  @media (max-width: $MQMobile) {
    margin-right: -1.5rem;
    margin-left: -1.5rem;
    border-radius: 0;
  }
}

.code-tabs-nav-tab {
  border: 0;
  position: relative;

  min-width: 3rem;
  margin: 0;
  padding: 6px 10px;
  border-radius: 6px 6px 0 0;

  background-color: transparent;
  color: var(--code-tabs-nav-text-color, #000);

  font-weight: 600;
  font-size: 0.85em;
  line-height: 1.4;

  cursor: pointer;

  transition: background-color var(--color-transition, 0.3s ease),
    color var(--color-transition, 0.3s ease);

  &:hover {
    background-color: var(--codeBg, #434a57);
  }

  &::before,
  &::after {
    content: " ";

    position: absolute;
    bottom: 0;
    z-index: 1;

    width: 6px;
    height: 6px;
  }

  &::before {
    right: 100%;
  }

  &::after {
    left: 100%;
  }

  &.active {
    background-color: var(--codeBg, #282c34);

    &::before {
      background: radial-gradient(
        12px at left top,
        transparent 50%,
        var(--codeBg, #282c34) 50%
      );
    }

    &::after {
      background: radial-gradient(
        12px at right top,
        transparent 50%,
        var(--codeBg, #282c34) 50%
      );
    }
  }

  &:first-child {
    &::before {
      display: none;
    }
  }
}

.code-tab {
  display: none;

  &.active {
    display: block;
  }

  div[class*="language-"] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    @media (max-width: $MQMobile) {
      margin: 0.85rem -1.5rem;
    }
  }
}
</style>
