<template>
  <section
    class="sidebar-group"
    :class="[
      {
        collapsable,
        'is-sub-group': depth !== 0
      },
      `depth-${depth}`
    ]"
  >
    <router-link
      v-if="item.path"
      class="sidebar-heading clickable"
      :class="{
        open,
        active: isActive($route, item.path)
      }"
      :to="item.path"
      @click.native="$emit('toggle')"
    >
      <span
        class="arrow"
        v-if="collapsable"
        :class="open ? 'down' : 'right'"
      ></span>
      <span>{{ item.title }}</span>
    </router-link>

    <a
      class="sidebar-heading clickable"
      :href="item.href"
      v-else-if="item.href"
    >
      <span
        class="arrow"
        v-if="collapsable"
        :class="open ? 'down' : 'right'"
      ></span>
      <span>{{ item.title }}</span>
    </a>

    <p
      v-else
      class="sidebar-heading"
      :class="{ open }"
      @click="$emit('toggle')"
    >
      <span
        class="arrow"
        v-if="collapsable"
        :class="open ? 'down' : 'right'"
      ></span>
      <span>{{ item.title }}</span>
    </p>

    <DropdownTransition>
      <SidebarLinks
        class="sidebar-group-items"
        :items="item.children"
        v-show="open || !collapsable"
        :sidebar-depth="item.sidebarDepth"
        :initial-open-group-index="item.initialOpenGroupIndex"
        :depth="depth + 1"
      />
    </DropdownTransition>
  </section>
</template>

<script>
import { isActive } from '../util'
import DropdownTransition from '@theme/components/DropdownTransition.vue'

export default {
  name: 'SidebarGroup',
  props: ['item', 'open', 'collapsable', 'depth'],
  components: { DropdownTransition },
  // ref: https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
  beforeCreate () {
    this.$options.components.SidebarLinks = require('./SidebarLinks.vue').default
  },
  methods: { isActive }
}
</script>

<style lang="stylus">
.sidebar-group
  .sidebar-group
    padding-left 0.5em
  &:not(.collapsable)
    .sidebar-heading:not(.clickable)
      cursor auto
      color inherit
  // refine styles of nested sidebar groups
  &.is-sub-group
    padding-left 0
    & > .sidebar-heading
      //font-size 1.01em
      line-height 1.4
      //font-weight bold
      // padding-left 2rem
      &:not(.clickable)
        // opacity 0.9
    & > .sidebar-group-items
      padding-left 1rem
      & > li > .sidebar-link
        //font-size 0.98em
        border-left none
  &.depth-2
    & > .sidebar-heading
      border-left none
.sidebar-heading
  position relative
  color var(--textColor)
  transition color 0.15s ease
  cursor pointer
  font-size 14px
  font-weight 400
  // text-transform uppercase
  padding .35rem 1.5rem .35rem .8rem
  width 100%
  box-sizing border-box
  margin 0
  border-left none
  &.open, &:hover
    color inherit
  .arrow
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  &.clickable
    &.active
      font-weight 600
      color $accentColor
      border-left-color $accentColor
    &:hover
      color $accentColor
.sidebar-group-items
  transition height 0.1s ease-out
  font-size 0.95em
  overflow hidden
</style>
