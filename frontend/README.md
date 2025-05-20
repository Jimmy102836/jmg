# 吉米哥达人任务平台前端

## 项目概述
吉米哥达人任务平台是一个连接达人与商家的电商带货平台，为商家和达人提供任务发布、申请、执行、结算等全流程服务。

## 技术栈
- Vue 3
- Vuex 4
- Vue Router 4
- Element Plus
- Axios
- SCSS

## 项目结构
```
frontend/
├── public/               # 静态资源
├── src/                  # 源代码
│   ├── api/              # API接口
│   ├── assets/           # 静态资源
│   │   ├── images/       # 图片
│   │   └── styles/       # 样式
│   ├── components/       # 通用组件
│   ├── router/           # 路由
│   ├── store/            # Vuex状态管理
│   │   └── modules/      # 模块化状态
│   ├── utils/            # 工具函数
│   ├── views/            # 页面视图
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── .env                  # 环境变量
├── .env.production       # 生产环境变量
└── vue.config.js         # Vue配置
```

## 开发指南

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run serve
```

### 生产环境构建
```bash
npm run build
```

### 代码规范检查
```bash
npm run lint
```

## 开发规范
- 组件命名：使用PascalCase
- 文件命名：使用kebab-case
- CSS类命名：使用kebab-case
- 状态管理：按模块组织Vuex

## API接口
API接口统一在`src/api`目录下管理，按业务模块划分。

## 部署说明
构建后的文件将输出到`dist`目录，可将该目录下的文件部署到任何静态文件服务器。 