## h5-webpack 单页配置

一般用来开发简单的单页（活动页）配置，用 ts 代替 js，用 sass 代替 css，配置了开发和打包生产两种模式。

开发模式：不会有任何文件生成。

生产模式：在此文件同级目录打包出 dist 文件夹，最终要上传到生产服务器的静态文件。

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
- ready         预生产/仿真
- prodction     生产/正式    

打包各种环境：

```javascript
// 开发
npm run build:dev

// 测试
npm run build:test

// 预生产/仿真
npm run build:ready

// 生产/正式
npm run build:prod
```

 
### 目录结构描述

```bash
├── config                              # webpack 配置
├── dist                                # 打包后的静态文件（打包才有）
├── node_modules                        # 项目依赖包（需要安装）
├── src                                 # 开发目录
│   ├── css                             # css 样式文件
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

### dist（打包后的文件夹）

```bash
├── css                                 
├── images                              
├── js                                  
├── favicon.ico                         
└── index.html                          
```

