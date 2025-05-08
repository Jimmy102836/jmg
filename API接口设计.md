# 抖音团长平台API接口设计

## 接口规范

### 请求格式
- 接口采用RESTful风格
- 请求方法：GET、POST、PUT、DELETE
- 请求头：Content-Type: application/json
- 认证方式：Bearer Token

### 响应格式
```json
{
  "code": 200,           // 状态码，200表示成功，非200表示失败
  "message": "success",  // 状态信息
  "data": {}             // 响应数据
}
```

### 状态码说明
| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 422 | 验证失败 |
| 500 | 服务器错误 |

## 用户认证API

### 注册
- 请求路径：`/api/auth/register`
- 请求方法：POST
- 请求参数：
```json
{
  "username": "example",
  "phone": "13800138000",
  "email": "example@example.com",
  "password": "123456",
  "password_confirmation": "123456",
  "user_type": 1,  // 1:商家,2:达人,3:普通用户
  "verification_code": "1234"  // 短信验证码
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "example",
      "phone": "13800138000",
      "email": "example@example.com",
      "user_type": 1,
      "created_at": "2023-05-01 10:00:00"
    }
  }
}
```

### 登录
- 请求路径：`/api/auth/login`
- 请求方法：POST
- 请求参数：
```json
{
  "username": "example",  // 用户名/手机号/邮箱
  "password": "123456"
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "example",
      "phone": "13800138000",
      "email": "example@example.com",
      "user_type": 1,
      "created_at": "2023-05-01 10:00:00",
      "roles": ["merchant"]
    }
  }
}
```

### 获取短信验证码
- 请求路径：`/api/auth/verification-code`
- 请求方法：POST
- 请求参数：
```json
{
  "phone": "13800138000",
  "type": "register"  // register:注册, reset_password:重置密码, login:登录
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "expires_in": 300  // 有效期，单位秒
  }
}
```

### 重置密码
- 请求路径：`/api/auth/reset-password`
- 请求方法：POST
- 请求参数：
```json
{
  "phone": "13800138000",
  "verification_code": "1234",
  "password": "654321",
  "password_confirmation": "654321"
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "密码重置成功",
  "data": null
}
```

### 退出登录
- 请求路径：`/api/auth/logout`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：无
- 响应结果：
```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

## 用户管理API

### 获取用户信息
- 请求路径：`/api/user/info`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：无
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "example",
    "phone": "13800138000",
    "email": "example@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "user_type": 1,
    "status": 1,
    "created_at": "2023-05-01 10:00:00",
    "roles": ["merchant"],
    "profile": {
      "real_name": "张三",
      "gender": 1,
      "birthday": "1990-01-01",
      "bio": "这是个人简介",
      "province": "广东省",
      "city": "深圳市",
      "district": "南山区"
    },
    "account": {
      "balance": 1000.00,
      "total_income": 5000.00,
      "total_withdraw": 4000.00,
      "frozen_amount": 0.00
    },
    "membership": {
      "level_id": 2,
      "level_name": "黄金会员",
      "points": 2000,
      "end_time": "2024-05-01 10:00:00"
    }
  }
}
```

### 更新用户资料
- 请求路径：`/api/user/profile`
- 请求方法：PUT
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "real_name": "张三",
  "gender": 1,
  "birthday": "1990-01-01",
  "bio": "这是个人简介",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园路1号"
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "资料更新成功",
  "data": {
    "real_name": "张三",
    "gender": 1,
    "birthday": "1990-01-01",
    "bio": "这是个人简介",
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "address": "科技园路1号"
  }
}
```

### 修改密码
- 请求路径：`/api/user/change-password`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "old_password": "123456",
  "password": "654321",
  "password_confirmation": "654321"
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

### 上传头像
- 请求路径：`/api/user/avatar`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：form-data格式，avatar字段为文件
- 响应结果：
```json
{
  "code": 200,
  "message": "头像上传成功",
  "data": {
    "avatar": "https://example.com/avatar/123.jpg"
  }
}
```

### 实名认证
- 请求路径：`/api/user/verify-identity`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：form-data格式
```
real_name: 张三
id_card: 440123199001010011
id_card_front: [文件]
id_card_back: [文件]
```
- 响应结果：
```json
{
  "code": 200,
  "message": "实名认证提交成功，等待审核",
  "data": null
}
```

### 获取账户余额
- 请求路径：`/api/user/account`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：无
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "balance": 1000.00,
    "total_income": 5000.00,
    "total_withdraw": 4000.00,
    "frozen_amount": 0.00
  }
}
```

## 任务管理API

