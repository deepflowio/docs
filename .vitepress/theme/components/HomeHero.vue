<template>
  <!-- 旧版首页 hero(vdoing/components/Home.vue):单行大标题 + 描述 + 蓝色按钮,
       按钮文案/链接来自 frontmatter 顶层 actionText/actionLink(与旧版数据模型一致),
       不再使用 VPHero 的 actions 块(避免默认模板按钮样式) -->
  <div class="df-hero">
    <h1 class="df-hero-title">{{ title }}</h1>
    <p class="df-hero-desc">{{ hero.tagline }}</p>
    <p v-if="fm.actionText && fm.actionLink" class="df-hero-action">
      <a class="action-button" :href="actionHref">{{ fm.actionText }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter: fm } = useData()

const hero = computed(() => fm.value.hero ?? {})
// 旧版 heroText 为单行 "DeepFlow - 即刻实现可观测性",这里把 name/text 拼回同款
const title = computed(() => [hero.value.name, hero.value.text].filter(Boolean).join(' - '))
const actionHref = computed(() => {
  const link = fm.value.actionLink as string
  return /^https?:/.test(link) ? link : withBase(link)
})
</script>

<style scoped>
.df-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.df-hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 1.8rem auto;
  color: var(--vp-c-text-1);
}
.df-hero-desc {
  max-width: 40rem;
  font-size: 1.6rem;
  line-height: 1.3;
  margin: 1.8rem auto;
  color: var(--vp-c-text-2);
}
.df-hero-action {
  margin: 1.8rem auto;
}

/* 旧版 .action-button 样式 */
.action-button {
  display: inline-block;
  font-size: 1.2rem;
  color: #fff;
  background-color: #396aff;
  padding: 0.8rem 1.6rem;
  border-radius: 4px;
  border-bottom: 1px solid #3357cc;
  box-sizing: border-box;
  transition: background-color 0.1s ease;
  text-decoration: none;
}
.action-button:hover {
  background-color: #4d7bff;
}

@media (max-width: 639px) {
  .df-hero-title {
    font-size: 2rem;
  }
  .df-hero-desc {
    font-size: 1.25rem;
  }
}
</style>
