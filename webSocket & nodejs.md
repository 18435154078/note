<center><h1>webSocket & nodejs</h1></center>

# 一、 原生websocket

安装node服务端安装nodejs-websocket

```shell
npm i nodejs-websocket -S
```

## 1. 客户端

```js
const ws = new WebSocket('ws://127.0.0.1:8000')
var arr = []
// 连接建立时会调用
ws.onopen = function() {
    console.log('连接已建立')
}
ws.onmessage = function(e) {
    arr.push(e.data)
    render(arr)
}

$('button').click(function() {
    if($('input').val()) {
        ws.send($('input').val())
        $('input').val('')
    }
})

// 渲染聊天记录
function render(obj) {
    var ret = ''
    obj.forEach(item => {
        let obje = JSON.parse(item)
        var text = ''
        console.log(obje)
        switch (obje.type) {
            case 0:
                text = obje.msg
                break;
            case 1:
                text = obje.msg + ' ' + obje.date
                break;
            case 2:
                text = obje.msg
                break;
        }
        ret += `
<div class="item">${text}</div>
`
        $('.count').html(obje.count)
    })
    $('.cheat').html(ret)
}
```

## 2. 服务端

```js
const ws = require('nodejs-websocket')

// 给发送的消息分类，进入，离开，聊天
let TYPE_ENTER = 0
let TYPE_CHAT = 1
let TYPE_LEAVE = 2

// 当前聊天室的人数
let count = 0

// 创建一个websocket服务端
const server = ws.createServer(function(connect) {
    // 当有人进入群聊是+1
    count++
    // 将count传到客户端
    connect.name = `用户${count}`
    connection({
        msg: `<span style="color:green;font-size:12px;">${connect.name}加入了聊天室</span>`,
        type: TYPE_ENTER,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        count
    })
    // 接收客户端发来的消息
    connect.on('text', function(msg) {
        connection({
            msg: `<span>${msg}</span>`,
            type: TYPE_CHAT,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        })
    })
    connect.on('close', function() {
        // 当有人进入群聊是-1
        count--
        // 将count传到客户端
        connection({
            msg: `<span style="color:red;font-size:12px;">${connect.name}离开了聊天室</span>`,
            type: TYPE_LEAVE,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            count
        })
    })
    connect.on('error',function(err){
        // console.log(err)
    })
    
}).listen(8000)

function connection(msg) {
    server.connections.forEach(connect => {
        connect.sendText(JSON.stringify(msg))
    })
}

```







# 二、 socket.io实现一个简单的聊天室





