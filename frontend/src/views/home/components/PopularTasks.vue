<template>
  <div class="popular-tasks">
    <div class="section-header">
      <h2 class="section-title">热门任务</h2>
      <router-link to="/tasks" class="view-more">查看全部<i class="el-icon-arrow-right"></i></router-link>
    </div>
    
    <div class="task-filter">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange" type="card">
        <el-tab-pane v-for="category in categories" :key="category.value" :label="category.label" :name="category.value"></el-tab-pane>
      </el-tabs>
    </div>
    
    <div class="task-list">
      <div class="task-card" v-for="(task, index) in filteredTasks" :key="index" @click="viewTaskDetail(task)">
        <div class="card-header">
          <div class="card-tags">
            <span class="card-tag" :class="getTaskTypeClass(task.taskType)">{{ getTaskTypeName(task.taskType) }}</span>
            <span class="card-category">{{ task.category }}</span>
          </div>
          <div class="card-deadline">
            <i class="el-icon-time"></i> 剩余 {{ task.deadline }}
          </div>
        </div>
        <div class="card-title">{{ task.title }}</div>
        <div class="card-desc">{{ task.description }}</div>
        <div class="card-stats">
          <div class="stat-item">
            <i class="el-icon-user"></i>
            <span>已申请：{{ task.applyCount }}/{{ task.totalCount }}</span>
          </div>
          <div class="stat-item">
            <i class="el-icon-pie-chart"></i>
            <span>完成率：{{ Math.floor(Math.random() * 30) + 70 }}%</span>
          </div>
        </div>
        <div class="card-price">
          <div class="price-label">任务佣金</div>
          <div class="price-amount">¥ <span class="price-num">{{ task.budget }}</span></div>
        </div>
        <div class="card-footer">
          <div class="merchant-info">
            <img :src="task.merchantAvatar || 'https://via.placeholder.com/30'" class="merchant-avatar">
            <span class="merchant-name">{{ task.merchantName }}</span>
          </div>
          <el-button size="small" type="danger">立即申请</el-button>
        </div>
      </div>
    </div>
    
    <div class="view-more-row">
      <el-button type="primary" plain @click="$router.push('/tasks')">查看更多任务 <i class="el-icon-arrow-right"></i></el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PopularTasks',
  setup() {
    const router = useRouter()
    const activeCategory = ref('all')
    
    // 分类数据
    const categories = [
      { value: 'all', label: '全部' },
      { value: 'fashion', label: '服装时尚' },
      { value: 'beauty', label: '美妆护肤' },
      { value: 'food', label: '食品零食' },
      { value: 'digital', label: '数码家电' },
      { value: 'home', label: '家居百货' }
    ]
    
    // 任务数据
    const tasks = ref([
      {
        id: 1,
        title: '夏季新款连衣裙推广',
        description: '寻找时尚达人推广我们的夏季新款连衣裙系列，风格清新活泼，适合18-28岁年轻女性。',
        category: '服装时尚',
        taskType: '1',
        budget: 3000,
        applyCount: 5,
        totalCount: 10,
        deadline: '3天',
        merchantName: '优衣库官方',
        merchantAvatar: 'https://via.placeholder.com/30'
      },
      {
        id: 2,
        title: '美妆新品试用直播',
        description: '招募美妆达人进行新品彩妆试用直播，要求粉丝数10万以上，有较高的互动率。',
        category: '美妆护肤',
        taskType: '2',
        budget: 5000,
        applyCount: 3,
        totalCount: 5,
        deadline: '5天',
        merchantName: '花西子官方',
        merchantAvatar: 'https://via.placeholder.com/30'
      },
      {
        id: 3,
        title: '零食开箱测评视频',
        description: '寻找美食达人进行零食开箱视频，展示产品包装和试吃体验，风格轻松有趣。',
        category: '食品零食',
        taskType: '1',
        budget: 2000,
        applyCount: 8,
        totalCount: 15,
        deadline: '7天',
        merchantName: '三只松鼠',
        merchantAvatar: 'https://via.placeholder.com/30'
      },
      {
        id: 4,
        title: '智能手表功能展示',
        description: '招募数码达人展示智能手表的功能和使用体验，要求内容专业、讲解清晰。',
        category: '数码家电',
        taskType: '1',
        budget: 4000,
        applyCount: 2,
        totalCount: 8,
        deadline: '4天',
        merchantName: '小米官方',
        merchantAvatar: 'https://via.placeholder.com/30'
      },
      {
        id: 5,
        title: '家居收纳技巧分享',
        description: '寻找生活类达人分享使用我们收纳产品的技巧，展示收纳前后对比效果。',
        category: '家居百货',
        taskType: '3',
        budget: 1500,
        applyCount: 6,
        totalCount: 12,
        deadline: '6天',
        merchantName: '宜家家居',
        merchantAvatar: 'https://via.placeholder.com/30'
      },
      {
        id: 6,
        title: '夏日防晒产品推荐',
        description: '招募护肤达人推荐我们的夏日防晒系列产品，介绍产品特点和使用方法。',
        category: '美妆护肤',
        taskType: '1',
        budget: 2500,
        applyCount: 4,
        totalCount: 10,
        deadline: '5天',
        merchantName: '资生堂官方',
        merchantAvatar: 'https://via.placeholder.com/30'
      }
    ])
    
    // 根据分类筛选任务
    const filteredTasks = computed(() => {
      if (activeCategory.value === 'all') {
        return tasks.value
      } else {
        return tasks.value.filter(task => {
          const categoryMap = {
            'fashion': '服装时尚',
            'beauty': '美妆护肤',
            'food': '食品零食',
            'digital': '数码家电',
            'home': '家居百货'
          };
          return task.category === categoryMap[activeCategory.value];
        })
      }
    })
    
    // 获取任务类型名称
    const getTaskTypeName = (type) => {
      const typeMap = {
        '1': '短视频',
        '2': '直播',
        '3': '图文'
      }
      return typeMap[type] || '未知'
    }
    
    // 获取任务类型样式
    const getTaskTypeClass = (type) => {
      const classMap = {
        '1': 'video',
        '2': 'live',
        '3': 'article'
      }
      return classMap[type] || ''
    }
    
    // 处理分类切换
    const handleCategoryChange = (tab) => {
      activeCategory.value = tab.paneName
    }
    
    // 查看任务详情
    const viewTaskDetail = (task) => {
      router.push(`/tasks/${task.id}`)
    }
    
    return {
      activeCategory,
      categories,
      filteredTasks,
      getTaskTypeName,
      getTaskTypeClass,
      handleCategoryChange,
      viewTaskDetail
    }
  }
}
</script>

