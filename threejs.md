# threejs

中文网站：http://www.webgl3d.cn/

资源包：https://github.com/mrdoob/three.js/releases

##  一、引入

### 1. cdn

```html
<script src="./threejs/build/three.js"></script>
```

### 2. es6 module

```html
<script type="module">
  import * as THREE from './threejs/build/three.module.js'
  console.log(THREE)
</script>
```

### 3.  type="importmap"配置路径

```html
<script type="importmap">
  {
    "imports": {
      "three": "./threejs/build/three.module.js"
    }
  }
</script>
<script type="module">
  import * as THREE from 'three'
  console.log(THREE)
</script>
```

## 二、实现一个小demo

### 1. 场景

```html
<script type="importmap">
  {
    "imports": {
      "three": "./threejs/build/three.module.js",
      "OrbitControls": "./threejs/examples/jsm/controls/OrbitControls.js"  // threejs扩展控件
    }
  }
</script>
<script type="module">
  import * as THREE from 'three'

  // 创建一个三维场景
  const scene = new THREE.Scene()

  // 定义一个长方体
  const geomery = new THREE.BoxGeometry(100, 100, 100)

  // 创建一个材质
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

  // 创建一个网格模型，用来表示生活中的物体
  const mesh = new THREE.Mesh(geomery, material)
  // 定义网格模型坐标
  mesh.position.set(0, 10, 0)

  // 将模型添加到场景中
  scene.add(mesh)
</script>
```

### 2. 相机

```js
// 创建一个透视投影相机对象
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000)
// 设置相机的位置
camera.position.set(100, 200, 200)
// 设置相机的视线   即观察点的坐标
// camera.lookAt(0, 0, 0)
camera.lookAt(mesh.position)
```

**注意：观察点总是会在坐标的canvas的中心位置**

### 3. 渲染器

```js
// 创建一个webgl渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true   // 抗锯齿
})
// renderer.antialias = true     // 抗锯齿
renderer.setPixelRatio(window.devicePixelRatio)   // 告诉threejs当前屏幕的像素比
renderer.setClearColor(0x999999)   // 设置背景颜色
// 设置渲染区域尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 执行render方法
renderer.render(scene, camera)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {
    renderer.render(scene, camera)
})
```

## 三、three的三维坐标轴

```js
// 创建一个坐标系
const axesHelper = new THREE.AxesHelper(500)
// 将坐标系添加到场景中
scene.add(axesHelper)
```

## 四、光源

### 1. 点光源

#### 1.1 创建一个点光源

```js
// 创建一个光源对象
const pointLight = new THREE.PointLight(0xff00ff, 1000000000000)
// 设置光源的位置
pointLight.position.set(0, 0, 0)
// 将光源添加到场景中
scene.add(pointLight)
```

#### 1.2 点光源可视化

```js
// 可视化点光源
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
scene.add(pointLightHelper)
```

### 2. 环境光

```js
const light = new THREE.AmbientLight(0x404040, 100); // 柔和的白光
scene.add(light);
```

### 3. 平行光

#### 3.1.  创建一个平行光

默认目标坐标(0,0,0)

```js
// 创建一个平行光
const directionalLight = new THREE.DirectionalLight(0xff00ff, 100000);
directionalLight.position.set(-500, -500, -500)
// directionalLight.target = mesh2
scene.add(directionalLight);
```

#### 3.2 平行光可视化

```js
// 平行光可视化
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10)
scene.add(directionalLightHelper)
```





## 五、控件

### 1. OrbitControls

```html
<script type="importmap">
  {
    "imports": {
      "three": "./threejs/build/three.module.js",
      "OrbitControls": "./threejs/examples/jsm/controls/OrbitControls.js"
    }
  }
</script>
<script type="module">
    // 引入控件
    import { OrbitControls } from 'OrbitControls'
	// 创建一个控件，并将相机和canvas元素以参数形式传入
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // 修改相机观察点
    controls.target.set(-100, 100, 30)
    // 修改相机视线
    controls.update()
    
    // 监听控件的change事件，改变相机位置的同时重新渲染画布
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })
</script>
```

### 2. Stats

```HTML
<script type="importmap">
  {
    "imports": {
      "three": "./threejs/build/three.module.js",
      "stats": "./threejs/examples/jsm/libs/stats.module.js"
    }
  }
</script>
<script type="module">
    import * as THREE from 'three'
    import Stats from 'stats'
    // 创建stats对象
    const stats = new Stats()
    stats.setMode(2)  // 设置模式
    document.body.appendChild(stats.domElement)
    function render() {
        stats.update()  // 刷新时间
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
  render()
</script>
```



## 六、动画

动画api：window.requestAnimationFrame

https://zhuanlan.zhihu.com/p/656701597

```js
function render() {
    mesh2.rotateY(0.05)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
render()
```

时间追踪

clock：http://www.yanhuangxueyuan.com/threejs/docs/index.html?q=clock#api/zh/core/Clock



## 七、几何体

顶点位置数据







## 八、材质







## gui.js库

### 常用方法

创建一个Gui实例对象

```js
import Gui from 'guijs';
const guijs = new Gui();
```

#### 1. add

```js
import Gui from 'guijs';
const guijs = new Gui();

guijs.add({ left: 0 }, 'left', 0, 500)  // 创建一个范围值
guijs.addColor({ color: 0x00ff00 }, 'color')   // 创建一个颜色选择器
guijs.add({ boolean: false }, 'boolean')  // 创建一个选择框
position.add({ top: 0 }, 'top', [0, 200, 400])  // 创建一个下拉菜单
position.add({ top: 0 }, 'top', {
    top: 0,
    center:200,
    bottom: 400
})  // 创建一个下拉菜单
```

#### 2. name

```js
import Gui from 'guijs';
const guijs = new Gui();

guijs.add({ left: 0 }, 'left', 0, 500).name('111')  //命名
```

#### 3. onChange

变量改变的事件

```js
import Gui from 'guijs';
const guijs = new Gui();

guijs.onChange(e => {
    
})
```

#### 4. addFolder

创建一个分组（可以嵌套）

```js
import Gui from 'guijs';
const guijs = new Gui();

let position = guijs.addFolder('位置')
position.add({ left: 0 }, 'left', 0, 500).name('111')
position.add({ top: 0 }, 'top', 0, 500).step(1)
```

#### 5. step

步长

```js
import Gui from 'guijs';
const guijs = new Gui();

guijs.add({ top: 0 }, 'top', 0, 500).step(1)
```

#### 6. addColor

添加颜色选择器

```js
import Gui from 'guijs';
const guijs = new Gui();

guijs.add({ color: 0xffffff }, 'color')
```







