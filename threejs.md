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

### 3. 渲染器

```js
// 创建一个webgl渲染器
const renderer = new THREE.WebGLRenderer()
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