<style lang="scss" scoped>
.popular-tasks {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  padding: 25px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    position: relative;
    padding-left: 15px;
    
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 18px;
      background-color: #ff2c55;
      border-radius: 2px;
    }
  }
  
  .view-more {
    color: #666;
    font-size: 14px;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    
    i {
      margin-left: 5px;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: #ff2c55;
      
      i {
        transform: translateX(3px);
      }
    }
  }
}

.task-filter {
  margin-bottom: 20px;
  
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
  
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  
  :deep(.el-tabs__active-bar) {
    background-color: #ff2c55;
  }
  
  :deep(.el-tabs__item) {
    font-size: 14px;
    color: #666;
    height: 40px;
    line-height: 40px;
    
    &.is-active {
      color: #ff2c55;
      font-weight: 500;
    }
    
    &:hover {
      color: #ff2c55;
    }
  }
  
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
    border-bottom-color: #ff2c55;
  }
}

.task-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.task-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .card-tag {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #fff;
      
      &.video {
        background-color: #52c41a;
      }
      
      &.live {
        background-color: #ff2c55;
      }
      
      &.article {
        background-color: #1890ff;
      }
    }
    
    .card-category {
      font-size: 12px;
      color: #666;
      padding: 2px 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .card-deadline {
      font-size: 12px;
      color: #999;
      
      i {
        margin-right: 5px;
      }
    }
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    line-height: 1.4;
  }
  
  .card-desc {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 15px;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .card-stats {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    
    .stat-item {
      display: flex;
      align-items: center;
      margin-right: 15px;
      margin-bottom: 5px;
      font-size: 12px;
      color: #999;
      
      i {
        margin-right: 5px;
        font-size: 14px;
      }
    }
  }
  
  .card-price {
    margin-bottom: 15px;
    padding: 10px;
    background-color: #fff9f9;
    border-radius: 4px;
    
    .price-label {
      font-size: 12px;
      color: #999;
      margin-bottom: 5px;
    }
    
    .price-amount {
      color: #ff2c55;
      font-size: 14px;
      
      .price-num {
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f5f5f5;
    padding-top: 15px;
    
    .merchant-info {
      display: flex;
      align-items: center;
      
      .merchant-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 8px;
      }
      
      .merchant-name {
        font-size: 12px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
      }
    }
  }
}

.view-more-row {
  text-align: center;
  margin-top: 10px;
  
  .el-button {
    padding: 10px 30px;
    
    i {
      margin-left: 5px;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      i {
        transform: translateX(3px);
      }
    }
  }
}
</style> 