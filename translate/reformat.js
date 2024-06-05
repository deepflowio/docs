const fs = require('fs')
const path = require('path')

// Function to read the content of a file and return it as an array of lines
const readFileLines = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8').split('\n')
}

// Function to write an array of lines to a file
const writeFileLines = (filePath, lines) => {
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
}

// Function to recursively process directories
const processDirectories = (sourceDir, targetDir) => {
  fs.readdirSync(sourceDir).forEach((file) => {
    const aFilePath = path.join(sourceDir, file)
    const bFilePath = path.join(targetDir, file)

    // Check if the path is a directory or a file
    if (fs.statSync(aFilePath).isDirectory()) {
      // If directory, recursively process subdirectories
      if (!fs.existsSync(bFilePath)) {
        fs.mkdirSync(bFilePath)
      }
      processDirectories(aFilePath, bFilePath)
    } else {
      // If file, process the file content
      if (!fs.existsSync(bFilePath)) {
        console.log(`File ${bFilePath} does not exist.`)
        return
      }
      fixFileContent(aFilePath, bFilePath)
    }
  })
}
const getLeadingWhitespaceCount = (str) => {
  return str.length - str.trimStart().length
}

// Function to fix the content of a file in directory B based on the corresponding file in directory A
const fixFileContent = (aFilePath, bFilePath) => {
  const aLines = readFileLines(aFilePath)
  const bLines = readFileLines(bFilePath)

  const fixedLines = []
  let bLineIndex = 0

  // Traverse each line in A file
  for (let aLine of aLines) {
    if (bLineIndex >= bLines.length) {
      fixedLines.push(aLine)
      continue
    }

    let bLine = bLines[bLineIndex]

    if (aLine.trim() === '') {
      fixedLines.push('')
      if (bLine.trim() === '') {
        bLineIndex++
      }
      continue
    } else {
      if (bLine.trim() === '') {
        throw new Error(
          `文件${aFilePath} - ${bFilePath} 不匹配${aLine} -> ${
            bLineIndex + 1
          }: 空行`
        )
      }
      const n = getLeadingWhitespaceCount(aLine)
      fixedLines.push(`${' '.repeat(n)}${bLine.trim()}`)
      bLineIndex++
    }
  }

  writeFileLines(bFilePath, fixedLines)
}

// Define directories A and B
const sourceDir = '../docs/docs/zh'
const targetDir = 'translated/zh'

// Process the directories
//
processDirectories(sourceDir, targetDir)
