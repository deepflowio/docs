import { VuepressZooming } from './VuepressZooming';
export default {
    watch: {
        '$page.path'() {
            if (typeof this.$vuepress.zooming === 'undefined')
                return;
            this.$vuepress.zooming.updateDelay();
        },
    },
    mounted() {
        this.$vuepress.zooming = new VuepressZooming();
        this.$vuepress.zooming.updateDelay();
    },
};
//# sourceMappingURL=clientRootMixin.js.map