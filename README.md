# 吉米哥达人任务平台

吉米哥达人任务平台是一个连接商家与达人的短视频营销服务平台，旨在提供高效、透明的任务对接和合作流程，类似达多多和蝉选。

## 项目架构

本项目采用前后端分离架构：
- 前端：Vue.js 3 + Element Plus + Axios
- 后端：PHP (Laravel) + MySQL/SQLite

## 主要功能模块

### 1. 商品展示功能
- 精选商品库展示，支持分类、佣金、价格区间等多维度筛选
- 商品详情页，展示商品信息、销售数据和达人带货情况
- 销售渠道占比分析，包括直播带货、视频带货和商品卡转化率
- 相关推荐功能，为达人提供更多优质商品选择

### 2. 抖音账号授权和管理
- 账号授权流程：填写信息、扫码授权、完成绑定三步操作
- 账号列表管理，展示已授权账号的基本信息和授权状态
- 账号数据统计，包括粉丝数、作品数和30天销售数据
- 支持账号编辑、重新授权和解除绑定等操作

### 3. 任务管理
- 商家发布任务
- 达人浏览和申请任务
- 任务状态全流程跟踪

### 4. 用户管理
- 用户注册、登录、认证
- 商家、达人、管理员三种角色权限

### 5. 会员等级体系
- 多级会员体系（普通会员、银牌会员、金牌会员、钻石会员）
- 不同等级拥有不同权益（任务接单数量、佣金比例、提现速度）
- 基于任务完成质量和数量的自动升级机制

### 6. 素材管理
- 商家上传产品素材
- 达人提交成片作品

### 7. 结算管理
- 任务完成确认
- 佣金结算和提现

### 8. 排行榜功能
- 用户排行榜：按所有关联抖音账号GMV(商品交易总额)进行排名，展示达人影响力
- 商户排行榜：按用户评分(Rating)排名，突出优质合作商家
- 评分系统：达人完成任务后对商户进行星级评分，形成商户信誉体系
- 排行榜定期更新，设置日榜、周榜、月榜和总榜
- 榜单奖励机制，为排名靠前的用户和商户提供平台特权

## 本地开发环境

### 前端开发
```bash
# 进入前端项目目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build
```

### 后端开发
```bash
# 进入后端项目目录
cd backend

# 安装依赖
composer install

# 配置环境变量
cp .env.example .env
# 编辑.env文件配置数据库

# 运行数据库迁移
php artisan migrate

# 启动服务
php artisan serve
```

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

### 商品展示模块
| 文件/目录 | 功能描述 |
|---------|---------|
| `src/views/Products.vue` | 商品列表页，支持多维度筛选和搜索 |
| `src/views/ProductDetail.vue` | 商品详情页，展示商品详细信息和数据统计 |
| `src/mock/products.js` | 商品模拟数据 |

### 账号管理模块
| 文件/目录 | 功能描述 |
|---------|---------|
| `src/views/user/DouyinAuth.vue` | 账号授权页面，三步授权流程 |
| `src/views/user/DouyinAccounts.vue` | 账号管理列表，展示已授权账号信息 |
| `src/mock/douyinAccounts.js` | 账号模拟数据 |

### 公共组件
| 文件/目录 | 功能描述 |
|---------|---------|
| `src/components/Header.vue` | 顶部导航栏 |
| `src/components/Footer.vue` | 页脚信息 |
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
| `src/views/Leaderboard.vue` | 排行榜主页面 |
| `src/views/UserLeaderboard.vue` | 用户GMV排行榜页面 |
| `src/views/MerchantLeaderboard.vue` | 商户评分排行榜页面 |

### 状态管理
| 文件/目录 | 功能描述 |
|---------|---------|
| `src/store/index.js` | Vuex配置入口 |
| `src/store/modules/auth.js` | 认证状态管理 |
| `src/store/modules/task.js` | 任务数据状态管理 |
| `src/store/modules/material.js` | 素材数据状态管理 |
| `src/store/modules/stats.js` | 统计数据状态管理 |
| `src/store/modules/products.js` | 商品数据状态管理 |
| `src/store/modules/douyinAccounts.js` | 抖音账号状态管理 |
| `src/store/modules/leaderboard.js` | 排行榜数据状态管理 |