### 获取任务分类
- 请求路径：`/api/tasks/categories`
- 请求方法：GET
- 请求参数：无
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "短视频",
      "icon": "https://example.com/icons/video.png",
      "sort": 1
    },
    {
      "id": 2,
      "name": "直播",
      "icon": "https://example.com/icons/live.png",
      "sort": 2
    },
    {
      "id": 3,
      "name": "图文",
      "icon": "https://example.com/icons/article.png",
      "sort": 3
    }
  ]
}
```

### 获取任务列表
- 请求路径：`/api/tasks`
- 请求方法：GET
- 请求参数：
```
category_id: 1  // 分类ID，可选
task_type: 1    // 任务类型，可选
keyword: 美妆    // 关键词搜索，可选
status: 2       // 任务状态，可选
page: 1         // 页码
limit: 10       // 每页数量
sort: created_at// 排序字段
order: desc     // 排序方向
```
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10,
    "data": [
      {
        "id": 1,
        "title": "美妆产品推广",
        "description": "推广XX品牌美妆产品",
        "category_id": 1,
        "task_type": 1,
        "budget": 10000.00,
        "unit_price": 100.00,
        "total_count": 100,
        "apply_count": 50,
        "complete_count": 30,
        "start_time": "2023-05-01 10:00:00",
        "end_time": "2023-05-31 10:00:00",
        "status": 2,
        "created_at": "2023-04-25 10:00:00",
        "merchant": {
          "id": 1,
          "username": "merchant1",
          "avatar": "https://example.com/avatar/merchant1.jpg"
        },
        "category": {
          "id": 1,
          "name": "短视频"
        }
      }
    ]
  }
}
```

### 获取任务详情
- 请求路径：`/api/tasks/{id}`
- 请求方法：GET
- 请求参数：无
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "美妆产品推广",
    "description": "推广XX品牌美妆产品",
    "category_id": 1,
    "task_type": 1,
    "budget": 10000.00,
    "unit_price": 100.00,
    "total_count": 100,
    "apply_count": 50,
    "complete_count": 30,
    "start_time": "2023-05-01 10:00:00",
    "end_time": "2023-05-31 10:00:00",
    "status": 2,
    "created_at": "2023-04-25 10:00:00",
    "merchant": {
      "id": 1,
      "username": "merchant1",
      "avatar": "https://example.com/avatar/merchant1.jpg"
    },
    "category": {
      "id": 1,
      "name": "短视频"
    },
    "requirements": {
      "fans_min": 5000,
      "platform": "抖音",
      "region": "全国",
      "gender": 0,
      "age_min": 18,
      "age_max": 35,
      "other_requirements": "需要美妆领域相关账号"
    },
    "materials": [
      {
        "id": 1,
        "title": "产品介绍",
        "material_type": 2,
        "file_path": "https://example.com/materials/video1.mp4",
        "duration": 60
      },
      {
        "id": 2,
        "title": "产品图片",
        "material_type": 1,
        "file_path": "https://example.com/materials/image1.jpg"
      }
    ]
  }
}
```

### 创建任务（商家）
- 请求路径：`/api/tasks`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "title": "美妆产品推广",
  "description": "推广XX品牌美妆产品",
  "category_id": 1,
  "task_type": 1,
  "budget": 10000.00,
  "unit_price": 100.00,
  "total_count": 100,
  "start_time": "2023-05-01 10:00:00",
  "end_time": "2023-05-31 10:00:00",
  "requirements": {
    "fans_min": 5000,
    "platform": "抖音",
    "region": "全国",
    "gender": 0,
    "age_min": 18,
    "age_max": 35,
    "other_requirements": "需要美妆领域相关账号"
  },
  "material_ids": [1, 2]
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "任务创建成功",
  "data": {
    "id": 1,
    "title": "美妆产品推广",
    "status": 0  // 草稿状态
  }
}
```

### 更新任务（商家）
- 请求路径：`/api/tasks/{id}`
- 请求方法：PUT
- 请求头：Authorization: Bearer {token}
- 请求参数：同创建任务
- 响应结果：
```json
{
  "code": 200,
  "message": "任务更新成功",
  "data": {
    "id": 1,
    "title": "美妆产品推广",
    "status": 0
  }
}
```

### 提交任务审核（商家）
- 请求路径：`/api/tasks/{id}/submit-review`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：无
- 响应结果：
```json
{
  "code": 200,
  "message": "任务已提交审核",
  "data": {
    "id": 1,
    "title": "美妆产品推广",
    "status": 1  // 审核中状态
  }
}
```

