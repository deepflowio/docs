// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const ZoomingPlugin = ({ selector = '.theme-default-content img', options = {}, delay = 500, }) => ({
    name: 'vuepress-plugin-zooming',
    clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js'),
    define: {
        ZOOMING_SELECTOR: selector,
        ZOOMING_OPTIONS: JSON.stringify(options),
        ZOOMING_DELAY: delay.toString(),
    },
});
module.exports = ZoomingPlugin;
//# sourceMappingURL=index.js.map