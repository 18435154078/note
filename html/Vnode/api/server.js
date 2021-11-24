const http = require('http')
const fs = require('fs')
http.createServer((req, res) => {
    const { url, method } = req
    console.log(url)
    if(url === '/' && method === 'GET') {
        fs.readFile('./index.html', (err, data) => {
            res.setHeader('Content-Type', 'text/html')
            res.end(data)
        })
    }
})
.listen(3000)