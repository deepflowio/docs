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
const downloadFile = (fileUrl, outputPath, cb) => {
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

      cb();
    });
  }).on("error", (err) => {
    fs.unlink(outputPath); // 删除文件
    console.error(`下载失败: ${err.message}`);
  });
};

function insertMetaToMarkdown(filePath, metaInfo) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // 将 meta 信息插入到文件开头
    const updatedContent = metaInfo + data;

    // 写入更新后的内容到文件
    fs.writeFile(filePath, updatedContent, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Meta information inserted successfully!");
    });
  });
}

function jsonToMeta(jsonData) {
  let metaString = "---\n";

  for (const [key, value] of Object.entries(jsonData)) {
    metaString += `${key}: ${value}\n`;
  }

  metaString += "---\n";
  return metaString;
}

// 主函数
const main = () => {
  const configs = readConfig();
  configs.forEach((config) => {
    const { url, output, meta } = config;

    downloadFile(url, output, () => {
      insertMetaToMarkdown(output, jsonToMeta(meta));
    });
  });
};

// 运行主函数
main();
