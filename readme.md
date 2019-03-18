## 打包流程

## webpack 概念 https://www.webpackjs.com/concepts/
>    本质上，webpack是一个现代JavaScript应用程序的静态模块打包器（module bundler）。当 webpack 处理应用程序时，会递归地构建一个依赖关系图（dependency graph），其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle。
> 核心概念
    * entry 入口
        入口起点（enter point）指示 webpack 应该使用哪个模块作为构建内部 依赖图 的开始。
    * output 出口
        output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。
    * loader（装载机 载入器）
        loader 让 webpack 能够去处理那些 非JavaScript文件 （webpack 自身只理解 JavaScript）
    * plugins 插件
        插件用于执行范围更广的任务。（从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以处理各种各样的任务。）

## 初始化 
    npm init -y

## yarn 安装 (与 npm 任选其一 但不可混用 )
    npm install yarn -g

## webpack 安装（安装本地的 webpack 是 node 写出来的）
    yarn add webpack webpack-cli -D 或
    npm install webpack webpack-cli -D
    (-D 表示 development 开发环境)

## webpack 可以进行 0 配置
- 新建名为 src 的文件夹
- 在该文件夹下新建名为 index.js 的文件
- 直接运行 npx webpack
    此时会出现 yarn.lock 文件和 dist文件夹（该文件夹下有main.js文件）

## 配置脚本 在package.json 的 "scripts" 属性中配置
- "build":"webpack --config webpack.config.js"
    (写--config可以修改配置文件名 否则不行 默认为 webpack.config.js/webpackfile.js 通常用第一个)
    --config 指定默认文件是哪个
    新建 webpack.config.js 文件
    在 dist 文件夹中新建 index.html 文件 引入 main.js
    运行 npm run build
- "dev":"webpack-dev-server"
- "start":"npm run dev"
- 这样可以通过 npm run build(一般用于生产环境)/dev(一般在开发环境使用) 执行相关命令

## 手动配置 webpack （在webpack.config.js中配置）
- mode 模式环境 可以不写 会有警告
    一般有 development（开发环境）和 production（生产环境 会压缩）默认为 生产环境
- entry 入口 可以写相对路径
- output 出口 
    - path 输出路径 必须写绝对路径（会用到node的核心模块path路径模块）
    - filename 输出文件名 
- 配置完 会出现dist文件夹 其下会出现filename设置的名字的文件（同 main.js 之前的dist文件可以不要了）
- 下载 webpack-dev-server
    yarn add webpack-dev-server -D
- 配置 devServer （可以不配置 webpack 默认 是 8080 端口）
```
    devServer:{
        port:3000, # 端口号
        progress:true, # 显示进度条
        contentBase:'./dist', # 基本目录 （会自动检测到目录 运行）
        compress:true, # 是否开启gzip压缩
        open:true, # s是否自动打开浏览器
        proxy:{}, # 可以配置跨域
        before(app){} # 可以虚拟数据
    }
    - 现在可以运行 npm run dev 了 打开设置的端口的网页 自动刷新
    # dist 文件夹下要有 html
```

## 处理 html （在生产环境中会压缩js 但是不会压缩html）
- 下载 html-webpack-plugin 插件 
    yarn add html-webpack-plugin -D
- 删除 dist 文件 新建一个index.html(不需要引入js)
- 在 src 新建一个index.html
- 在配置文件引入
- 配置 plugins （数组）
    new 插件名({})
    - template:'./src/index.html' # 模板
    - filename:'index.html' # 编译后的名字
    - hash:true # 加hash值 可以解决缓存问题（?后的字符）
    - minify # 压缩配置
        - removeAttributeQuotes:true # 去除双引号
        - collapseWhitespace:true # 折叠 去空格
        - 运行 npm run build 

## 直接给文件加 hash
- filename:'bundle[hash].js'
- 可以使用数字设置 hash值的长度
    - filename:'bundle[hash:6].js'

