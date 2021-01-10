# 学习笔记

## css 总体结构

@charset
@import
rules 
  @media
  @page
  rule

## 简单选择器

### *通用选择器
  div svg|a 类型选择器
  .cls
  #id
  [attr=value]
  :hover
  ::before
### 复合选择器

<简单选择器><简单选择器><简单选择器> :与关系
或者 div 必须写在最前面 :伪元素最后
### 复杂选择器

<复合选择器><复合选择器> :加空格,表达子孙
<复合选择器>">"<复合选择器> :直接子孙
<复合选择器>"~"<复合选择器> :邻居
<复合选择器>"+"<复合选择器> :
<复合选择器>"||"<复合选择器> :表字段 逗号是或关系

### 伪类
链接/行为
:any-link
:link :visited
:hover
:active
:focus
:target
树结构
:empty （是否有子元素）
:nth-child()
:nth-last-child()
:first-child :last-child :only-child
逻辑型
:not伪类
:where :has

### 伪元素

::before（在元素的内容前插入伪元素）
::after（在元素的内容后插入伪元素）
::first-line（选中第一行）
可用属性：font/color/background/word-spacing/letter-spacing/text-decoration/text-transform/line-height
::first-letter（选中第一个字母，用一个不存在的元素把一部分文本括起来进行处理）
可用属性：font/color/background/text-decoration/text-transform/letter-spacing/word-spacing/line-height/float/vertical-align/盒模型系列：margin, padding,border

## css 标准收集
``` js
Array.prototype.slice.call(document.querySelector('#container').children).filter(e => e.getAttribute('data-tag').match(
			/css/)).map(e => ({
			name: e.children[1].innerText,
			url: e.children[1].children[0].href
		}));
```

## 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

first-letter： 一开始就可以确定, 操作布局时性能开销小
first-line： 得等到布局(layout)完成即计算出每个节点的位置之后才能确定, 要对其重新布局排版消耗性能大. 考虑到性能开销，而且 float 会让元素脱离文档流，然后文档流内的内容会选出新的第一行，这个新的第一行又会被 ::first-line 选中，然后 float 使其脱离文档流。最后会一直循环下去，直到文档流没有文字。