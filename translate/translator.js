const http = require('http')

async function callRemoteApi(data) {
  const options = {
    hostname: '127.0.0.1',
    port: 8000,
    path: '/df-interpreter',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let response = ''

      res.on('data', (chunk) => {
        response += chunk
      })

      res.on('end', () => {
        try {
          resolve(JSON.parse(response))
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    // Write data to request body
    req.write(JSON.stringify(data))
    req.end()
  })
}

const TRANSLATE_FAILED = '翻译失败了'

const translateFile = async (fileContent) => {
  let data = { question: fileContent }
  let res = await callRemoteApi(data)
  console.log(res)
  return res.DATA || TRANSLATE_FAILED
}

// translateFile('我倒要看看你到底行不行').then((d) => console.log(d))

module.exports = {
  //translateFile: (d) => '胡说八道，谢谢。',
  translateFile,
  TRANSLATE_FAILED,
}
