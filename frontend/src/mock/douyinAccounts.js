// 抖音账号模拟数据
export const douyinAccounts = [
  {
    id: 1,
    nickname: '美妆达人小K',
    douyinId: '98765432100',
    avatar: 'https://via.placeholder.com/100x100?text=小K',
    fans: 1520000,
    likes: 12500000,
    works: 326,
    category: ['美妆', '护肤'],
    authStatus: 'active', // active, expired, pending
    authTime: '2024-03-15',
    expireTime: '2025-03-15',
    statistics: {
      liveStreams: {
        total: 156,
        last30Days: 12,
        avgDuration: 120, // 分钟
        avgViewers: 35000
      },
      videos: {
        total: 326,
        last30Days: 18,
        avgViews: 85000,
        avgLikes: 12300
      },
      sales: {
        total: 1250000,
        last30Days: 180000,
        totalOrders: 18600,
        last30DaysOrders: 2100
      }
    },
    products: [
      { 
        id: 1003, 
        sales: 2356, 
        commission: '35%',
        earnings: 23560
      },
      { 
        id: 1008, 
        sales: 1872, 
        commission: '40%',
        earnings: 29952
      }
    ]
  },
  {
    id: 2,
    nickname: '生活家阿明',
    douyinId: '87654321099',
    avatar: 'https://via.placeholder.com/100x100?text=阿明',
    fans: 980000,
    likes: 8700000,
    works: 289,
    category: ['生活', '家居'],
    authStatus: 'active',
    authTime: '2024-04-10',
    expireTime: '2025-04-10',
    statistics: {
      liveStreams: {
        total: 123,
        last30Days: 15,
        avgDuration: 90,
        avgViewers: 28000
      },
      videos: {
        total: 289,
        last30Days: 14,
        avgViews: 65000,
        avgLikes: 9800
      },
      sales: {
        total: 980000,
        last30Days: 145000,
        totalOrders: 13500,
        last30DaysOrders: 1800
      }
    },
    products: [
      { 
        id: 1004, 
        sales: 1785, 
        commission: '25%',
        earnings: 17850
      },
      { 
        id: 1006, 
        sales: 2134, 
        commission: '35%',
        earnings: 29876
      }
    ]
  },
  {
    id: 3,
    nickname: '穿搭博主Quinn',
    douyinId: '76543210988',
    avatar: 'https://via.placeholder.com/100x100?text=Quinn',
    fans: 2150000,
    likes: 19800000,
    works: 412,
    category: ['服装', '穿搭'],
    authStatus: 'expired',
    authTime: '2023-12-05',
    expireTime: '2024-05-05',
    statistics: {
      liveStreams: {
        total: 178,
        last30Days: 0,
        avgDuration: 150,
        avgViewers: 42000
      },
      videos: {
        total: 412,
        last30Days: 5,
        avgViews: 105000,
        avgLikes: 18600
      },
      sales: {
        total: 1720000,
        last30Days: 32000,
        totalOrders: 24300,
        last30DaysOrders: 450
      }
    },
    products: [
      { 
        id: 1001, 
        sales: 3456, 
        commission: '30%',
        earnings: 41472
      },
      { 
        id: 1002, 
        sales: 2987, 
        commission: '40%',
        earnings: 47792
      }
    ]
  },
  {
    id: 4,
    nickname: '健身达人强哥',
    douyinId: '65432109877',
    avatar: 'https://via.placeholder.com/100x100?text=强哥',
    fans: 1320000,
    likes: 10300000,
    works: 265,
    category: ['健身', '运动'],
    authStatus: 'pending',
    authTime: '2024-05-01',
    expireTime: null,
    statistics: {
      liveStreams: {
        total: 89,
        last30Days: 0,
        avgDuration: 75,
        avgViewers: 30000
      },
      videos: {
        total: 265,
        last30Days: 0,
        avgViews: 78000,
        avgLikes: 10500
      },
      sales: {
        total: 860000,
        last30Days: 0,
        totalOrders: 12400,
        last30DaysOrders: 0
      }
    },
    products: []
  }
];

// 抖音账号授权状态
export const authStatusMap = {
  active: {
    label: '已授权',
    color: '#00B578'
  },
  expired: {
    label: '已过期',
    color: '#FF5722'
  },
  pending: {
    label: '待审核',
    color: '#FFC107'
  }
};

// 抖音账号分类
export const accountCategories = [
  '美妆', '护肤', '服装', '穿搭', '数码', '家居', '生活', '母婴', '食品', '健身', '运动'
];

export default {
  douyinAccounts,
  authStatusMap,
  accountCategories
}; 