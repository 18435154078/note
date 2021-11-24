<center><h1>vue实现头条后台管理</h1></center>

# 一、 element组件使用

## 1. element组件安装和引入

### 1.1 安装

```shell
npm i element-ui -S
```

### 1.2 引入

```javascript
//引入组件
import ElementUI from 'element-ui'
//引入css样式
import 'element-ui/lib/theme-chalk/index.css'
//将element注册为全局组件
Vue.use(ElementUI)
```

## 2. 登录页面

### 2.1 表单控件

表单整体用 `el-form` 标签包裹，每个表单控件均用 `el-form-item` 包裹

#### 2.1.1 文本框

```html
<el-form ref="ruleForm" :model="form">
	<el-form-item prop="">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item prop="">
        <el-input type="password" v-model="form.code" placeholder="请输入验证码"></el-input>
    </el-form-item>
</el-form-item>

form: {
    mobile: '13911111111',
    code: '246810'
}
```

#### 2.1.2 多选框

```html
<el-form-item prop="" class="isChecked" >
	<el-checkbox v-model="form.checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
</el-form-item>
```

#### 2.1.3 按钮

```html
<el-form-item>
	<el-button type="primary" class="btn" @click="onLogin" :loading="loginLoading">登录</el-button>
</el-form-item>
```

- 点击按钮出现加载中： `:loading="loginLoading`
  - loginLoading = true时，显示加载中，loginLoading = false时，可点击
  - loginLoading 默认为false，当点击登录按钮时，将loginLoading 修改为false，当请求成功或失败时，再将loginLoading 修改为true

- 点击按钮弹出提示信息

  - 成功时：

    ```js
    this.$message({
        message: '恭喜你，登录成功',
        type: 'success',
        duration: '1000'
    })
    ```

  - 失败时：

    ```js
    this.$message.error({
        message: '手机号或密码错误',
        duration: '1000'
    })
    ```

### 2.2 表单验证

#### 2.2.1 必须给el-form组件绑定model为表单数据对象，并绑定rules作为验证规则

```html
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"></el-form>
```

#### 2.2.2 给需要验证的表单元素 `el-form-item` 绑定prop属性

```html
<el-form-item prop="mobile">
    <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
</el-form-item>
```

#### 2.2.3 表单验证规则

```js
rules: {
	mobile: [
    	{ required: true, message: '请输入手机号', trigger: 'blur' },
        // 验证手机号格式
       	{ pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
    ],
    code: [
    	{ required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 6, message: '长度在 6 个字符',  }
    ],
    agree: [
    	{
       		// 自定义校验规则
          	validator: (rule, value, callback) => {
            if (value) {
                callback()
              } else {
                callback(new Error('请同意协议'))
              }
            },
            trigger: 'blur'
		}
	]
}
```

#### 2.2.4 验证成功需要做的事

- 登录按钮呈现loading效果
- 发送ajax请求登录
- 请求成功
  - 显示成功提示
  - 关闭loading
  - 储存token
  - 跳转到主页
- 请求失败
  - 提示登录失败
  - 关闭loading

```js
this.$refs['ruleForm'].validate(valid => {
    if (!valid) {
        return
    } else {
        // 验证通过提交数据
        // 登录按钮呈现loading效果
        this.loginLoading = true
        // 发送ajax请求登录
        login(form).then(res => {
            // 请求成功的提示
            this.$message({
              message: '恭喜你，登录成功',
              type: 'success',
              duration: '1000'
            })
            // 关闭loading
            this.loginLoading = false
            // 储存token
            window.localStorage.setItem('user', JSON.stringify(res.data.data))
            // 路径跳转
            // this.$router.push('/home')
            // 命名路由跳转
            this.$router.push({
              name: 'Home'
            })
          }).catch(err => {
            // 请求失败提示
            this.$message.error({
              message: '手机号或密码错误',
              duration: '1000'
            })
            // 关闭loading
            this.loginLoading = false
          })
    }
})
```

##  3. 路由的应用

### 3.1 父级路由为`/`

```js
routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: '',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Home
        },
        {
          path: '/content',
          name: 'Content',
          component: Content
        },
        {
          path: '/material',
          name: 'Material',
          component: Material
        }
      ]
    }
  ]
```

### 3.2 父级路由为`/index`

