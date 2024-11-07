# 蓝河应用脚手架

## 代码规范

脚手架中内置了`prettier`及`husky`，所有代码会在`git commit`时自动检查及格式化。我们封装了大部分的项目常用方法和方案，所以你只需按照我们设定好的规则编码即可满足绝大部分场景的开发需求。如果你有自定义的一些风格需求，也可以自行修改`prettier`的配置，不过为了项目的风格统一，如无必要，不建议自行修改。

## commit 方式

由于采用了 commitlint，所以git add 之后，提交代码时，需要带上特定的subject，必须是 git commit -m 'fix: xxx' 这种类型的才可以，**需要注意的是类型的后面需要用英文的 :，并且冒号后面是需要空一格的**

>   'feat',//新特性、新功能
>   'fix',//修改bug
>   'docs',//文档修改
>   'style',//代码格式修改, 注意不是 css 修改
>   'refactor',//代码重构
>   'perf',//优化相关，比如提升性能、体验
>   'test',//测试用例修改
>   'chore',//其他修改, 比如改变构建流程、或者增加依赖库、工具等
>   'revert',//回滚到上一个版本
>   'build',//编译相关的修改，例如发布版本、对项目构建或者依赖的改动

**注意：commit 时请尽可能细粒度，例如一个feat、一个bug提交一次，有助于代码 CR 和后期排查问题**

## 包管理器

建议使用 pnpm 

## 工作流

本工作流遵守gitlab workflow

### 正常开发流程

1. master是主要分支，几乎所有开发都会基于此分支
2. 每个版本重新创建开发分支
3. 开发完成后，要发MR到master
4. 版本开发完成后，拉出release分支，后续测试fix-bug在此分支完成
5. 测试完成后，发版，并在release发送MR到master

![normal](./md_rec/rpk-workflow.png)

### hotfix 开发流程

1. 若线上有紧急问题，则直接在Release分支修复并发版。完成后发送MR到master分支
2. 若此时有正在测试分支，需要merge到该开发分支；然后该分支开发完成发布后，MR回到master分支

![hotfix](./md_rec/rpk-workflow-hotfix.png)

## 文件结构

```
├── sign                           # 存储 rpk 包签名模块;
│   ├── certificate.pem            # 证书文件
│   └── private.pem                # 私钥文件
└── src           
│   ├── assets                     # 公用的资源(images/styles/字体...)
│   │   ├──images                  # 存储 png/jpg/svg 等公共图片资源
│   │   └──js                      # 存储公共 javaScript 代码资源
│   │   └──iconfont                # 存放图标字体
│   ├── common                     # 项目存放通用资源目录
│   │   ├──styles                  # 存放 less/css/sass 等公共样式资源
│   │   │  └──utils                # 存放项目所封装的工具类方法
│   │   └──scripts                 # 存放公共js资源
│   │      ├──apis                 # 存放项目所有网络请求接口方法
│   │      ├──const.js             # 存放项目常量，网络错误码，埋点事件ID等
│   │      ├──request.js           # 存放项目所封装的网络请求方法，包含vivo专用的请求加解密方法
│   │      ├──report.js            # 存放封装好的埋点上报方法
│   │      ├──utils.js             # 存放项目所封装的工具类方法
│   ├── pages                      # 统一存放项目页面级代码
│   ├── app.ux                     # 应用程序代码的人口文件
│   ├── manifest.json              # 配置快应用基本信息
│   └── components                 # 存放快应用公共组件
└── package.json                   # 定义项目需要的各种模块及配置信息
```

## 开发环境区分

脚手架中配置了用于区分不同环境的环境变量，用于切换打包不同环境的请求域名以及请求方法。

打包切换的命令配置在`package.json`中的`script`中，包含如下几条命令，如有不足你也可自行删改适配自己的项目。

| 命令                   | 描述                             |
| ---------------------- | -------------------------------- |
| `npm run release:test` | 生成测试环境的 `rpk`包并增加签名 |
| `npm run release:pre`  | 生成预发环境的 `rpk`包并增加签名 |
| `npm run release`      | 生成正式环境的 `rpk`包并增加签名 |

当前环境变量影响的文件有如下两个：

- `/src/common/scripts/apis/api.js`
- `/src/common/scripts/apis/data.js`

如果你有其他自定义环境变量需要增加，可以在`quickapp.config.js`中自行配置

文档结构：
