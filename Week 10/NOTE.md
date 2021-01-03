学习笔记


## CSS 三代排版技术：

正常流
position
display
float
...
Flex
Grid
Houdini
## 默认关键参数处理

flex-direction
flex-wrap
align-items
justify-content
justify-items
## 统一处理逻辑，在不同的参数下一致的处理流程

## 收集元素进行(hang)

flex-wrap
no-wrap,同一行
auto，分行
## 计算主轴

找出所有Flex元素
把主轴方向剩余的尺寸按比例分配给这些元素
若剩余空间为负数，所有的flex元素为0,等比压缩元素
## 计算副交叉轴

根据每一行中最大元素尺寸计算行高
根据行高flex-align和item-align,确定元素具体位置
## 绘制DOM树
### 绘制第一步
绘制需要依赖一个图形环境
采用了 npm 包 images
绘制再一个 viewport 上进行
与绘制相关的属性：backgroun-color border background-image等

### 绘制第二步
递归调用子元素的绘制方法完成Dom树的绘制
忽略一些不需要绘制的节点
实际浏览器中，文字绘制是难点，需要依赖字体库，在此忽略
实际浏览器中，会对图层做一些 compositiong 这里也忽略了
