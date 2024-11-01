// src/charts/visit/const/index.js
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { URL } = require("url");

// 配置文件路径
const configFilePath = path.join(__dirname, "downloadFile.json");
// 第3个参数 环境
let branch = process.argv[2] || "main"; // main v6.4
// 除了固定的分支以外，其余都尽量使用main分支
if (!/^v[0-9]+\.[0-9]+$/.test(branch)) {
  branch = "main";
}

// 读取配置文件
const readConfig = () => {
  const configData = fs.readFileSync(configFilePath);
  return JSON.parse(configData);
};

const checkFileExistsSync = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

// 删除文件的函数
const deleteFile = (filePath) => {
  if (checkFileExistsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`删除文件失败: ${err.message}`);
        return;
      }
      console.log(`文件已成功删除: ${filePath}`);
    });
  }
};

// 下载文件
const downloadFile = (fileUrl, outputPath) => {
  fileUrl = fileUrl.replace(/\<BRANCH\>/, branch);
  const url = new URL(fileUrl);
  const h = fileUrl.startsWith("https") ? https : http;
  const file = fs.createWriteStream(outputPath);

  h.get(url, (response) => {
    response.pipe(file);
    file.on("finish", () => {
      file.close();
      console.log(`文件已下载到: ${outputPath}`);

      // 移除readme文件
      const o = outputPath.split("/");
      o.pop();
      o.push("README.md");
      deleteFile(o.join("/"));
    });
  }).on("error", (err) => {
    fs.unlink(outputPath); // 删除文件
    console.error(`下载失败: ${err.message}`);
  });
};

// 主函数
const main = () => {
  const configs = readConfig();
  configs.forEach((config) => {
    const { url, output } = config;

    downloadFile(url, output);
  });
};

// 运行主函数
main();
