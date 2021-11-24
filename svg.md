<center><h1>svg</h1></center>

`svg` 是一种基于XML语法的图像格式，全称是可缩放矢量图( Scalable vector Graphics )。其他图像格式都是基于像素处理的，SVG则是属于对图像的形状描述，所以它本质上是文本文件，体积较小，且不管放大多少倍都不会失真。
SVG文件可以直接插入网页，成为DOM的一部分，然后用JavaScript和CSS进行操作。



## 1. 圆

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <circle cx="60" cy="60" r="50" fill="transparent" stroke="red" stroke-width="4" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <circle style="r: 30; cx: 20; cy: 20; fill:red; stroke: #777; stroke-width: 10" />
</svg>
```

- 标签：circle

- 属性：
  - cx：x轴位置
  - cy：y轴位置
  - r：半径
  - fill：填充颜色
  - stroke：边框颜色
  - stroke-width：边框宽度

## 2. 直线

```html
<svg>
    <line x1="50" y1="50" x2="250" y2="250" stroke="red" stroke-width="4"></line>
</svg>
```

- 标签：line
- 属性：
  - x1：第一个点的横坐标
  - y1：第一个点的纵坐标
  - x2：第二个点的横坐标
  - y2：第二个点的纵坐标
  - stroke：线的颜色
  - stroke-width：线的宽度

## 3. 折线

```html
<svg>
    <polyline points="20, 20 40, 60, 30, 70" stroke="red" stroke-width="4" fill="none" />
</svg>
```

- 标签：polyline

- 属性：
  - points：点坐标，坐标用 `,` 隔开，点与点之间用 `空格` 隔开
  - stroke：线的颜色， 默认透明
  - stroke-width：线的宽度， 默认1px
  - fill：填充颜色，默认黑色

## 4. 矩形

```html
<svg width="300" height="300">
    <rect x="50" y="60" width="560" height="100" fill="none" style="stroke: red;stroke-width: 10" />
</svg>
```

- 标签：rect
- 属性：
  - x：左上角横坐标
  - y：左上角纵坐标
  - width：宽度
  - height：高度
  - stroke：线的颜色， 默认透明
  - stroke-width：线的宽度， 默认1px
  - fill：填充颜色，默认黑色

## 5. 椭圆

```html
<svg width="250" height="250">
    <ellipse cx="125" cy="125" rx="100" ry="50" stroke="red"></ellipse>
</svg>
```

- 标签：ellipse
- 属性：
  - cx：圆心横坐标
  - cy：圆心纵坐标
  - rx：水平半径
  - ry：垂直半径
  - stroke：线的颜色， 默认透明
  - stroke-width：线的宽度， 默认1px
  - fill：填充颜色，默认黑色

## 6. 多边形

```html
<svg>
    <polygon points="20, 30 60, 50 10, 40" stroke="red" fill="none"></polygon>
</svg>
```

- 标签：polygon
- 属性：
  - points：点
  - stroke：线的颜色， 默认透明
  - stroke-width：线的宽度， 默认1px
  - fill：填充颜色，默认黑色

## 7. 路径



- 标签：path
- 属性：
  - d：点
    - M：起始点
    - L：中间点
    - Z：结束点，是否连接
  - stroke：线的颜色， 默认透明
  - stroke-width：线的宽度， 默认1px
  - fill：填充颜色，默认黑色

## 8. 文本

```html
<text x="20" y="30" fill="red">
    <textPath xlink:href="#path1">
        helloworldhelloworldhelloworldhelloworld
    </textPath>
</text>
```



- 标签：text
- 属性：
  - x：横坐标
  - y：纵坐标
  - fill：字体颜色，默认黑色

