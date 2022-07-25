const {
  resolve
} = require('path')

module.exports = (options, context) => ({
  define () {
    const {
      copySelector,
      duration,
      en,
      zh
    } = options

    return {
      COPY_SELECTOR: copySelector || ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'],
      EN_COPY_MESSAGE: en.copyMessage || 'Copied successfully!',
      ZH_COPY_MESSAGE: zh.copyMessage || 'Copied successfully!',
      EN_TOOL_TIP_MESSAGE: en.toolTipMessage || 'Copy to clipboard',
      ZH_TOOL_TIP_MESSAGE: zh.toolTipMessage || 'Copy to clipboard',
      DURATION: duration || 3000
    }
  },

  clientRootMixin: resolve(__dirname, './bin/clientRootMixin.js')
})
