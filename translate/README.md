# deepflow.io 文档翻译

## 后端

需要自己部署一个可提供翻译的 API，参见 translator.js 中的接口，可以自己实现一个，或者找 zhenyu 问问。

## 翻译

- 下载 docs https://github.com/deepflowys/docs
- 进入当前项目，执行 `node index.js ../docs/docs translated ` 注意 docs 的实际位置，以及 docs 有两层结构
- translated 中 map.txt 会记录当前翻译的 md5
- 注意如果因为各种意外原因导致错误，需要检查 map.txt 是否被异常覆盖
