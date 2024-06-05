const fs = require('fs').promises
const path = require('path')
const crypto = require('crypto')
const { translateFile, TRANSLATE_FAILED } = require('./translator')

let translatedDirPath = ''
let mapFilePath

const readMapFile = async () => {
  try {
    const content = await fs.readFile(mapFilePath, { encoding: 'utf8' })
    return new Map(
      content
        .split('\n')
        .filter((line) => line)
        .map((entry) => entry.split('#@@#'))
    )
  } catch (error) {
    if (error.code === 'ENOENT') {
      // map file does not exist
      return new Map()
    } else {
      throw error
    }
  }
}

const writeMapFile = async (map) => {
  const mapString = Array.from(map.entries())
    .map((entry) => entry.join('#@@#'))
    .join('\n')
  await fs.writeFile(mapFilePath, mapString)
}

const calculateMD5 = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf8')
  return crypto.createHash('md5').update(content).digest('hex')
}

const writeFileWithDir = async (targetPath, content) => {
  const dirname = path.dirname(targetPath)

  try {
    // 如果目录不存在，则会创建它。
    await fs.mkdir(dirname, { recursive: true })
  } catch (err) {
    // 当目录已存在时，会抛出"file already exists"错误，我们可以忽略这个错误。
    if (err.code !== 'EEXIST') throw err
  }

  try {
    // 写入文件
    await fs.writeFile(targetPath, content)
    console.log('File written successfully')
  } catch (err) {
    console.error('Error writing file:', err)
  }
}

const translateMarkdownFile = async (filePath, relativePath, map) => {
  const fileMD5 = await calculateMD5(filePath)
  const fileName = path.basename(filePath)
  const existingMD5 = map.get(relativePath)

  if (fileMD5 === existingMD5) {
    // If MD5 hasn't changed, no need to translate
    console.log(`No changes detected for '${fileName}'.`)
    return -1
  } else {
    console.log(
      `changes detected for '${fileName}: ${existingMD5} -> ${fileMD5}'.`
    )
  }

  // If MD5 is different or file wasn't translated before, translate it
  const fileContent = await fs.readFile(filePath, 'utf8')
  const translatedContent = await translateFile(fileContent)
  // 未完全测试
  translatedContent = replaceLinks(translatedContent)
  if (translatedContent === TRANSLATE_FAILED) {
    console.log(TRANSLATE_FAILED)
    return
  }

  const translatedFilePath = path.join(translatedDirPath, relativePath)
  await writeFileWithDir(translatedFilePath, translatedContent)
  console.log(`Translated '${fileName}'`)

  // Update the map
  map.set(relativePath, fileMD5)
}

const sleep = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  })
}

const processMarkdownDirectoryFile = async (markdownFilePath) => {
  const translatedDirExists = await fs
    .stat(translatedDirPath)
    .catch(() => false)
  if (!translatedDirExists) {
    await fs.mkdir(translatedDirPath)
  }

  const map = await readMapFile()

  //const links = await parseMarkdownLinks(markdownFilePath)
  const links = await getMarkdownFiles(markdownFilePath)

  console.log(markdownFilePath)
  for (const relativeFilePath of links) {
    console.log(relativeFilePath)
    const fullFilePath = path.resolve(markdownFilePath, relativeFilePath)
    const isModified = await translateMarkdownFile(
      fullFilePath,
      relativeFilePath,
      map
    )
    if (isModified === -1) {
      continue
    }
    await writeMapFile(map)
    await sleep(5)
  }
}

// 使用正则表达式匹配Markdown文件中的所有.md超链接
const parseMarkdownLinks = async (markdownFilePath) => {
  const markdownContent = await fs.readFile(markdownFilePath, 'utf8')
  const linkRegex = /\[.*?\]\((.*?.md)\)/g
  const links = []

  let match
  while ((match = linkRegex.exec(markdownContent)) !== null) {
    links.push(match[1])
  }

  return links
}

async function getMarkdownFiles(dir, fileList = [], root = null) {
  if (!root) {
    root = dir
  }
  const files = await fs.readdir(dir, { withFileTypes: true })
  for (const file of files) {
    const resPath = path.resolve(dir, file.name)
    if (file.isDirectory()) {
      await getMarkdownFiles(resPath, fileList, root) // Recursive call for directories
    } else if (file.name.endsWith('.md')) {
      fileList.push(path.relative(root, resPath)) // Add markdown file with relative path
    }
  }
  return fileList
}

const insertLineIfNotExists = async (
  filePath,
  lineContent,
  lineNumber,
  pattern
) => {
  try {
    // Read the contents of the file
    let data = await fs.readFile(filePath, 'utf-8')

    // If pattern is provided, remove lines that match the pattern
    if (pattern) {
      const regex = new RegExp(pattern + '\n', 'g')
      data = data.replace(regex, '')
    } else {
      // Remove the specific line content if pattern is not provided
      data = data.replaceAll(lineContent + '\n', '')
    }

    const lines = data.split('\n')
    // Check if line number is out of bounds
    if (lineNumber < 1 || lineNumber > lines.length + 1) {
      console.error(filePath + ': Line number out of bounds')
      return
    }

    // Insert the new line content if it doesn't exist already
    lines.splice(lineNumber - 1, 0, lineContent)

    // Join the lines back together and write to the file
    const newData = lines.join('\n')
    await fs.writeFile(filePath, newData, 'utf-8')
  } catch (err) {
    throw err
  }
}

// 调用主函数，传入目录文件路径

// 给生成的文件中插入内容
const addGptAuthorLine = async () => {
  let files = await getMarkdownFiles('./translated', [], './')
  for (let file of files) {
    console.log(`处理${file}`)
    await insertLineIfNotExists(
      file,
      '> This document was translated by ChatGPT\n',
      6,
      '> This document was translated by.*\n'
    )
  }
}

function replaceLinks(str) {
  // 使用正则表达式找到所有符合条件的链接
  return str.replace(
    /https:\/\/raw\.githubusercontent\.com[^\s]*?\.ch\b/g,
    function (match) {
      // 将每个匹配的链接中的 .ch 替换为 .en
      return match.replace('.ch', '.en')
    }
  )
}

module.exports = {
  addGptAuthorLine,
}

if (require.main === module) {
  // 需要翻译时开启下面代码
  const args = process.argv.slice(2) // 获取所有命令行参数，并去掉前两个参数(node 和 script file path)

  if (args.length !== 2) {
    console.error(
      '需要两个参数: 需要解析的markdown目录文件地址，翻译后保存的目录名称'
    )
    process.exit(1)
  }

  translatedDirPath = path.join(__dirname, args[1])
  mapFilePath = path.join(translatedDirPath, 'map.txt')

  processMarkdownDirectoryFile(path.resolve(__dirname, args[0]))
    .catch(console.error)
    .then(() => {
      addGptAuthorLine().filter((d) => d)
    })
}
