# 抖音团长平台

## 项目概述

抖音团长平台是一个连接商家与达人的短视频营销平台，帮助商家发布任务，达人接单完成推广，实现高效的短视频营销生态。

## 技术架构

### 前后端分离架构

- **前端**：Vue.js 3 + Element Plus
- **后端**：PHP 8 + Laravel 9
- **数据库**：MySQL 8.0
- **API通信**：RESTful API + JWT认证

### 目录结构

```
douyinTZ/
├── frontend/           # 前端项目 (Vue.js)
│   ├── public/         # 静态资源
│   ├── src/            # 源代码
│   │   ├── assets/     # 图片和样式资源
│   │   ├── components/ # 公共组件
│   │   ├── mock/       # 模拟数据
│   │   ├── router/     # 路由配置
│   │   ├── store/      # Vuex状态管理
│   │   ├── utils/      # 工具函数
│   │   └── views/      # 页面组件
│   ├── package.json    # 依赖配置
│   └── vue.config.js   # Vue项目配置
│
├── backend/            # 后端项目 (Laravel)
│   ├── app/            # 应用主目录
│   │   ├── Http/       # HTTP层
│   │   │   ├── Controllers/ # 控制器
│   │   │   └── Middleware/  # 中间件
│   │   ├── Models/     # 数据模型
│   │   └── Services/   # 业务服务层
│   ├── database/       # 数据库相关
│   │   └── migrations/ # 数据库迁移文件
│   ├── routes/         # 路由配置
│   └── .env            # 环境配置
│
├── docker/             # Docker配置
├── nginx/              # Nginx配置
└── README.md           # 项目说明文档
```

## 前端模块说明

### 公共组件

| 文件/目录 | 功能描述 |
|---------|---------|
| `src/components/HeaderNav.vue` | 顶部导航栏 |
| `src/components/FooterInfo.vue` | 页脚信息 |
| `src/components/admin/AdminLayout.vue` | 管理后台布局 |
| `src/components/merchant/MerchantLayout.vue` | 商家后台布局 |

### 页面视图

| 文件/目录 | 功能描述 |
|---------|---------|
| `src/views/Home.vue` | 首页 |
| `src/views/TaskList.vue` | 任务列表页 |
| `src/views/TaskDetail.vue` | 任务详情页 |
| `src/views/login/Login.vue` | 登录页面 |
| `src/views/register/Register.vue` | 注册页面 |
| `src/views/Forbidden.vue` | 403权限错误页 |
| `src/views/admin/*` | 管理员后台相关页面 |
| `src/views/merchant/*` | 商家后台相关页面 |

### 状态管理

| 文件/目录 | 功能描述 |
|---------|---------|
| `src/store/index.js` | Vuex配置入口 |
| `src/store/modules/auth.js` | 认证状态管理 |
| `src/store/modules/task.js` | 任务数据状态管理 |
| `src/store/modules/material.js` | 素材数据状态管理 |
| `src/store/modules/stats.js` | 统计数据状态管理 |

### 工具函数

| 文件/目录 | 功能描述 |
|---------|---------|
| `src/utils/auth-debug.js` | 开发环境认证调试工具 |
| `src/utils/request.js` | Axios请求封装 |
| `src/utils/date.js` | 日期格式化工具 |
| `src/utils/validator.js` | 表单验证工具 |

### 模拟数据

| 文件/目录 | 功能描述 |
|---------|---------|
| `src/mock/api-mock.js` | API拦截器，用于开发环境模拟后端 |
| `src/mock/materials.js` | 素材模拟数据 |
| `src/mock/merchants.js` | 商家模拟数据 |

## 后端模块说明

### 控制器

| 文件/目录 | 功能描述 |
|---------|---------|
| `app/Http/Controllers/AuthController.php` | 认证控制器，处理登录注册等 |
| `app/Http/Controllers/UserController.php` | 用户信息控制器 |
| `app/Http/Controllers/TaskController.php` | 任务管理控制器 |
| `app/Http/Controllers/MaterialController.php` | 素材管理控制器 |
| `app/Http/Controllers/SettlementController.php` | 结算管理控制器 |
| `app/Http/Controllers/StatisticsController.php` | 数据统计控制器 |

