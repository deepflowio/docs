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
            console.log("res.code===", (res.code))
            console.log("res.data===", JSON.stringify(res.data))
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
    string = string.slice(string.indexOf("#") + 1) // 去掉第一个#
    const strings = string.split("\n").filter(s => !(s.startsWith("#") || s.trim() === "")).map(s => {
        return s.split(",").map(s => s.trim())
    })
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

function createTable(table, url) {
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
            } else {
                console.log("csvUrl:" + url + ",extraData:" + e)
            }
        })
        if (headerLength > element.length) {
            console.log("This row is missing data，csvUrl:" + url + ",element:" + element.toString())
            tr += "|".repeat(headerLength - element.length)
        }
        tr += "\n"
        tableString += tr
    })

    return tableString
}
const mergeCHAndOrigin = (chTable, originTable, headers, {
    key = 'Category',
    value
}) => {
    const { tableHeader: chTableHeader, tableContent: chTableContent } = chTable
    const { tableHeader: originTableHeader, tableContent: originTableContent } = originTable
    if (!originTableHeader.includes(key)) {
        return {
            tableHeader: [],
            tableContent: []
        }
    }

    const keyIndex = originTableHeader.indexOf(key)
    const filteredOrigin = originTableContent.filter(content => content[keyIndex] === value) // 读取到列
    const keys = filteredOrigin.map(item => item[0]) // 读取到keys
    const filteredCh = chTableContent.filter(item => keys.includes(item[0]))
    let newTableContent = new Array(keys.length).fill(1)
    newTableContent = newTableContent.map(() => ([]))
    headers.forEach((header, index) => {
        if (originTableHeader.includes(header)) {
            const hIndex = originTableHeader.indexOf(header)
            filteredOrigin.forEach((f, i) => {
                newTableContent[i][index] = f[hIndex]
            })
        } else if (chTableHeader.includes(header)) {
            const chIndex = chTableHeader.indexOf(header)
            filteredCh.forEach((f, i) => {
                newTableContent[i][index] = f[chIndex]
            })
        }
    })
    return {
        tableHeader: headers,
        tableContent: newTableContent
    }
}
const categoryHeaders = ['Field', 'DisplayName', 'Unit', 'Type', 'Description']
const cacheMap = {}
async function work(sourceDir) {
    let files = fs.readdirSync(sourceDir);
    files = files.filter(name => name !== ".vuepress")
    for (let index = 0; index < files.length; index++) {
        const filePath = path.join(sourceDir, files[index]);
        const stat = fs.statSync(filePath);
        if (!stat.isDirectory()) {
            let fileContent = fs.readFileSync(filePath, "utf8");
            const matchs = fileContent.match(csvListRxp)
            console.log(`filePath:${filePath},matchs: ${matchs && matchs.toString()}`)
            if (matchs) {
                for (let a = 0; a < matchs.length; a++) {
                    let [, name, url] = matchs[a].match(csvNameAndUrlRxp)
                    const isCategory = url.includes('Category=')
                    // 英文版使用 .en 中文版使用 .ch
                    url = filePath.includes('/zh/')? url: url.replace(/.ch$/, '.en')
                    const files = url.split("/")
                    let tableString
                    if (url in cacheMap) {
                        tableString = cacheMap[url]
                    } else if (isCategory) {
                        const Category = url.split("?Category=")[1]
                        const chURL = url.split("?")[0]
                        const originURL = chURL.slice(0, -3)
                        const chCSVContentString = await downloadCSV(chURL)
                        const originCSVContentString = await downloadCSV(originURL)
                        const chTable = analysis(chCSVContentString)
                        const originTable = analysis(originCSVContentString)
                        tableString = createTable(mergeCHAndOrigin(chTable, originTable, categoryHeaders, {
                            key: 'Category',
                            value: Category
                        }), chURL)
                        cacheMap[url] = tableString
                    } else {
                        const CSVContentString = await downloadCSV(url)
                        const table = analysis(CSVContentString)
                        tableString = createTable(table, url)
                        cacheMap[url] = tableString
                    }

                    const preIndex = fileContent.indexOf(matchs[a]) - 1
                    const nextIndex = fileContent.indexOf(matchs[a]) + matchs[a].length
                    let totalString = ""
                    if (fileContent[preIndex] !== "\n") {
                        totalString += "\n\n"
                    } else if (fileContent[preIndex - 1] !== "\n") {
                        totalString += "\n"
                    }
                    totalString += `<div class="csv-box">`
                    totalString += "\n\n"
                    // totalString += `**${name}**`
                    // totalString += "\n\n"
                    totalString += tableString
                    totalString += `<p class="csv-url">generate from csv file: <a title="${url}" href="${url}" target="_blank">${files[files.length - 1]}</a></p>\n`
                    totalString += `</div>`
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