### 取消任务（商家）
- 请求路径：`/api/tasks/{id}/cancel`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "reason": "预算调整，暂时取消"
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "任务已取消",
  "data": {
    "id": 1,
    "title": "美妆产品推广",
    "status": 4  // 已取消状态
  }
}
```

### 申请任务（达人）
- 请求路径：`/api/tasks/{id}/apply`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "apply_reason": "我是美妆博主，粉丝10万+"
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "申请成功，等待审核",
  "data": {
    "id": 1,  // 申请ID
    "task_id": 1,
    "status": 0  // 待审核状态
  }
}
```

### 获取我的任务申请列表（达人）
- 请求路径：`/api/tasks/applications`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：
```
status: 0  // 申请状态，可选
page: 1    // 页码
limit: 10  // 每页数量
```
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 5,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1,
    "data": [
      {
        "id": 1,
        "task_id": 1,
        "status": 0,
        "apply_reason": "我是美妆博主，粉丝10万+",
        "created_at": "2023-05-01 10:00:00",
        "task": {
          "id": 1,
          "title": "美妆产品推广",
          "unit_price": 100.00,
          "merchant": {
            "id": 1,
            "username": "merchant1"
          }
        }
      }
    ]
  }
}
```

### 获取我的任务列表（商家）
- 请求路径：`/api/tasks/merchant`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：
```
status: 2  // 任务状态，可选
page: 1    // 页码
limit: 10  // 每页数量
```
- 响应结果：同获取任务列表

### 审核任务申请（商家）
- 请求路径：`/api/tasks/applications/{id}/review`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "status": 1,  // 1:通过, 2:拒绝
  "reject_reason": "不符合要求"  // 拒绝时必填
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "审核成功",
  "data": {
    "id": 1,
    "task_id": 1,
    "status": 1  // 已通过状态
  }
}
```

### 提交任务成果（达人）
- 请求路径：`/api/tasks/applications/{id}/submit`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "submit_content": "已完成视频发布，链接：https://example.com/video/123",
  "views": 5000,
  "likes": 500,
  "comments": 100,
  "shares": 50
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "id": 1,
    "task_id": 1,
    "status": 4  // 已提交状态
  }
}
```

### 审核任务成果（商家）
- 请求路径：`/api/tasks/applications/{id}/review-submission`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "status": 5,  // 5:通过, 6:驳回
  "reject_reason": "数据造假"  // 驳回时必填
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "审核成功",
  "data": {
    "id": 1,
    "task_id": 1,
    "status": 5  // 已完成状态
  }
}
```

## 素材管理API

### 获取素材列表
- 请求路径：`/api/materials`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：
```
material_type: 1  // 素材类型，可选
keyword: 美妆     // 关键词搜索，可选
page: 1          // 页码
limit: 10        // 每页数量
```
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 20,
    "per_page": 10,
    "current_page": 1,
    "last_page": 2,
    "data": [
      {
        "id": 1,
        "title": "产品介绍视频",
        "material_type": 2,
        "file_path": "https://example.com/materials/video1.mp4",
        "file_size": 10240,
        "file_ext": "mp4",
        "duration": 60,
        "width": 1280,
        "height": 720,
        "status": 1,
        "created_at": "2023-05-01 10:00:00"
      },
      {
        "id": 2,
        "title": "产品主图",
        "material_type": 1,
        "file_path": "https://example.com/materials/image1.jpg",
        "file_size": 1024,
        "file_ext": "jpg",
        "width": 800,
        "height": 600,
        "status": 1,
        "created_at": "2023-05-01 10:00:00"
      }
    ]
  }
}
```

### 上传素材
- 请求路径：`/api/materials`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：form-data格式
```
title: 产品介绍视频
material_type: 2
file: [文件]
content: 文本内容描述  // 当类型为文本时
```
- 响应结果：
```json
{
  "code": 200,
  "message": "素材上传成功",
  "data": {
    "id": 1,
    "title": "产品介绍视频",
    "material_type": 2,
    "file_path": "https://example.com/materials/video1.mp4",
    "file_size": 10240,
    "file_ext": "mp4",
    "duration": 60,
    "width": 1280,
    "height": 720,
    "status": 1,
    "created_at": "2023-05-01 10:00:00"
  }
}
```

### 获取素材详情
- 请求路径：`/api/materials/{id}`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：无
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "产品介绍视频",
    "material_type": 2,
    "file_path": "https://example.com/materials/video1.mp4",
    "file_size": 10240,
    "file_ext": "mp4",
    "content": null,
    "duration": 60,
    "width": 1280,
    "height": 720,
    "status": 1,
    "created_at": "2023-05-01 10:00:00",
    "updated_at": "2023-05-01 10:00:00",
    "tasks": [
      {
        "id": 1,
        "title": "美妆产品推广"
      }
    ]
  }
}
```

