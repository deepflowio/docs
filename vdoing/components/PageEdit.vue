<template>
  <div class="page-edit" v-if="!$frontmatter.isCreated">
    <div class="edit-link" v-if="editLink">
      <a :href="editLink" target="_blank" rel="noopener noreferrer">{{
        editLinkText
      }}</a>
      <OutboundLink />
    </div>
    <div class="edit-link" v-if="historyLink">
      <a :href="historyLink" target="_blank" rel="noopener noreferrer">{{
        historyLinkText
      }}</a>
      <OutboundLink />
    </div>

    <!-- <div class="last-updated" v-if="lastUpdated">
      <span class="prefix">{{ lastUpdatedText }}:</span>
      <span class="time">{{ lastUpdated }}</span>
    </div> -->
  </div>
</template>
<script>
import { endingSlashRE, outboundRE } from "../util";

export default {
  name: "PageEdit",
  computed: {
    tags() {
      return this.$frontmatter.tags;
    },

    lastUpdated() {
      return this.$page.lastUpdated;
    },

    lastUpdatedText() {
      if (typeof this.$themeLocaleConfig.lastUpdated === "string") {
        return this.$themeLocaleConfig.lastUpdated;
      }
      if (typeof this.$site.themeConfig.lastUpdated === "string") {
        return this.$site.themeConfig.lastUpdated;
      }
      return "Last Updated";
    },

    editLink() {
      return this.createEditLink(this.$page.relativePath);
    },

    editLinkText() {
      return `Edit`;
    },

    historyLink() {
      return this.createHistoryLink(this.$page.relativePath);
    },

    historyLinkText() {
      return `History`;
    },
  },

  methods: {
    createEditLink(path) {
      return `https://gitlab.yunshan.net/yunshan/deepflow-group/deepflow-website-docs/-/edit/main/${path}`;
    },
    createHistoryLink(path) {
      return `https://gitlab.yunshan.net/yunshan/deepflow-group/deepflow-website-docs/-/commits/main/${path}`;
    },
  },
};
</script>
<style lang="stylus">
@require '../styles/wrapper.styl'

.page-edit
  @extend $wrapper
  padding-top 1rem
  padding-bottom 1rem
  overflow auto
  .edit-link
    display inline-block
    float left
    margin 0 2rem 0.5rem 0
    a
      margin-right 0.25rem
  .tags
    float left
    a
      margin 0 0.8rem 0.5rem 0
      display inline-block
      color var(--textLightenColor)
      padding 0.2rem 0.7rem
      font-size 0.9em
      background-color rgba(128, 128, 128, 0.08)
      border-radius 3px
      opacity 0.8
  .last-updated
    float right
    font-size 0.9em
    .prefix
      font-weight 500
      color var(--textColor)
      opacity 0.8
    .time
      font-weight 400
      color #aaa
@media (max-width $MQMobile)
  .page-edit
    .edit-link, .tags
      margin-bottom 0.5rem
    .last-updated
      width 100%
      font-size 0.8em
      text-align left
</style>
