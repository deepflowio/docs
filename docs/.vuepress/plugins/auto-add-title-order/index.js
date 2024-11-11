// 自动补全title序号
module.exports = function (md, config) {
  const cacheTitleOrder = [];
  let latest = "";
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const titleToken = tokens[idx + 1];

    // 检查标题内容是否包含自定义 ID
    const customIdMatch = titleToken.content.match(/\{#(.+?)\}$/);
    if (customIdMatch) {
      const customId = customIdMatch[1]; // 获取自定义 ID
      titleToken.content = titleToken.content.replace(/\{#(.+?)\}$/, "").trim(); // 移除自定义 ID 语法
      // token.attrSet("id", customId); // 设置 ID 属性

      const index2 = titleToken.children.findIndex((c) => c.type === "text");

      titleToken.children[index2].content = titleToken.children[index2].content
        .replace(/\{#(.+?)\}$/, "")
        .trim();
    }

    const { relativePath } = env;
    if (!relativePath) {
      return self.renderToken(tokens, idx, options, env);
    }
    if (relativePath !== latest) {
      latest = relativePath;
      cacheTitleOrder.splice(0, cacheTitleOrder.length);
    }
    /**
     * 找到这个，然后把idx+1的xx内容修改为1.xx
     * 1. 找到token，并解析出级别，级别需要-1，从0开始
     * 2. 如果当前级别存在，则+1，同时清空cacheTitleIndex leavel后面的数据;不存在则赋值为1
     */
    let [, leavel] = token.tag.split("");
    leavel = leavel - 1; //
    if (cacheTitleOrder[leavel]) {
      cacheTitleOrder[leavel] = cacheTitleOrder[leavel] + 1;
      // 后面的清除掉
      cacheTitleOrder.splice(leavel + 1, cacheTitleOrder.length - leavel);
    } else {
      do {
        cacheTitleOrder[leavel--] = 1;
      } while (!cacheTitleOrder[leavel] && leavel >= 0);
    }

    const _cacheTitleOrder = cacheTitleOrder.filter(Boolean); // [null, 1]

    const currentLeavel =
      _cacheTitleOrder.join(".") + (_cacheTitleOrder.length === 1 ? ". " : " "); // 1. 2.2
    const nextToken = tokens[idx + 1];
    nextToken.content = currentLeavel + nextToken.content;

    // 如果标题中出现了 `` 会有格式问题
    // 找到第一个text的即可
    const index = nextToken.children.findIndex((c) => c.type === "text");

    nextToken.children[index].content =
      currentLeavel + nextToken.children[index].content;

    return self.renderToken(tokens, idx, options, env);
  };
};