## 处理样式 
- 首先在src文件夹下新建一个index.css文件
- 然后在 index.js 中 require 引入
  会报一个错误 
  You may need an appropriate loader to handle this file type.
  你可能需要一个合适的 loader 
  因为 webpack 默认只支持 js 文件
    
- 这时就需要配置 module 
- 需要下载对应的包
- yarn add css-loader style-loader -D
- 在 module 对象内配置 rules 数组（表示一系列规则）
    - test:/.css$/ 表示匹配的文件后缀（用正则匹配）
    - use  执行顺序 从右向左 从下向上
        - use:'css-loader' 字符串 只能写一个loader
        - use:['style-loader','css-loader'] 可以写多个
        - use:[{
            loader:'style-loader',
            options:{
                inserAt:'top' # css 放置位置 可以绝对css的优先级
            }
        }]
- 配置其它包的命令
- less
    yarn add less less-loader -D
- sass
    yarn add node-sass sass-loader -D
- stylus
    yarn add stylus stylus-loader -D
- 这种方式 会在html添加多个 style 标签，因此可以通过抽离 css 把样式放在一个文件中 用link的方式引入到HTML中。

## 抽离 css
- 下载 mini-css-extract-plugin 插件
    - yarn add mini-css-extract-plugin -D
- 在配置文件require引入
- 在plugin中配置
    new MiniCssExtractPlugin({
        filename:"main.css"
    })
- 用 MiniCssExtractPlugin.loader 代替 style-loader
    MiniCssExtractPlugin 自带一个 loader，会自动把 css 抽离出来。

## 使用 postcss 添加浏览器前缀
- 下载 postcss-loader 和 autoprefixer (prefixer 加前缀) 两个一定要配合使用
    yarn add postcss-loader autoprefixer -D
    放在所有 cssloader 后面 （执行顺序原因）
- 此时直接 npm run dev 会报错
    Error: No PostCSS Config found in: D:\shixiaoqian\vue笔记\my_webpack\src
    没有找到 postCSS 的默认文件
- 在根目录下创建 postcss.config.js 文件
    配置 postcss 的默认文件 名为 postcss.config.js
```
    module.exports={
        plugins:[require('autoprefixer')]
    }
```

## 配置优化项 （css、js压缩）
- 下载 optimize-css-assets-webpack-plugin 和 uglifyjs-webpack-plugin 插件
    yarn add optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D
      optimize 优化 assets 资源 uglify 丑陋
- 配置 （在 webpack.config.js 中）
```
    optimization:{
        minimizer:[
            new OptimizeCssAssetsWebpackPlugin({}),
            new UglifyjsWebpackPlugin({
                cache:true, # 缓存
                parallel:true, # 是否并发打包
                sourceMap:true # 源码映射(set to true if you want source maps)
            })
        ]
    }
```
- mode 改为 production
- npm run build 

## 处理 js es6转化为es5
- babel 官网 https://babeljs.io/
- 箭头函数 arrow-functions
- 下载 babel-loader @babel/core @babel/preset-env
    yarn add babel-loader @babel/core @babel/preset-env
    @babel/core # babel 的核心模块
    @babel/preset-env # 标准语法转化成低级语法 （babel低版本写法 babel-preset-env）
- 配置 （wbepack.config.js中的module:{rules:[]}内配置)
```
    {
        test:/\.js$/,
        use:{
            loader:'babel-loader',
            options:{
                presets:["@babel/preset-env"] # 预设
            }
        }
    }
```
- class 和 es6@(装饰器需要安装额外的插件) 并且添加 plugins集合
- 下载 @babel/plugin-proposal-class-properties 和 @babel/plugin-proposal-decorators -D 插件
    yarn add @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators -D
