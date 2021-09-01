<center><h1>axios</h1></center>

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

- 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

## 一、 安装

### 1. npm安装

```shell
npm install axios
```

### 2. CDN

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

## 二、 请求

### 1. get请求

#### 1）无参请求

```js
axios({
    method: 'GET',
    url: 'http://localhost:8000/data1'
}).then(res => {
    console.log(res)
})
```

```js
axios.get('http://localhost:8000/data1').then(res => {
    console.log(res)
})
```

#### 2）有参请求

```js
axios({
    method: 'GET',
    url: 'http://localhost:8000/data1',
    params: {id: 1}
}).then(res => {
    console.log(res)
})
```

```js
axios.get('http://localhost:8000/data1?id=1').then(res => {
    console.log(res)
})
```

### 2. post请求

#### 1）无参请求

```js
axios({
    method: 'POST',
    url: 'http://localhost:8000/data1'
}).then(res => {
    console.log(res)
})
```

```JS
axios.post('http://localhost:8000/data1').then(res => {
    console.log(res)
})
```

#### 2）有参请求

```js
axios({
    method: 'POST',
    url: 'http://localhost:8000/data1',
    params: { id:1 },
    data: { name: '111', password: '222' }
}).then(res => {
    console.log(res)
})
```

```js
axios.post('http://localhost:8000/data1?id=1', {
    name: '111',
    password: '222'
}).then(res => {
    console.log(res)
})
```

### 3. 并发请求

- `axios` 方法可以参数是多个请求的数组
- 通过`.then` 来调用返回的数据
- 需要通过 `axios.spread` 将并发请求返回的数据分开并处理，也可以直接用一个res去接收，返回的是一个数组

```js
req1 = axios.get('http://localhost:8000/data')
req2 = axios.get('http://localhost:8000/data1')
axios.all([req1,req2]).then(axios.spread((res1,res2) => {
    console.log(res1,res2)
}))
```

### 4. 请求配置

#### 1）url(请求地址)

#### 2）method(请求方法)

#### 3）baseURL(基础地址)

#### 4）transformRequest

可以统一处理请求数据

```js
// `transformRequest` 允许在向服务器发送前，修改请求数据
// 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
// 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
transformRequest: [function (data, headers) {
    // data.params.id =  data.params.id + 1
    // 对 data 进行任意转换处理
    return data
}],
```

#### 5）transformResponse

可以统一处理响应数据

```js
// `transformResponse` 在传递给 then/catch 前，允许修改响应数据
transformResponse: [function (data) {
    // console.log(JSON.parse(data))
    // data = JSON.stringify(JSON.parse(data))
    // 对 data 进行任意转换处理
    return JSON.parse(data)
}]
```

#### 6）headers(请求头)

#### 7）parse(url请求参数)

#### 8）data(post请求参数)

#### 9）timeout(请求超时)

### 5. 拦截器

#### 1）请求拦截器

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
```

#### 2）响应拦截器

```js
// 响应拦截器
request.interceptors.response.use(function (response) {
  // 所有2xx都会进入这里
  // 必须把response 给 return 出去，不然会直接卡到这
  return response;
}, function (error) {
  // 判断当状态码是401时，清除user，并跳到登录页面
  if(error.response.status === 401){
    window.localStorage.removeItem('user')
    router.push('/login')
  }
  // 利用响应拦截器可以集中处理一公共的响应状态码
  return Promise.reject(error)
})
```

## 三、 qs和JSON

`qs.stringify` 是将对象转化为查询参数的形式

`JSON.stringify` 是将对象转化为字符串的形式