### 更新素材
- 请求路径：`/api/materials/{id}`
- 请求方法：PUT
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "title": "新产品介绍视频",
  "content": "视频描述文本内容"  // 当类型为文本时可更新内容
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "素材更新成功",
  "data": {
    "id": 1,
    "title": "新产品介绍视频"
  }
}
```

### 删除素材
- 请求路径：`/api/materials/{id}`
- 请求方法：DELETE
- 请求头：Authorization: Bearer {token}
- 请求参数：无
- 响应结果：
```json
{
  "code": 200,
  "message": "素材删除成功",
  "data": null
}
```

## 结算管理API

### 获取结算记录列表
- 请求路径：`/api/settlements`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：
```
status: 1      // 结算状态，可选
start_date: 2023-05-01  // 开始日期，可选
end_date: 2023-05-31    // 结束日期，可选
page: 1        // 页码
limit: 10      // 每页数量
```
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 5,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 2,
        "task_id": 1,
        "application_id": 1,
        "amount": 100.00,
        "status": 1,
        "settlement_time": "2023-05-10 10:00:00",
        "created_at": "2023-05-10 10:00:00",
        "task": {
          "id": 1,
          "title": "美妆产品推广"
        },
        "user": {
          "id": 2,
          "username": "talent1"
        }
      }
    ]
  }
}
```

### 申请提现
- 请求路径：`/api/withdrawals`
- 请求方法：POST
- 请求头：Authorization: Bearer {token}
- 请求参数：
```json
{
  "amount": 500.00,
  "account_type": 1,  // 1:支付宝,2:微信,3:银行卡
  "account_name": "张三",
  "account_no": "13800138000",
  "bank_name": "中国银行"  // 当account_type为3时必填
}
```
- 响应结果：
```json
{
  "code": 200,
  "message": "提现申请提交成功",
  "data": {
    "id": 1,
    "amount": 500.00,
    "status": 0,  // 待处理状态
    "created_at": "2023-05-15 10:00:00"
  }
}
```

### 获取提现记录列表
- 请求路径：`/api/withdrawals`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：
```
status: 0      // 提现状态，可选
start_date: 2023-05-01  // 开始日期，可选
end_date: 2023-05-31    // 结束日期，可选
page: 1        // 页码
limit: 10      // 每页数量
```
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 3,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1,
    "data": [
      {
        "id": 1,
        "amount": 500.00,
        "account_type": 1,
        "account_name": "张三",
        "account_no": "13800138000",
        "bank_name": null,
        "status": 0,
        "processed_time": null,
        "created_at": "2023-05-15 10:00:00"
      }
    ]
  }
}
```

### 获取收入统计
- 请求路径：`/api/statistics/income`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：
```
period: month  // 统计周期，可选值：day,week,month,year
start_date: 2023-05-01  // 开始日期，可选
end_date: 2023-05-31    // 结束日期，可选
```
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total_income": 1000.00,
    "total_withdraw": 500.00,
    "balance": 500.00,
    "frozen_amount": 0.00,
    "statistics": [
      {
        "date": "2023-05-01",
        "income": 200.00
      },
      {
        "date": "2023-05-02",
        "income": 300.00
      },
      {
        "date": "2023-05-03",
        "income": 500.00
      }
    ]
  }
}
```

### 获取推广数据统计
- 请求路径：`/api/statistics/promotion`
- 请求方法：GET
- 请求头：Authorization: Bearer {token}
- 请求参数：
```
task_id: 1     // 任务ID，可选
period: day    // 统计周期，可选值：day,week,month
start_date: 2023-05-01  // 开始日期，可选
end_date: 2023-05-07    // 结束日期，可选
```
- 响应结果：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total_views": 50000,
    "total_likes": 5000,
    "total_comments": 1000,
    "total_shares": 500,
    "conversion_rate": 10.00,
    "statistics": [
      {
        "date": "2023-05-01",
        "views": 10000,
        "likes": 1000,
        "comments": 200,
        "shares": 100
      },
      {
        "date": "2023-05-02",
        "views": 15000,
        "likes": 1500,
        "comments": 300,
        "shares": 150
      },
      {
        "date": "2023-05-03",
        "views": 25000,
        "likes": 2500,
        "comments": 500,
        "shares": 250
      }
    ]
  }
}
``` 