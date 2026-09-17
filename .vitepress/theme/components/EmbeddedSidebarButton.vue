<template>
  <!-- 嵌入式(iframe)模式下导航栏被隐藏,移动端用内容区左上角的悬浮按钮
       展开侧边栏。默认隐藏,显隐规则在 custom.css 的 html.embedded 部分,
       经 doc-top 插槽渲染(仅文档页存在,首页等无侧边栏页面天然没有) -->
  <button
    type="button"
    class="embedded-sidebar-button"
    aria-label="打开侧边栏"
    @click="openSidebar"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  </button>
</template>

<script setup lang="ts">
function openSidebar() {
  // 侧边栏的开合状态在默认主题 Layout 内部管理,无公开 API;
  // VPLocalNav 的"菜单"按钮持有该状态(嵌入模式下此条虽被隐藏,
  // 但按钮仍在 DOM 中),程序化点击即可切换
  document.querySelector<HTMLButtonElement>('.VPLocalNav .menu')?.click()
}
</script>

<style scoped>
.embedded-sidebar-button {
  display: none;
  position: absolute;
  top: 10px;
  left: 12px;
  z-index: 21;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  color: #aebbd0;
  border: 1px solid rgba(178, 193, 217, 0.22);
  border-radius: 8px;
  background: rgba(13, 19, 29, 0.96);
  cursor: pointer;
}
.embedded-sidebar-button svg {
  width: 18px;
  height: 18px;
}
</style>
