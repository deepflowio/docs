const { exec } = require("child_process");
const fs = require("fs"); // 文件模块
const path = require("path"); // 路径模块
const matter = require("gray-matter"); //
const jsonToYaml = require("json2yaml");
const os = require("os");

// 第3个参数 环境
const targetFile = process.argv[2] || "docs"; // cloud df-help

// 小于10补0
function zero(d) {
  return d.toString().padStart(2, "0");
}

function dateFormat(date) {
  return `${date.getFullYear()}-${zero(date.getMonth() + 1)}-${zero(
    date.getDate()
  )}`;
}

const getFileCreateTime = (filePath) => {
  return new Promise((r, j) => {
    // 获取文件最早提交（创建）时间
    exec(
      "git log --diff-filter=A --format=%aD -- " + filePath,
      (err, stdout, stderr) => {
        if (err) {
          // 错误处理 返回最新时间
          r(dateFormat(new Date()));
        } else {
          const createdTime = stdout.split("\n")[0]; // 提取最早的日期
          if (dateFormat(new Date(createdTime)) === "NaN-NaN-NaN") {
            console.log("git log --diff-filter=A --format=%aD -- " + filePath);
            throw new Error("===");
          }
          r(dateFormat(new Date(createdTime)));
        }
      }
    );
  });
};

const getFileUpdateTime = (filePath) => {
  return new Promise((r, j) => {
    // 获取文件最近提交（修改）时间
    exec("git log --format=%aD -- " + filePath, (err, stdout, stderr) => {
      if (err) {
        // 错误处理 返回最新时间
        r(dateFormat(new Date()));
      } else {
        const modifiedTime = stdout.split("\n")[0]; // 提取最新的日期
        r(dateFormat(new Date(modifiedTime)));
      }
    });
  });
};

const getZhUrl = (url) => {
  const zh = path.sep + "zh" + path.sep;
  // 如果不是带了 /zh/ 的地址，需要转为对应的中文的地址
  if (url.includes(zh)) {
    return zh;
  }
  const translatedUrl = `${path.sep}translate${path.sep}translated${path.sep}`;
  const replaceUrl = `${path.sep}docs${path.sep}zh${path.sep}`;
  return url.replace(translatedUrl, replaceUrl);
};

const run = (sourceDir) => {
  // 开始循环处理file
  const files = fs.readdirSync(sourceDir);
  files.forEach(async (item) => {
    const filePath = path.join(sourceDir, item);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      run(filePath);
      return;
    }
    if (!item.endsWith(".md")) {
      return false;
    }
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data: matterData, content } = matter(fileContent, {});

    // 英文的是在 translate 下的，故需要使用中文版的创建时间和更新时间
    const zhFilePath = getZhUrl(filePath);
    // 增加创建时间和修改时间
    const [createAt, updateAt] = await Promise.all([
      getFileCreateTime(zhFilePath),
      getFileUpdateTime(zhFilePath),
    ]);

    // 如果没有permalink 则需要回写到md中
    matterData.creatAt = createAt;
    matterData.updateAt = updateAt;

    // 写入指定文件内即可

    // 拼接新的content
    let newFileContent = jsonToYaml
      .stringify(matterData)
      .replace(/\n\s{2}/g, "\n")
      .replace(/"/g, "");
    newFileContent += "---" + os.EOL + content;
    // 把地址写入文件内
    fs.writeFileSync(filePath, newFileContent);
  });
};

run(path.join(__dirname, targetFile));