### 模型

| 文件/目录 | 功能描述 |
|---------|---------|
| `app/Models/User.php` | 用户模型 |
| `app/Models/Task.php` | 任务模型 |
| `app/Models/TaskApplication.php` | 任务申请模型 |
| `app/Models/Material.php` | 素材模型 |
| `app/Models/Settlement.php` | 结算模型 |
| `app/Models/WithdrawalRequest.php` | 提现请求模型 |

### 服务

| 文件/目录 | 功能描述 |
|---------|---------|
| `app/Services/AuthService.php` | 认证服务 |
| `app/Services/UserService.php` | 用户服务 |
| `app/Services/TaskService.php` | 任务管理服务 |
| `app/Services/SmsService.php` | 短信服务 |

### 路由

| 文件/目录 | 功能描述 |
|---------|---------|
| `routes/api.php` | API路由配置 |
| `routes/web.php` | Web路由配置 |

## 数据库设计

### 主要表结构

| 表名 | 功能描述 |
|-----|---------|
| `users` | 用户信息表，存储用户基本信息 |
| `user_profiles` | 用户资料表，存储用户详细资料 |
| `tasks` | 任务表，存储任务信息 |
| `task_applications` | 任务申请表，记录达人申请信息 |
| `task_requirements` | 任务要求表，存储任务详细要求 |
| `materials` | 素材表，存储任务所需素材 |
| `settlements` | 结算表，记录任务的结算信息 |
| `withdrawal_requests` | 提现请求表，记录用户提现申请 |

## 业务流程

### 商家发布任务流程

1. 商家登录平台
2. 进入任务管理界面
3. 填写任务基本信息（标题、价格、截止日期等）
4. 设置任务要求（达人粉丝数、任务要求等）
5. 上传任务相关素材
6. 提交任务等待审核
7. 平台审核通过后任务发布

### 达人接单流程

1. 达人登录平台
2. 浏览可申请的任务列表
3. 查看任务详情
4. 申请接单
5. 商家审核通过后开始任务
6. 完成任务后提交结果
7. 商家确认成果并结算

### 管理员审核流程

1. 管理员登录后台
2. 审核商家发布的任务
3. 审核达人的任务成果
4. 处理争议和投诉
5. 管理平台统计数据

## 部署指南

### 前端部署

```bash
# 安装依赖
cd frontend
npm install

# 开发环境运行
npm run serve

# 构建生产环境文件
npm run build:prod
```

### 后端部署

```bash
# 安装依赖
cd backend
composer install

# 配置环境变量
cp .env.example .env
php artisan key:generate

# 配置数据库
# 编辑.env文件，设置数据库连接信息

# 运行数据库迁移
php artisan migrate

# 添加初始数据
php artisan db:seed

# 启动开发服务器
php artisan serve
```

### 生产环境部署

1. 将前端构建文件部署到Web服务器
2. 配置Nginx指向前端构建目录
3. 设置API反向代理到Laravel后端
4. 确保数据库配置正确
5. 配置SSL证书以确保安全

## 开发环境说明

### 开发模式功能

为方便开发，项目提供了以下功能：

1. **模拟API**：前端可以使用模拟数据，无需后端API
2. **快捷登录**：提供一键模拟管理员或商家身份登录
3. **调试控制台**：在前端页面底部显示调试信息和操作按钮

### 关闭开发模式

生产环境上线前，需要关闭开发模式：

1. 修改`public/index.html`中的`window.enableMockApi = false`
2. 确保`main.js`中使用正确的API路径
3. 去除调试按钮和测试数据

## 技术支持与联系方式

如有问题，请联系项目管理员或技术支持团队。

---

文档最后更新日期：2023年5月 