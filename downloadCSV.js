const axios = require('axios')
const fs = require('fs')
const path = require('path')
const github = axios.create({})

// docs目录所在的位置
const FILE_PATH = "./docs"

const csvListRxp = /\[csv-(.*)]\((.*)\)/g
const csvNameAndUrlRxp = /\[csv-(.*)]\((.*)\)/

async function downloadCSV(url) {
    return github.get(url).then(res => {
        if (res.data.startsWith('#')) {
            return res.data
        } else {
            return ""
        }
    })
}

// 分析csv 只保证前面不除英文,注释可以出现
function analysis(string) {
    if (!string) {
        return {
            tableHeader: [],
            tableContent: []
        }
    }
    string = string.slice(1) // 去掉第一个#
    const strings = string.split("\n").map(s => {
        return s.split(",").map(s => s.trim())
    }).filter(s => s.length !== 1)
    const tableHeader = strings[0]
    const tableContent = strings.slice(1)
    return {
        tableHeader,
        tableContent
    }
    // const intervals = []
    // let strings = string.split("\n")
    // console.log(strings)
    // let startIndex = -1
    // while (true) {
    //     startIndex = strings[0].indexOf(',', startIndex + 1)
    //     if (startIndex === -1) {
    //         break
    //     }
    //     intervals.push(startIndex)
    // }
    // intervals.push(strings[0].length + 1)

    // const newstrings = strings.map(s => {
    //     const arr = []
    //     let start = -1
    //     for (let i = 0; i < intervals.length; i++) {
    //         arr.push(s.slice(start + 1, intervals[i]))
    //         start = intervals[i]
    //     }
    //     return arr
    // })
    // console.log(newstrings)
}

function createTable(table) {
    const { tableHeader, tableContent } = table
    const headerLength = tableHeader.length

    let tableString = "|"
    let middleString = "|"

    tableHeader.forEach(element => {
        tableString += element
        tableString += "|"
        middleString += "-----------|"
    });

    middleString += "\n"
    tableString += "\n"
    tableString += middleString

    tableContent.forEach((element) => {
        let tr = "|"
        element.forEach((e, index) => {
            if (index < headerLength) {
                tr += e
                tr += "|"
            }
        })
        tr += "\n"
        tableString += tr
    })

    return tableString
}

async function work(sourceDir) {
    let files = fs.readdirSync(sourceDir);
    files = files.filter(name => name !== ".vuepress")
    for (let index = 0; index < files.length; index++) {
        const filePath = path.join(sourceDir, files[index]);
        const stat = fs.statSync(filePath);
        if (!stat.isDirectory()) {
            let fileContent = fs.readFileSync(filePath, "utf8");
            const matchs = fileContent.match(csvListRxp)
            if (matchs) {
                for (let a = 0; a < matchs.length; a++) {
                    const [, name, url] = matchs[a].match(csvNameAndUrlRxp)
                    const CSVContentString = await downloadCSV(url)
                    const table = analysis(CSVContentString)
                    const tableString = createTable(table)
                    const preIndex = fileContent.indexOf(matchs[a]) - 1
                    const nextIndex = fileContent.indexOf(matchs[a]) + matchs[a].length
                    let totalString = ""
                    if (fileContent[preIndex] !== "\n") {
                        totalString += "\n\n"
                    } else if (fileContent[preIndex - 1] !== "\n") {
                        totalString += "\n"
                    }
                    totalString += `**${name}**`
                    totalString += "\n\n"
                    totalString += tableString
                    if (fileContent[nextIndex] !== "\n") {
                        totalString += "\n\n"
                    } else if (fileContent[nextIndex + 1] !== "\n") {
                        totalString += "\n"
                    }
                    fileContent = fileContent.replace(matchs[a], totalString)
                }

                fs.writeFileSync(filePath, fileContent)
            }
        } else {
            await work(filePath)
        }
    }
}

work(FILE_PATH)