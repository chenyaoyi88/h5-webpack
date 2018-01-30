## h5-webpack 单页配置

一般用来开发简单的单页（活动页）配置，用 ts 代替 js，用 sass 代替 css，配置了开发和打包生产两种模式。

开发模式：不会有任何文件生成。

生产模式：在此文件同级目录打包出 test（测试环境）/prod（生产环境） 文件夹，最终要上传到生产服务器的静态文件。

### 命令

##### 安装

```javascript
npm install

// 或者
cnpm install
```

##### 开发 / 启动项目：

```javascript
npm start
```

预设了 4 个环境，process.env.NODE_ENV 对应的环境值分别是：

- development   开发
- test          测试
- prodction     生产/正式    

打包各种环境：

```bash
# 开发
npm run build:dev

# 测试
npm run build:test

# 生产/正式
npm run build:prod
```

##### 打包完后预览项目：

```bash

# 预览打包好的【测试】环境静态文件
npm run preview:test

# 预览打包好的【正式】环境静态文件
npm run preview:prod
```

##### 打包完后直接上传到 ftp（测试环境）：

注：目前只添加上传到测试环境的命令，待详细测试之后添加上传正式环境的命令

```bash

# 打包【测试】环境静态文件，然后直接上传到测试环境 ftp
npm run upload:test
```
 
### 目录结构描述

```bash
├── config                              # webpack 配置（新增seo和上传配置）
├── prod/test/dev                       # 打包后的静态文件（打包成功后才会出现）
├── node_modules                        # 项目依赖包（需要安装）
├── src                                 # 开发目录
│   ├── images                          # 图片文件
│   ├── sass                            # scss 样式文件
│   ├── ts                              # ts 文件
│   ├── vendor                          # 第三方库或工具
│   ├── index.d.ts                      # 声明文件
│   ├── favicon.ico                     # 网站图标
│   └── index.html                      # 单页模版
├── .gitignore                          # 不提交到 git 的文件
├── package.json                        # 项目说明文件
├── postcss.config.js                   # postcss 配置文件
├── README.md                           # 此文件
├── tsconfig                            # ts 配置文件
└── tslint.json                         # ts 编码规范文件
```

### prod/test（打包后的文件夹）

```bash
├── css                                 
├── images                              
├── js                                  
├── favicon.ico                         
└── index.html                          
```

### 注意事项

问题一：

目前 vendor 文件在没有引入任何第三方库的情况下，依旧在 html 文件中会加载，如果没有使用第三方库，需要手动到 config 配置中注释掉相关代码。

以上问题会在后续中进一步优化。

### 更新日志

2018.01.07  

- 更新 webpack 配置，用官方推荐的 awesome-typescript-loader 替代 ts-loader（因为这个 ts-loader 无法处理 Class 类的定义以及很多 ts 语法支持得不是很好，会报错） ；
- 自己写了一个 ts 专用的 cyy-tool (cnpm i cyy-tool -D 安装)常用函数工具发布到了 npmjs，尝试在此项目中导入，目前暂无问题；

2018.01.25

- 更新 webpack 配置，图片打包之后的路径更新为相对路径（之前设置不合理）；
- 由 rem 单位改为 vw 单位，因此可以去掉 index.html 上面的 rem 计算。

2018.01.28

- 添加上传 ftp 命令，直接上传可以，但是上传之后再上传覆盖原文件会报错，准备解决。

2018.01.30

- 上传 ftp 命令基本没问题，网络状况差的时候上传，速度过慢的情况下会出现上传文件失败的情况，准备解决。