```js
routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: '',
      component: Layout,
      children: [
        {
          path: '/index',
          name: 'Home',
          component: Home
        },
        {
          path: '/index/content',
          name: 'Content',
          component: Content
        },
        {
          path: '/index/material',
          name: 'Material',
          component: Material
        }
      ]
    }
  ]
```

### 3.3 路由导航守卫

```js
router.beforeEach((to, form, next) => {
  const user = window.localStorage.getItem('user')
  if (to.path === '/login') {
    next()
  } else {
    if (user) {
      next()
    } else {
      next('/login')
    }
  }
})
```

## 4. 导航菜单

el-menu： 

- :default-active：路由激活的组件，`$route.path` 表示当前正在激活的路由
- background-color：背景颜色
- text-color：字体颜色
- active-text-color： 路由激活时的字体颜色
- router：对否启用路由
- collapse： 菜单栏是否折叠

el-menu-item：

- index：激活的路由

```html
<el-row class="tac">
    <el-col :span="100">
        <el-menu
                 :default-active="$route.path"
                 class="el-menu-vertical-demo"
                 background-color="#002033"
                 text-color="#fff"
                 active-text-color="gold"
                 router
                 :collapse="isCollapse"
                 >
            <el-menu-item index="/" class="item">
                <i class="el-icon-house"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/content" class="item">
                <i class="el-icon-message"></i>
                <span slot="title">内容管理</span>
            </el-menu-item>
            <el-menu-item index="/material" class="item">
                <i class="el-icon-picture"></i>
                <span slot="title">素材管理</span>
            </el-menu-item>
            <el-menu-item index="/article" class="item">
                <i class="el-icon-position"></i>
                <span slot="title">发布文章</span>
            </el-menu-item>
            <el-menu-item index="/comment" class="item">
                <i class="el-icon-chat-dot-square"></i>
                <span slot="title">评论管理</span>
            </el-menu-item>
            <el-menu-item index="/fans" class="item">
                <i class="el-icon-present"></i>
                <span slot="title">粉丝管理</span>
            </el-menu-item>
            <el-menu-item index="/personal" class="item">
                <i class="el-icon-setting"></i>
                <span slot="title">个人设置</span>
            </el-menu-item>
        </el-menu>
    </el-col>
</el-row>
```

## 5. Container 布局容器

```html
<el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside class="aside" width="auto">
        <Aside :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
        <!-- header -->
        <el-header class="header">
            <!-- 一个图标，点击展开收起菜单栏 -->
            <i
               :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
               @click="collapse"
               ></i>
            <b class="header_text">江苏传智播客科技教育有限公司</b>
            <!-- 这里使用Layout栅格布局 -->
            <el-row class="block-col-2">
                <el-col :span="12" class="push-down">
                    <img class="touxiang" :src="photo" alt="" />
                    <el-dropdown class="el-dropdown">
                        <span>{{ name }}</span>
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                            	icon="el-icon-setting"
                            	@click.native="persional"
                            >个人设置</el-dropdown-item>
                            <el-dropdown-item
                            	icon="el-icon-unlock"
                                @click.native="logout"
                            >退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-header>
        <!-- 中间内容，这里放路由 -->
        <el-main class="main">
            <keep-alive>
                <router-view />
            </keep-alive>
        </el-main>
    </el-container>
</el-container>
```

## 6. 内容管理

### 6.1 面包屑

- to：路由跳转对象
- separator：分隔符
- separator-class：分割图标

```html
<el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>内容管理</el-breadcrumb-item>
</el-breadcrumb>
```

### 6.2 表格

el-table： 

- data：需要绑定的数据
- height：高度
- max-height：最大高度
- stripe：是否

el-table-column：

- label：表头显示

- prop：对应列的字段名

- slot-scope="scope"：`template` 标签下添加`slot-scope="scope"` 可以获取到遍历的这条数据

  - ```html
    <el-table-column label="状态">
        <!-- 自定义如果需要拿到对应的数据scope， -->
        <template slot-scope="scope">
            <el-tag :type="statu[scope.row.status].type">
                {{ statu[scope.row.status].tag }}
            </el-tag>
        </template>
    </el-table-column>
    ```

  - `template` 添加上 `slot-scope="scope"`属性后，可以通过 <span style="color:red">`scope.row` </span>获取到这条数据，然后就可以为所欲为