## 后端模块说明

### 控制器
| 文件/目录 | 功能描述 |
|---------|---------|
| `app/Http/Controllers/AuthController.php` | 认证控制器，处理登录注册等 |
| `app/Http/Controllers/UserController.php` | 用户信息控制器 |
| `app/Http/Controllers/TaskController.php` | 任务管理控制器 |
| `app/Http/Controllers/ProductController.php` | 商品管理控制器 |
| `app/Http/Controllers/DouyinAuthController.php` | 抖音授权控制器 |
| `app/Http/Controllers/MaterialController.php` | 素材管理控制器 |
| `app/Http/Controllers/SettlementController.php` | 结算管理控制器 |
| `app/Http/Controllers/StatisticsController.php` | 数据统计控制器 |
| `app/Http/Controllers/LeaderboardController.php` | 排行榜控制器 |
| `app/Http/Controllers/RatingController.php` | 评分管理控制器 |

### 模型
| 文件/目录 | 功能描述 |
|---------|---------|
| `app/Models/User.php` | 用户模型 |
| `app/Models/Task.php` | 任务模型 |
| `app/Models/Product.php` | 商品模型 |
| `app/Models/DouyinAccount.php` | 抖音账号模型 |
| `app/Models/TaskApplication.php` | 任务申请模型 |
| `app/Models/Material.php` | 素材模型 |
| `app/Models/Settlement.php` | 结算模型 |
| `app/Models/WithdrawalRequest.php` | 提现请求模型 |
| `app/Models/MerchantRating.php` | 商户评分模型 |
| `app/Models/Leaderboard.php` | 排行榜模型 |

### 服务
| 文件/目录 | 功能描述 |
|---------|---------|
| `app/Services/AuthService.php` | 认证服务 |
| `app/Services/UserService.php` | 用户服务 |
| `app/Services/TaskService.php` | 任务管理服务 |
| `app/Services/ProductService.php` | 商品服务 |
| `app/Services/DouyinAuthService.php` | 抖音授权服务 |
| `app/Services/SmsService.php` | 短信服务 |
| `app/Services/LeaderboardService.php` | 排行榜服务 |
| `app/Services/RatingService.php` | 评分管理服务 |

## 业务流程

### 商品推广流程
1. 达人登录平台并授权抖音账号
2. 浏览平台精选商品库
3. 筛选适合自己粉丝群体的高佣金商品
4. 查看商品详情和销售数据
5. 将商品添加到自己的橱窗或获取推广链接
6. 在抖音发布视频或直播带货
7. 平台自动统计销售数据和佣金

### 抖音账号授权流程
1. 达人在账号管理页面点击"添加抖音账号"
2. 填写账号基本信息（昵称、ID、分类等）
3. 使用抖音App扫描授权二维码
4. 确认授权请求
5. 完成账号绑定，可查看数据统计

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
4. 提交接单申请
5. 商家审核并确认
6. 达人完成任务并提交成果
7. 商家确认并结算佣金

### 商户评分流程
1. 达人完成任务后收到评分提醒
2. 进入评分页面，对商户进行1-5星评分
3. 选填评价内容和标签
4. 提交评分
5. 系统自动计算并更新商户评分

### 排行榜更新流程
1. 系统每日凌晨定时计算用户GMV
2. 统计所有关联抖音账号的交易额
3. 更新用户排行榜数据
4. 计算商户平均评分
5. 更新商户排行榜数据
6. 系统自动为排名靠前的用户和商户颁发奖励徽章

## 贡献指南

1. Fork本仓库
2. 创建您的特性分支 `git checkout -b feature/amazing-feature`
3. 提交您的更改 `git commit -m 'Add some amazing feature'`
4. 推送到分支 `git push origin feature/amazing-feature`
5. 创建Pull Request

## 授权许可

本项目采用MIT许可证 - 详细信息请查看LICENSE文件

## 联系方式

如有任何问题，请联系项目负责人：

- 邮箱：contact@douyintz.com
- 微信：douyintz_service 