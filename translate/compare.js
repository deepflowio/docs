const fs = require('fs').promises
const path = require('path')

async function countLines(file) {
  const content = await fs.readFile(file, 'utf8')
  return content.split('\n').length
}

async function getFileList(dir) {
  let filesList = []

  async function readDirectory(directory) {
    const files = await fs.readdir(directory)

    for (const file of files) {
      const fullPath = path.join(directory, file)
      const stat = await fs.stat(fullPath)
      if (stat.isDirectory()) {
        await readDirectory(fullPath)
      } else {
        filesList.push(fullPath)
      }
    }
  }

  await readDirectory(dir)
  return filesList
}

async function compareDirectories(dirA, dirB) {
  const filesA = await getFileList(dirA)
  const filesB = await getFileList(dirB)
  let differences = []

  for (let i = 0; i < filesA.length; i++) {
    const relativePath = path.relative(dirA, filesA[i])
    const correspondingFileB = path.join(dirB, relativePath)

    // Check if the corresponding file exists in Directory B
    if (filesB.includes(correspondingFileB)) {
      const linesA = await countLines(filesA[i])
      const linesB = await countLines(correspondingFileB)
      const diff = linesA - linesB
      differences.push({ file: relativePath, diff: diff })
    }
  }

  // Sort differences by the absolute value of the number of line differences.
  differences.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))

  differences.forEach((d) => console.log(`${d.file}: ${d.diff}`))
}

compareDirectories('./translated', '../docs/docs/zh')
