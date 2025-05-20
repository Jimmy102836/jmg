/**
 * API拦截器 - 用于模拟后端API响应
 * 这个文件会在后端API不可用时启用，提供模拟数据
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockMaterials as materials } from './materials';
import { mockMerchants as merchants } from './merchants';
import { userLeaderboard, merchantLeaderboard } from './leaderboards';
import { products } from './products';

// 定义模拟用户数据
const adminUser = {
  id: 1,
  username: 'admin',
  nickname: '平台管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  avatar: null,
  status: 1,
  user_type: 3, // 3=管理员
  role: 'admin',
  created_at: '2023-01-01 00:00:00',
  updated_at: '2023-01-01 00:00:00'
};

const merchantUser = {
  id: 2,
  username: 'merchant',
  nickname: '测试商家',
  phone: '13900139000',
  email: 'merchant@example.com',
  avatar: null,
  status: 1,
  user_type: 1, // 1=商家
  role: 'merchant',
  created_at: '2023-01-01 00:00:00',
  updated_at: '2023-01-01 00:00:00'
};

// 创建一个新的mock adapter实例
const mock = new MockAdapter(axios, { delayResponse: 500 });

// 登录API
mock.onPost('/api/auth/login').reply((config) => {
  const { username, password } = JSON.parse(config.data);
  
  if (username === 'admin' && password === 'admin123') {
    return [200, {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock_admin_token_' + Date.now(),
        user: adminUser
      }
    }];
  } else if (username === 'merchant' && password === 'merchant123') {
    return [200, {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock_merchant_token_' + Date.now(),
        user: merchantUser
      }
    }];
  } else {
    return [401, {
      code: 401,
      message: '用户名或密码错误',
      data: null
    }];
  }
});

// 获取用户信息
mock.onGet('/api/user/info').reply((config) => {
  // 从请求头中获取token
  const token = config.headers.Authorization;
  
  if (!token) {
    return [401, {
      code: 401,
      message: '未登录或token已过期',
      data: null
    }];
  }
  
  if (token.includes('admin')) {
    return [200, {
      code: 200,
      message: '获取成功',
      data: adminUser
    }];
  } else if (token.includes('merchant')) {
    return [200, {
      code: 200,
      message: '获取成功',
      data: merchantUser
    }];
  } else {
    return [401, {
      code: 401,
      message: '未登录或token已过期',
      data: null
    }];
  }
});

// 登出
mock.onPost('/api/auth/logout').reply(200, {
  code: 200,
  message: '退出成功',
  data: null
});

// 获取素材列表
mock.onGet('/api/materials').reply(200, {
  code: 200,
  message: '获取成功',
  data: {
    data: materials,
    total: materials.length,
    page: 1,
    per_page: 10
  }
});

// 获取用户排行榜
mock.onGet(/\/api\/leaderboards\/users/).reply((config) => {
  const limit = parseInt(config.url.split('limit=')[1]) || 5;
  
  return [200, {
    code: 200,
    message: '获取成功',
    data: {
      data: userLeaderboard.slice(0, limit),
      total: userLeaderboard.length
    }
  }];
});

// 获取商户排行榜
mock.onGet(/\/api\/leaderboards\/merchants/).reply((config) => {
  const limit = parseInt(config.url.split('limit=')[1]) || 5;
  
  return [200, {
    code: 200,
    message: '获取成功',
    data: {
      data: merchantLeaderboard.slice(0, limit),
      total: merchantLeaderboard.length
    }
  }];
});

// 获取商家列表
mock.onGet('/api/merchants').reply(200, {
  code: 200,
  message: '获取成功',
  data: {
    data: merchants,
    total: merchants.length,
    page: 1,
    per_page: 10
  }
});

// 获取任务列表
mock.onGet('/api/tasks').reply(200, {
  code: 200,
  message: '获取成功',
  data: {
    data: [
      {
        id: 1,
        title: '抖音短视频带货推广',
        price: 1500,
        status: 1,
        category: '短视频带货',
        merchant_id: 2,
        merchant_name: '测试商家',
        followers_required: 5000,
        created_at: '2023-04-01 10:00:00',
        expire_at: '2023-05-01 10:00:00',
        description: '需要推广我们的新款手机壳产品，要求拍摄1-2分钟短视频...'
      },
      {
        id: 2,
        title: '直播带货活动',
        price: 3000,
        status: 1,
        category: '直播带货',
        merchant_id: 2,
        merchant_name: '测试商家',
        followers_required: 10000,
        created_at: '2023-04-02 14:30:00',
        expire_at: '2023-05-02 14:30:00',
        description: '化妆品直播带货，需要在直播中展示和讲解产品功效...'
      }
    ],
    total: 2,
    page: 1,
    per_page: 10
  }
});

// 获取任务详情
mock.onGet(/\/api\/tasks\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  
  // 模拟任务详情数据
  const taskDetail = {
    id: id,
    title: id === 1 ? '抖音短视频带货推广' : '直播带货活动',
    price: id === 1 ? 1500 : 3000,
    status: 1,
    category: id === 1 ? '短视频带货' : '直播带货',
    merchant_id: 2,
    merchant_name: '测试商家',
    merchant_avatar: 'https://via.placeholder.com/100',
    merchant_rating: 4.8,
    followers_required: id === 1 ? 5000 : 10000,
    created_at: id === 1 ? '2023-04-01 10:00:00' : '2023-04-02 14:30:00',
    expire_at: id === 1 ? '2023-05-01 10:00:00' : '2023-05-02 14:30:00',
    apply_count: id === 1 ? 8 : 5,
    max_apply: id === 1 ? 15 : 10,
    task_type: id === 1 ? '短视频' : '直播',
    description: id === 1 
      ? '需要推广我们的新款手机壳产品，要求拍摄1-2分钟短视频，展示产品特点和使用场景。要求画面清晰，讲解生动有趣，突出产品的实用性和美观性。期望能够吸引18-35岁的年轻用户。' 
      : '化妆品直播带货，需要在直播中展示和讲解产品功效，直播时长不少于2小时，要求对化妆品有一定了解，能够专业地讲解产品成分和使用方法。目标受众为25-40岁的女性用户。',
    requirements: id === 1
      ? ['粉丝数5000以上', '视频时长1-2分钟', '7天内完成', '提供作品预览']
      : ['粉丝数10000以上', '直播时长2小时以上', '需展示5款产品', '直播前需培训'],
    product_info: {
      name: id === 1 ? '新款时尚手机壳' : '高保湿精华液',
      image: 'https://via.placeholder.com/300',
      description: id === 1 
        ? '时尚美观，防摔耐用，多款颜色可选' 
        : '深层保湿，修复肌肤屏障，改善干燥问题'
    },
    materials: [
      {
        id: 101,
        name: '产品详情图',
        type: 'image',
        url: 'https://via.placeholder.com/800x600',
        size: '2MB'
      },
      {
        id: 102,
        name: '产品介绍文案',
        type: 'document',
        url: '#',
        size: '0.5MB'
      }
    ]
  };
  
  return [200, {
    code: 200,
    message: '获取成功',
    data: taskDetail
  }];
});

// 获取商品列表
mock.onGet('/api/products').reply(200, {
  code: 200,
  message: '获取成功',
  data: {
    data: products.slice(0, 20),
    total: products.length,
    page: 1,
    per_page: 20
  }
});

// 获取商品详情
mock.onGet(/\/api\/products\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  
  // 查找产品
  const product = products.find(p => p.id === id);
  
  if (product) {
    return [200, {
      code: 200,
      message: '获取成功',
      data: product
    }];
  } else {
    return [404, {
      code: 404,
      message: '商品不存在',
      data: null
    }];
  }
});

// 健康检查API
mock.onGet('/api/health-check').reply(200, {
  code: 200,
  message: '服务正常',
  data: {
    status: 'ok',
    version: '1.0.0',
    mode: 'mock'
  }
});

// 拦截所有未定义的请求，返回成功响应
mock.onAny().reply(200, {
  code: 200,
  message: '这是模拟数据，实际功能尚未实现',
  data: null
});

export default mock; 