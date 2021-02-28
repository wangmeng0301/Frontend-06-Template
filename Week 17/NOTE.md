# 学习笔记

## yeoman 

通过 prompt 去进行一些提问，让用户自己输入相关的内容 如：packjson 里面的name

通过 npmInstall 去安装一些基本的依赖 

通过 copyTpl 可以将制定的文件拷贝到相应的目录下，还可以设置title之类的参数

## webpack

因为最初是给node设计的 所以不能依据html进行打包，只能将打包后的js引入到html文件中

通过 loader 和 plugin ，来控制合并规则和文本转换。

webpack.config.js
  entry: 入口文件
  rules.loader: 对特定文件格式用响应 loader 进行解析
  plugins: 独立的功能

## npx - 用来解决全局命令行工具只能有一个的问题
npm 从5.2版开始，增加了 npx 命令

npx的作用如下：

1.默认情况下，首先检查路径中是否存在要执行的包（即在项目中）
2.如果存在，它将执行
3.若不存在，意味着尚未安装该软件包，npx将安装其最新版本，然后执行它；

## npm link
首先，npm link 在包文件夹中，将在全局文件夹{prefix}/lib/node_modules/<package>中创建一个符号链接，该 链接链接到 npm link 执行命令的包。（请参阅 ` npm config
以获取的值 prefix）。它还会将包装中的所有垃圾箱链接到{prefix}/bin/{name}`。

接下来，在其他位置，npm link package-name 将创建一个从全局安装 package-name 到 node_modules/ 当前文件夹的符号链接。

我们就可以直接用 yo <package-name> 去进行一个 generator 