```html
<el-table :data="articles" style="width: 100%">
    <el-table-column label="封面">
        <!-- slot-scope="scope"这句代码必须要有，scope.row可以获取到每个遍历的对象 -->
        <template slot-scope="scope">
            <!-- <img :src="scope.row.cover.images[0]"
class="coverImg"
v-if="scope.row.cover.images[0]">
<img src="./imgs/default.png"
v-else
class="coverImg"> -->
            <el-image :src="scope.row.cover.images[0]" class="coverImg" lazy>
                <div slot="placeholder" class="image-slot">
                    加载中
                    <span class="dot">...</span>
                </div>
            </el-image>
        </template>
    </el-table-column>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column label="状态">
        <!-- 自定义如果需要拿到对应的数据scope， -->
        <template slot-scope="scope">
            <el-tag :type="statu[scope.row.status].type">
                {{ statu[scope.row.status].tag }}
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="pubdate" label="发布时间"></el-table-column>
    <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button
                       type="primary"
                       icon="el-icon-edit"
                       circle
                       size="mini"
                       @click="$router.push('/article?id='+scope.row.id)"
                       ></el-button>
            <el-button
                       type="danger"
                       icon="el-icon-delete"
                       circle
                       size="mini"
                       @click="onDeleteArticle(scope.row.id.toString())"
                       ></el-button>
        </template>
    </el-table-column>
</el-table>
```

### 6.3 弹出层

- title：标题提示
- visible：是否展示弹出层
- width：弹出层宽度，百分数

```html
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
```

### 6.4 elementui文件上传

- action：上传地址
- headers：请求头
- multiple：是否支持多文件
- data：需要传的参数
- name：上传文件的字段
- on-success：上传成功的钩子，有两个参数，第一个是res返回的数据，第二个是文件，可以获取文件对象
- on-error：上传失败的钩子

```html
<el-upload
	class="avatar-uploader"
    action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
    :show-file-list="false"
    :headers="{ Authorization: 'Bearer ' + token }"
    :on-success="handleAvatarSuccess"
    name="image">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
```

### 6.5 Layout 布局（栅格布局）

row：

- gutter：栅格间隔
- justify：水平排列方式
- align：垂直排列方式
- tag：自定义标签名称

col：

- span：栅格列数，默认24，1列
- xs：`<768px` 响应式栅格数或者栅格属性对象
- sm：`≥768px` 响应式栅格数或者栅格属性对象
- md：`≥992px` 响应式栅格数或者栅格属性对象
- lg：`≥1200px` 响应式栅格数或者栅格属性对象
- xl：`≥1920px` 响应式栅格数或者栅格属性对象
- tag：自定义标签名称

```html
<el-row :gutter="40" class="item">
    <el-col
		v-for="image in imageList"
        :key="image.id"
        :xs="12"
        :sm="6"
        :md="6"
        :lg="6"
        :xl="6"
        class="col">
        <el-image
            style="width: 150px; height: 150px"
            :src="image.url"
            @click="selectImage(image)">
        </el-image>
        <img src="@/assets/selected.png" class="selected" v-if="image.isSelected"/>
    </el-col>
</el-row>
```

### 6.6 分页

属性：

- page-size：每页显示数据条数
- total：总数据条数
- current-page：当前页
- layout：分页小组件分布
- background：是否有背景

事件：

- current-change：当前页码改变时触发，支持` .sync`修饰符
- size-change：每页条数改变时触发，支持` .sync`修饰符
- prev-click：点击前一页触发
- next-click：点击后一页触发

```html
<el-pagination
	@size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="comment.page"
    :page-sizes="pageSelect"
    :page-size.sync="comment.per_page"
    layout="total, sizes, prev, pager, next, jumper"
    :total="articleTotal">
</el-pagination>
```







# 二、头像裁剪功能

链接地址：https://blog.csdn.net/qq_41107231/article/details/109725839

## 1. 安装

官网地址：https://github.com/xyxiao001/vue-cropper

```shell
npm install vue-cropper
```

## 2. 注册组件

```js
import { VueCropper }  from 'vue-cropper' 
```

## 3. 使用

