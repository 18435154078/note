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

- background：设置环境背景，值是一个环境纹理对象
- environment：设置全局环境贴图，值是一个环境纹理对象



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

### 7.1 构建一个平面矩形

```js
const scene = new THREE.Scene()
  const geometry = new THREE.BufferGeometry()  // 创建一个空的几何体

  // 用类型数组创建顶点数据
  let a = new Float32Array([
    0, 0, 0,
    10, 0, 0,
    10, 10, 0,
    0, 10, 0,
    0, 0, 0,
    10, 10, 0
  ])
  // 创建属性缓冲对象
  const attribute = new THREE.BufferAttribute(a, 3)

  // 设置几何体的顶点位置属性
  geometry.attributes.position = attribute

  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
```

### 7.2 几何定点的索引数据

```js
const scene = new THREE.Scene()
  const geometry = new THREE.BufferGeometry()  // 创建一个空的几何体

  // 用类型数组创建顶点数据
  let a = new Float32Array([
    0, 0, 0,
    10, 0, 0,
    10, 10, 0,
    0, 10, 0,
    // 0, 0, 0,
    // 10, 10, 0
  ])

  // 用几何体索引定义顶点数据
  const indexes = new Uint16Array([
    0, 1, 2,
    3, 0, 2
  ])

  // 设置几何体的索引
  geometry.index = new THREE.BufferAttribute(indexes, 1)

  // 创建属性缓冲对象
  const attribute = new THREE.BufferAttribute(a, 3)

  // 设置几何体的顶点位置属性
  geometry.attributes.position = attribute
  console.log(geometry)


  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    wireframe: true // 开启线框
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
```

### 7.3 定点法线数据

```js
// 创建法向量定点
const normals = new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
])
geometry.attributes.normal = new THREE.BufferAttribute(normals, 3)
```









## 八、材质

- 基础网格材质  LineBasicMaterial

  相关属性

  - color
  - map

- 漫反射材质   MeshLambertMaterial

  相关属性

  - emissiveIntensity：放射光强度   0-1

- 高光网格材质   MeshPhongMaterial

  相关属性

  - shininess：高亮的程度，默认值为 **30**

- 标准网格材质   MeshStandardMaterial

  相关属性：

  - 金属度：metalness     0-1

  - 粗糙度：roughness    0-1

  - 环境贴图：envMap    立方体纹理对象

  - 环境贴图影响：envMapIntensity    默认1

- 物理网格材质

  相关属性：

  - 金属度：metalness     0-1

  - 粗糙度：roughness    0-1

  - clearcoat：清漆层属性
  - clearcoatRoughness：清漆层粗糙度
  - transmission：透光度  0-1，和transparent，opacity配合使用
  - reflectivity：反射率   0-1 默认为**0.5**, 相当于折射率1.5。
  - ior：折射率   范围由**1.0**到**2.333**。默认为**1.5**。







## 九、模型

### 1. 网格模型

```js
// 创建一个网格模型，用来表示生活中的物体
const mesh = new THREE.Mesh(geomery, material)
// 定义网格模型坐标
mesh.position.set(0, 10, 0)
scene.add(mesh)
```

### 2. 点模型

```js
const material = new THREE.PointsMaterial({
  color: 0xff0000,
  size: 2
})
```

### 3. 线模型

```js
const material = new THREE.Line({   // 一条连续的线
    color: 0xff0000
})
const material = new THREE.LineLoop({  // 一条头尾相接的连续的线
    color: 0xff0000
})
const material = new THREE.LineBasicMaterial({  // 在若干对的顶点之间绘制的一系列的线（线段）
    color: 0xff0000
})
```



## 十、方法

### 1. 旋转、平移，缩放

- 平移实质修改了模型的**position**属性
- 缩放实质修改了模型的**scale**属性
- 旋转实质修改了模型的**rotation**属性

### 2. 克隆

clone()

### 3. 复制

copy()

### 4. 移除

remove()







## 十一、分组

组对象`Group` 或 `Object3D`



## 十二、加载器

### 1 纹理加载器

#### 1.1 表面贴图（TextureLoader）

```js
// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
// 创建纹理对象
const texture = textureLoader.load('./assets/di.jpg')
// 允许纹理对象阵列
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
// 设置纹理对象阵列
texture.repeat.set(10, 10);

// texture.offset.set(.1, .1)  //设置纹理贴图的偏移量，本质上是修改了纹理对象的UV坐标

const material = new THREE.LineBasicMaterial({
    map: texture  // 贴图
})
```

#### 1.2 环境贴图（CubeTextureLoader）

```js
const textureCude = new THREE.CubeTextureLoader()
    .setPath('assets/环境贴图/环境贴图1/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])

//  给场景设置背景
const scene = new THREE.Scene()
scene.background = textureCude


// 实例化加载器
const loader = new ，GLTFLoader()
// 加载模型
loader.load('./assets/金属.glb', (gltf) => {
    gltf.scene.traverse(item => {
        if (item.isMesh) {
            item.material.envMap = textureCude  // 给材质设置纹理贴图
        }
    })
    scene.add(gltf.scene)
})
```

### 2. 模型加载器

```js
const loader = new ，GLTFLoader()
// 加载模型
loader.load('./assets/金属.glb', (gltf) => {
    gltf.scene.traverse(item => {
        // item就是加载数来的模型对象
    })
    scene.add(gltf.scene)
}, res => {
    // 加载过程中触发的事件
    console.log(res.loaded / res.total)  // 加载百分比
  })
```







## 十三、坐标

本地坐标

模型本身的position

 

世界坐标（getWorldPosition）

模型本身的position + 所有父级坐标





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