```
    plugins:[
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    ]
    # 与 presets 同级
```
- promise generater(https://www.liaoxuefeng.com) (es6的东西) 需要 @babel/plugin-transform-runtime(常用)
    yarn add @babel/plugin-transform-runtime
    因为生产环境也需要 所以不加 -D
    yarn add @babel/runtime
- 配置需要解析和不需要解析loader 的文件路径
    （如果不配置会报错：Cannot assign to read only property 'exports' of object '#<Object>'） 
```
    use:{
        loader:'babel-loader',
        options:{
            presets:['@babel/preset-env'],
            plugins:[
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                "@babel/plugin-transform-runtime",
                // "@babel/runtime"
            ]
        }
    },
    include:path.resolve(__dirname,'src'),
    exclude:/node_modules/
    # 由于版本问题 可能会报错 找不到 @babel/plugin-runtime 所以去掉其中一个（看去掉哪个不报错）
```

## babel 也可以独立进行配置 
- 在根目录下新建名为 .babelrc 的文件
- 配置时 loader 直接写 use:"babel-loader" 其他配置写在 .babelrc 文件内
- 如果 webpack 直接配置了 babel-loader 就不需要 .babelrc 文件了，如果有就删掉。
```
    {
        "presets":["@babel/preset-env"],
        "plugins":[
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties", { "loose" : true }],
            "@babel/plugin-transform-runtime"
        ]
    }
```

## js 语法校验
- eslint 如果语法不规范 会出现警告（所以一般会注释掉）
    - 官网 https://eslint.org/
- 下载 eslint eslint-loader 
    - yarn add eslint eslint-loader -D
- 配置 （rules内）
```
    {
        test:'/\.js$/',
        loader:'eslint-loader',
        options:{
            enforce:'pre' # 强制先执行 previous 前置loader
        }
    }
```
- 另一种配置方法 .eslint.js
```
    module.exports = {
        代码
    }
```
- .eslint.ignore eslint的忽略项

## 第三方模块的使用
- 下载 jquery
    yarn add jquery
    webpack 存在闭包结构 所以 window.$ 为 undefined
- 下载 expose-loader
    yarn add expose-loader -D
    expose-loader 暴露全局的 loader
1. 内联 loader (在index.js中引入)
```
    # 这样就可以获取到了
    # 但是一般不直接这样写 一般在 webpack.config.js 内配置
    import $ from "expose-loader?$!jquery"
```
2. 正常配置（在webpack.config.js中配置）
```
    {
        test:require.resolve('jquery'),
        use:'expose-loader?$'
    }
```
3. 在每个模块中注入 $ 对象 
- 引入 webpack 模块
    # let webpack = require('webpack')
- 在 plugins 配置
```
    new webpack.ProvidePlugin({
        $:"jquery"
    })
    # ProvidePlugin webpack自带插件（webpack本身也是一个模块 要先引入）
    # 在 index.js 中 不需要引入 但是 window.$ 为 undefined
```

## 配置忽略打包项
- 假如有人在HTML引入jquery的cdn 如果打包会很大 所以要配置忽略打包项
```
    externals:{
        jquery:"jQuery"
    }
    # 与 mode 同级
    # 可 npm run build 查看
```
## 在 webpack 中引入图片的几种方式
1. 在 js 中创建图片来引入 (index.js)
    - 这种方式会在内存里创建一个新的图片
```
    import logo from './goback.png';
    let img = new Image();
    img.src = logo;
    document.body.appendChild(img);
    # 直接运行会报错 
        # You may need an appropriate loader to handle this file type.
        # 你可能需要一个合适的loader来解析这种文件
```
    下载 file-loader
        yarn add file-loader -D
```
    # file (rules里配置)
    {
        test:/\.(jpg|png|gif)$/,
        use:'file-loader'
    }
```
2. 在 css 引入 background:url();
    这种方式也要配置
```
    # file (rules里配置)
    {
        test:/\.(jpg|png|gif)$/,
        use:'file-loader'
    }
```
3. 在 html <img src="" />;
    要下载 html-withimg-loader 
        yarn add html-withimg-loader -D
```
    # (rules里配置)
    {
        test:/\.html$/,
        use:'html-withimg-loader'
    }
```

## 图片处理
- base64
- 在图片非常小的情况下，不希望走http请求，一般情况下不会直接使用
- 在图片小于多少k的情况下，用 base64来转化，base64大小会比原来文件大三分之一
- 下载 url-loader
    yarn add url-loader -D
```
    {
        test:/\.(jpg|png|gif)$/,
        use:{
            loader:"url-loader",
            options:{
                limit:1000
            }
        }
    }
```
- url-loader 可以处理 mp4|webm|ogg|mp3|wav|flac|aac 格式
- url-loader 可以处理各种字体格式 woff2?|eot|ttf|otf
```
    {
        test:/\.(mp4|webm|ogg|mp3|wav|flac|aac)(?.)?$/,
        loader:"url-loader",
        options:{
            limit:10000,
            name:utils.assetsPath('media/[name].[hash:7].[ext]')
        }
    },
    {
        test:/\.(woff2?|eot|ttf|otf)(?.)?$/,
        loader:"url-loader",
        options:{
            limit:10000,
            name:utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
    }
```

## 打包文件分类
- 打包 css 文件 
``` 
    new MiniCssExtractPlugin({
        filename:"css/main.css"
    })
    # 记得 js 中要引入 否则看不到
```
- 打包 js 文件
```
    filename:"js/main.js"
```
- 打包图片
```
    options:{
        limit:1,
        outputPath:'/img/'
    }
    # 被 base64 转化的不会打包
```
- 添加 公共目录 或 域名 publicPath
```
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"bundle.js",
        publicPath:"http://loaclhost:3000"
    }
```
# 也可以单独加
```
    # 这里只给 img 加
    options:{
        limit:1,
        outputPath:'/img/',
        publicPath:"http://loaclhost:3000"
    }
```


## webpack 配置 [多页配置等代码链接]: https://github.com/shixiaoqiande/my_webpackmorepage

## webpack 配置

## resolve 用法
```
    # 与 mode 同级
    resolve:{
        // 可以直接指定查找的目录层级 不再往上级目录查找
        modules:[path.resolve('node_modules')],
        // 配置可以省略后缀的文件
        expensions:['.js','.css','.json','.vue'],
        // 别名 
        alias:{
            "bootstrap":"bootstrap/dist/css/bootstrap"
        },
        // 配置主入口 字段
        // 第三方包的 package.json 里会先找 main（主入口） 字段，再查找别的字段
        mainFiels:['style','main'],
        // 入口文件的名字 通常是 index.js
        mainFile:['index.js']
    }
```

## 区分环境 （开发环境和生产环境）
- webpack.config.js 改为 webpack.base.js
- 新建文件 webpack.prod.js 和 webpack.dev.js
- 下载 webpack-merge
    - yarn add webpack-merge
- 开发环境配置 (webpack.dev.js)
```
    let {smart} = require('webpack-merge');
    let base = require('./webpack.base');
    module.exports = smart(base,{ // 相当于合成 base 文件和 dev 文件
        mode:'development',
        ...
    })
```
- 生产环境配置 (webpack.prod.js)
```
    let {smart} = require('webpack-merge');
    let base = require('./webpack.base');
    module.exports = smart(base,{
        mode:'production',
        ...
    })
```
- 运行脚本修改 package.json
```
    "build":"webpack --config webpack.prod.js",
    "dev":"webpack-dev-server --inline --progress --config webpack.dev.js"
```

## webpack 优化
1. noParse 配置不解析的模块
```
    module:{
        noParse:/jquery/ // 不去解析 jquery 中的依赖库
    }
```
2. IgnorePlugin 忽略打包项 webpack 内置插件 以 moment 库为例
```
    # webpack.base.js plugins
    new webpack.IgnorePlugin(/\.\/locale/,/moment/)

    # index.js
    import moment from 'moment';
    // 配置 IgnorePlugin 插件后 就需要引入 需要的语言模块
    import 'moment/locale/zh-cn'
    // 设置语言 配置 IgnorePlugin 插件前设置
    // moment.loacle('zh-cn')
    // 距离今天结束还有多久
    let r = moment().endOf('day').fromNow()
```





## webpack 配置 [以下功能代码链接]: https://github.com/shixiaoqiande/my_webpackprod

## webpack 配置

## resolve 用法
```
    # 与 mode 同级
    resolve:{
        // 可以直接指定查找的目录层级 不再往上级目录查找
        modules:[path.resolve('node_modules')],
        // 配置可以省略后缀的文件
        expensions:['.js','.css','.json','.vue'],
        // 别名 
        alias:{
            "bootstrap":"bootstrap/dist/css/bootstrap"
        },
        // 配置主入口 字段
        // 第三方包的 package.json 里会先找 main（主入口） 字段，再查找别的字段
        mainFiels:['style','main'],
        // 入口文件的名字 通常是 index.js
        mainFile:['index.js']
    }
```

## 区分环境 （开发环境和生产环境）
- webpack.config.js 改为 webpack.base.js
- 新建文件 webpack.prod.js 和 webpack.dev.js
- 下载 webpack-merge
    - yarn add webpack-merge
- 开发环境配置 (webpack.dev.js)
```
    let {smart} = require('webpack-merge');
    let base = require('./webpack.base');
    module.exports = smart(base,{ // 相当于合成 base 文件和 dev 文件
        mode:'development',
        ...
    })
```
- 生产环境配置 (webpack.prod.js)
```
    let {smart} = require('webpack-merge');
    let base = require('./webpack.base');
    module.exports = smart(base,{
        mode:'production',
        ...
    })
```
- 运行脚本修改 package.json
```
    "build":"webpack --config webpack.prod.js",
    "dev":"webpack-dev-server --inline --progress --config webpack.dev.js"
```

## webpack 优化
1. noParse 配置不解析的模块
```
    module:{
        noParse:/jquery/ // 不去解析 jquery 中的依赖库
    }
```
2. IgnorePlugin 忽略打包项 webpack 内置插件 以 moment 库为例
```
    # webpack.base.js plugins
    new webpack.IgnorePlugin(/\.\/locale/,/moment/)

    # index.js
    import moment from 'moment';
    // 配置 IgnorePlugin 插件后 就需要引入 需要的语言模块
    import 'moment/locale/zh-cn'
    // 设置语言 配置 IgnorePlugin 插件前设置
    // moment.loacle('zh-cn')
    // 距离今天结束还有多久
    let r = moment().endOf('day').fromNow()
```

## 多线程打包
- 下载 happypack
    yarn add happypack
- 在 webpack.config.js 中配置
```
    # module / rules
    {
        test:/\.js$/,
        use:'happypack/loader?id=js'
    }
    # 引入插件
    let Happypack = require('happypack');
    # plugins
    new Happypack({
        id:'js',
        use:[
            {
                preset:['@babel/preset-env'],
                plugins:[
                    // 用于解决 后面js使用懒加载时 es6 语法问题
                    '@babel/plugin-syntax-dynamic-import'
                ]
            }
        ]
    })
```

## webpack 自带优化
- scope hosting 作用域提升
- 新建一个 a.js 
```
    # 随便写点儿代码
    let sum = (a, b) => {
        return a + b + 'sum';
    }

    let minus = (a, b) => {
        return a - b + 'minus';
    }

    export default {
        sum, minus
    }  
```
- 在 index.js 中引入
```
    import calc from './a.js';
    console.log(calc)
    calc.sum(1,2)
    # 或
    let calc = require('./a.js');
    calc.default.sum(1,2)
    # webpack 会自动去掉没有用的代码
    let a = 1;
    let b = 2;
    let c = 3;
    let d = a+b+c;
    console.log(d,"------------------")
```

## 懒加载
- 在 webpack.config.js 中设置好（上边写好了）
- 在 index.js 中写懒加载
```
    let button = document.createElement('button');
    button.innerHTML = "YES!"
    button.onclick = function(){
        // stage -2 所以直接写现在不支持
        // 返回promise
        import('./a.js').then((data)=>{
            console.log(data)
        })
        
    }
    document.body.appendChild(button)
```