```vue
<template>
  <div class="cropper-content">
    <div class="cropper-box">
      <div class="cropper">
        <vue-cropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :full="option.full"
            :fixedBox="option.fixedBox"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :centerBox="option.centerBox"
            :height="option.height"
            :infoTrue="option.infoTrue"
            :maxImgSize="option.maxImgSize"
            :enlarge="option.enlarge"
            :mode="option.mode"
            @realTime="realTime"
            @imgLoad="imgLoad">
        </vue-cropper>
      </div>
      <!--底部操作工具按钮-->
      <div class="footer-btn">
        <div class="scope-btn">
          <label class="btn" for="uploads">选择封面</label>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)">
          <el-button size="mini" type="danger" plain icon="el-icon-zoom-in" @click="changeScale(1)">放大</el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-zoom-out" @click="changeScale(-1)">缩小</el-button>
          <el-button size="mini" type="danger" plain @click="rotateLeft">↺ 左旋转</el-button>
          <el-button size="mini" type="danger" plain @click="rotateRight">↻ 右旋转</el-button>
        </div>
        <div class="upload-btn">
          <el-button size="mini" type="success" @click="uploadImg('blob')">上传封面 <i class="el-icon-upload"></i></el-button>
        </div>
      </div>
    </div>
    <!--预览效果图-->
    <div class="show-preview">
      <div :style="previews.div" class="preview">
        <img :src="previews.url" :style="previews.img">
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return {
            option:{
                img: '',             //裁剪图片的地址
                outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
                outputType: 'png',  //裁剪生成图片的格式（jpeg || png || webp）
                info: true,          //图片大小信息
                canScale: true,      //图片是否允许滚轮缩放
                autoCrop: true,      //是否默认生成截图框
                autoCropWidth: 100,  //默认生成截图框宽度
                autoCropHeight: 100, //默认生成截图框高度
                fixed: true,         //是否开启截图框宽高固定比例
                fixedNumber: [1, 1], //截图框的宽高比例
                full: false,         //false按原比例裁切图片，不失真
                fixedBox: true,      //固定截图框大小，不允许改变
                canMove: false,      //上传图片是否可以移动
                canMoveBox: true,    //截图框能否拖动
                original: false,     //上传图片按照原始比例渲染
                centerBox: true,    //截图框是否被限制在图片里面
                height: true,        //是否按照设备的dpr 输出等比例图片
                infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
                maxImgSize: 3000,    //限制图片最大宽度和高度
                enlarge: 1,          //图片根据截图框输出比例倍数
                mode: '100%'  //图片默认渲染方式
            }
        }
    },
    methods: {
        //初始化函数
        imgLoad (msg) {
          console.log("工具初始化函数====="+msg)
        },
        //图片缩放
        changeScale (num) {
          num = num || 1
          this.$refs.cropper.changeScale(num)
        },
        //向左旋转
        rotateLeft () {
          this.$refs.cropper.rotateLeft()
        },
        //向右旋转
        rotateRight () {
          this.$refs.cropper.rotateRight()
        },
        //实时预览函数
        realTime (data) {
          this.previews = data
        },
        //选择图片
        selectImg (e) {
          let file = e.target.files[0]
          if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
            this.$message({
              message: '图片类型要求：jpeg、jpg、png',
              type: "error"
            });
            return false
          }
          //转化为blob
          let reader = new FileReader()
          reader.onload = (e) => {
            let data
            if (typeof e.target.result === 'object') {
              data = window.URL.createObjectURL(new Blob([e.target.result]))
            } else {
              data = e.target.result
            }
            this.option.img = data
          }
          //转化为base64
          reader.readAsDataURL(file)
        },
        // 图片上传
        uploadImg() {
          // 调用组件的getCropBlob方法
          this.$refs.cropper.getCropBlob(file => {
            // console.log(file)
            let fs = new FormData()
            // 这里字段名称是photo
            fs.append('photo', file)
            // console.log(fs)
            setUserAvater(fs).then(res => {
              // console.log(res)
              this.setForm.photo = res.data.data.photo
              // 用过中央时间总线将得到的头像链接传给layout组件
              bus.$emit('undate-user', this.setForm)
              this.$message({
                type: 'success',
                message: '头像更新成功'
              })
            })
          })
        }
    }
}
</script>
```

上传：调用组件的getCropBlob方法，接收一个参数（文件对象），转换成FormData对象，发送ajax请求。











# 三、json-bigint的使用

通过axios得到的数据都是通过axios处理过的，axios内部会通过 `JSON.parse()` 将返回的数据转化为json对象, a但xios处理的数字超过 `js最大安全数字` 时，返回的数字就会不准确，此时，就需要用第三方插件 `json-bigint` 来处理

## 1. 安装

