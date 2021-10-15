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

链接地址：<a href="https://zhuanlan.zhihu.com/p/29148869">中文文档</a>，<a href="https://socket.io/">官网</a>， <a href="https://www.w3cschool.cn/socket/">W3C</a>

## 1. 原生nodejs

### 1）客户端

```html
<script src="/socket.io/socket.io.js"></script>
<script>
    // 链接io
    var socket = io('http://localhost:8000')

    // 接收消息
    socket.on('news', function (data) {
        console.log(data)
    });
    // 发送消息
    socket.emit('哈哈', { my: 'data' })
</script>
```

### 2）服务端

```js
const http = require('http')
const fs = require('fs')
const socket = require('socket.io')

const server = http.createServer(function(req, res) {
    fs.readFile(__dirname + '/index.html', function(err, data) {
        if(err) {
            res.writeHead(500)
            return res.end('Error')
        } else {
            res.end(data)
        }
    })
}).listen(8000)

const io = socket(server)

// 连接时会触发
io.on('connection', socket => {
    // console.log('已连接')
    
    // 发送消息，事件名称自定义，可中文，但不建议
    socket.emit('news', { world: 'world' });
    // 接收消息
    socket.on('哈哈', function (data) {
        console.log(data);
    });
})
```

## 2. express框架

### 2.1 客户端

#### 2.1.1 socket.io基本写法

```html
<script src="/socket.io/socket.io.js"></script>
<script>
	const socket = io('http://localhost:8000')
    // 监听login事件
    socket.on('login', data => {console.log(data)})
    // 触发login事件
    socket.emit('login', data => {console.log(data)})
</script>
```

#### 2.1.2 表情包的使用

<a href="http://eshengsky.github.io/jQuery-emoji/">emoji官网</a>

```js
$("#textarea").emoji({
    button: ".face",
    showTab: true,
    animation: 'slide',
    position: 'topRight',
    icons: [
        {
            name: "QQ表情",
            path: "/emoji-lib/dist/img/qq/",
            maxNum: 91,
            file: ".gif",
            placeholder: "#qq_{alias}#",
        },
        {
            name: '魔法表情',
            path: "/emoji-lib/dist/img/tieba/",
            file: ".jpg",
            maxNum: 50,
        },
        {
            name: 'emoji表情',
            path: "/emoji-lib/dist/img/emoji/",
            file: ".png",
            maxNum: 84,
        }
    ]
})
```

#### 2.1.3 图片的发送

```js
// 点击
$('.upload-image').click(function() {
    $('.file-input')[0].click()
})
// 监听change事件，将得到的file文件转转成base64，再发给后台
$('.file-input').on('change', function() {
    let blob = window.URL.createObjectURL($(this)[0].files[0])

    // 发送图片消息
    socket.emit('sendImgMsg', {
        username,
        avatar,
        blob
    })
    console.log(blob)
})
```

### 2.2 服务端

#### 2.2.1 express基本写法

```js
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')

server.listen(8000)

app.get('/', function (req, res) {
  fs.readFile(__dirname + '/index.html', 'utf-8', (err, data) => {
    if(err) {
      console.log(err)
      return
    }
    res.end(data)
  })
})

// 客户端建立连接时触发
io.on('connection', function (socket) {
 
    // 客户端断开连接时触发
    socket.on('disconnect', () => {
    	
    })
});
```

#### 2.2.2 socket.io用法

##### 2.2.2.1 广播

```js
io.on('connection', function (socket) {
    // 广播消息
	io.emit('login', {})
});
```

##### 2.2.2.2 加入房间

```js
io.on('connection', function (socket) {
    // 加入房间
    socket.join(socket.roomname)
    // 向房间广播消息
	io.to(socket.roomname).emit('login', {})
});
```



