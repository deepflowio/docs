const {
  codegen: { pathsToModuleCode },
} = require("@vuepress/shared-utils");
const path = require("path");

/**
 * @type {import('@vuepress/types').Plugin<{}, import('@vuepress/types').DefaultThemeConfig>}
 */
module.exports = (options, ctx, api) => ({
  name: "internal-root-mixins",

  // @internal/root-mixins
  async clientDynamicModules() {
    const builtInRootMixins = [path.resolve(__dirname, "updateMeta.js")];

    const rootMixins = [
      ...builtInRootMixins,
      ...api.options.clientRootMixin.values,
    ];

    const rootMixinsCode = pathsToModuleCode(rootMixins);
    return {
      name: "root-mixins.js",
      content: rootMixinsCode,
      dirname: "internal",
    };
  },
});