```shell
npm i json-bigint
```

## 2. 在axios中的配置

axios提供了一个API，`transformResponse` 可以直接来配置响应数据的格式

```js
import JSONbig from 'json-bigint'
// 创建一个axios实例，就是复制一个axios实例，对这个实例进行配置,这样做的好处是可以同时配置多个axios，之间互不影响
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/',
  // 定义后端返回的数据的处理
  // data是后端返回的原始数据，未经任何处理
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    try {
        // 作用1：将后台返回的json字符串转成js对象
        // 作用2：对大数字进行安全处理
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
```

# 四、接口文档描述

## axios接口参数介绍

```js
axios({
    method: 'post', // mothod请求方法，常见的有GET(一般用于数据查询),POST(一般用于数据添加),DELETE(一般用于数据删除),PUT(一般用于数据修改，完全替换),PATCH(一般用于数据修改，局部替换)
    url: '', // 请求路径
    //请求参数
    headers:{ //请求头
        '参数名称': '参数值'
        'Content-type': 'application/json' // axios默认的Content-type
    },
    params: {}, // 查询参数(query)
    data: {}, // 请求体(body)  
})
// 路径参数(动态路径) '/mp/v1_0/articles/:target' 
```

# 五、文件对象

一般的文件上传，都是把用户选中的文件对象放到FormData中提交给后端

### 1. 获取文件对象

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>文件上传</title>
</head>
<body>
    <input type="file" id="file">
    <button onclick="getFileObject()">点击获取文件对象</button>
</body>
<script>
    function getFileObject(){
        let file = document.querySelector('#file');
        console.log(file.files) // FileList {0: File, length: 1}
    }
</script>
</html>
```

### 2. 文件可多选

input表单加上 `multiple` 属性，可以同时选择多个文件

### 3. 如果上传的是图片，上传之后需要立即预览时

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>文件上传</title>
</head>
<body>
    <input type="file" id="file" multiple>
    <button onclick="getFileObject()">点击获取文件对象</button>
    <img src="" alt="" id="img">
</body>
<script>
    function getFileObject(){
        let file = document.querySelector('#file');
        console.log(file.files) // FileList {0: File, length: 1}
		// 获取url
        let blob = window.URL.createObjectURL(file.files[0])
        document.querySelector('#img').src = blob
    }
</script>
</html>
```

### 4. 将文件提交给后端

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>文件上传</title>
</head>
<body>
    <input type="file" id="file" multiple>
    <button onclick="getFileObject()">点击获取文件对象</button>
    <img src="" alt="" id="img">
</body>
<script>
    function getFileObject(){
        let file = document.querySelector('#file');
        console.log(file.files) // FileList {0: File, length: 1}
        let blob = window.URL.createObjectURL(file.files[0])
        document.querySelector('#img').src = blob;
        // 将文件提交给后端，需要将文件对象放到FormData中
        let fs = new FormData()
        fs.append('后端字段', file.files[0])
        // 然后将fs传给后端
    }
</script>
</html>
```

# 六、ref 有两个作用

- 作用在标签元素上，可以直接获取到DOM节点

  ```js
  this.$refs['ref的值']
  ```

- 作用在组件上，可以直接得到这个组件，并且可以访问组件中的数据和方法

  ```js
  let comp = this.$refs['ref的值']
  // 可以直接访问组件中的数据
  ```


# 七、echarts

## 1. 安装

```shell
npm install echarts --save
```

## 2. 引用

```js
import * as echarts from 'echarts'
```

## 3. 使用

```vue
<template>
    <div>
        <!-- 1. 首先需要有一个具备大小的实例 -->
        <div ref="Echarts_1" id="Echarts"></div>
    </div>
</template>
<script>
// 2. 引包
import * as echarts from 'echarts'
export default {
    data(){
        return {
            
        }
    },
    methods: {
        loadEcharts(){
        	// 3. 初始化echarts实例
        	let myChart = echarts.init(this.$refs.Echarts_1)
        	// 4. 数据
        	let option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                      color: 'rgba(180, 180, 180, 0.2)'
                    }
                }]
			}
            // 5. 调用
            myChart.setOption(option)
        }
    }
}
</script>
```



# vue-table-with-tree-grid文档及用法

https://blog.csdn.net/Sky_fy_1314/article/details/107383695

github：https://github.com/MisterTaki/vue-table-with-tree-grid

