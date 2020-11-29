# 学习笔记

### Proxy

JavaScript中的Proxy用于给目标对象定义一个与之关联的代理对象，这个代理对象可以作为抽象的目标对象来使用。
Vue双向绑定及时通过 Proxy 实现了一个 observer

### reactive
实现了简单的 reactive
通过effect函数对需要记录下每个callback和其关联的属性的映射关系.
通过Proxy.handler.set 在对应属性更新的时候执行与其关联的callback

### Range 
一个包含节点与文本节点的一部分的文档片段。

找到最近的一个range，然后将 dragable 插入进去
