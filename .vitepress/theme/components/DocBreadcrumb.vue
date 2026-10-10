<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

const { theme, page, lang } = useData()
const route = useRoute()
const isZh = computed(() => lang.value.startsWith('zh'))

function normalize(path: string) {
  return decodeURI(path.split(/[?#]/)[0]).replace(/\.(html|md)$/, '').replace(/\/$/, '')
}

function findPath(items: DefaultTheme.SidebarItem[], parents: DefaultTheme.SidebarItem[] = []): DefaultTheme.SidebarItem[] {
  for (const item of items) {
    const path = [...parents, item]
    if (item.link && normalize(withBase(item.link)) === normalize(route.path)) return path
    if (item.items) {
      const found = findPath(item.items, path)
      if (found.length) return found
    }
  }
  return []
}

const crumbs = computed(() => {
  const sidebar = theme.value.sidebar
  if (!sidebar || typeof sidebar === 'string') return []
  if (Array.isArray(sidebar)) return findPath(sidebar)
  // A language or section may have its own sidebar; use the longest matching prefix.
  const key = Object.keys(sidebar)
    .filter(prefix => route.path.startsWith(withBase(prefix)))
    .sort((a, b) => b.length - a.length)[0]
  const value = key ? sidebar[key] : []
  return findPath(Array.isArray(value) ? value : value?.items || [])
})

const title = computed(() => crumbs.value.at(-1)?.text || page.value.title)
const parents = computed(() => crumbs.value.slice(0, -1))
</script>

<template>
  <nav class="doc-breadcrumb" :aria-label="isZh ? '文档路径' : 'Breadcrumb'">
    <a :href="withBase(isZh ? '/zh/' : '/')">{{ isZh ? '文档' : 'Docs' }}</a>
    <template v-for="(item, index) in parents" :key="index">
      <span class="separator" aria-hidden="true">/</span>
      <a v-if="item.link" :href="withBase(item.link)">{{ item.text }}</a>
      <span v-else>{{ item.text }}</span>
    </template>
    <span class="separator" aria-hidden="true">/</span>
    <span class="current" aria-current="page">{{ title }}</span>
  </nav>
</template>

<style scoped>
.doc-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  max-width: var(--df-md-reading-width);
  margin: 0 auto 28px;
  color: var(--df-md-text-3);
  font-size: 13px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.doc-breadcrumb a { color: inherit; text-decoration: none; }
.doc-breadcrumb a:hover { color: var(--df-md-primary-6); }
.separator { color: var(--df-md-border-3); }
.current { color: var(--df-md-text-1); }
.doc-breadcrumb a:focus-visible {
  outline: 2px solid var(--df-md-primary-6);
  outline-offset: 3px;
}
@media (max-width: 959px) {
  .doc-breadcrumb { margin-top: 8px; margin-bottom: 24px; }
}
</style>
