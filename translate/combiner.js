const fs = require('fs').promises
const path = require('path')
const addGptAuthorLine = require('./index.js').addGptAuthorLine

/**
 * Check if the filename is a Markdown file
 */
function isMarkdown(filename) {
  return path.extname(filename) === '.md'
}

async function exploreAndCombine(baseDir) {
  try {
    const dirents = await fs.readdir(baseDir, { withFileTypes: true })

    // Group files by their prefix (filename without the last two characters)
    let filesGrouped = {}
    for (const dirent of dirents) {
      if (dirent.isFile() && isMarkdown(dirent.name)) {
        let basename = path.basename(dirent.name, '.md')
        if (basename[basename.length - 2] === '_') {
          const groupKey = basename.slice(0, -2)
          if (!filesGrouped[groupKey]) {
            filesGrouped[groupKey] = []
          }
          filesGrouped[groupKey].push(dirent.name)
        }
      } else if (dirent.isDirectory()) {
        // Recursively explore subdirectories
        await exploreAndCombine(path.join(baseDir, dirent.name))
      }
    }

    // Process and combine files for each group
    for (const groupKey of Object.keys(filesGrouped)) {
      let files = filesGrouped[groupKey]
      if (files.length > 1) {
        // Only process groups with more than one file
        await combineFiles(baseDir, groupKey, files)
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${baseDir}: `, err)
  }
}

/**
 * Combine files into a single markdown file
 */
async function combineFiles(dir, groupKey, files) {
  // Sort the files by the last character of the filename
  files.sort((a, b) => a.slice(-1).localeCompare(b.slice(-1)))

  let combinedContent = ''
  for (let file of files) {
    let filePath = path.join(dir, file)
    combinedContent += await fs.readFile(filePath, { encoding: 'utf8' })
    combinedContent += '\n'
  }

  let newFileName = `${groupKey}.md`
  await fs.writeFile(path.join(dir, newFileName), combinedContent)
  console.log(
    `Combined files in ${dir}: ${files.join(', ')} into ${newFileName}`
  )
}

// Usage: Call this function with the path to the directory to start from.
exploreAndCombine('./translated/').then(() => {
  addGptAuthorLine()
})
