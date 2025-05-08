<template>
  <section class="task-list">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">热门任务</h2>
        <p class="section-desc">精选优质带货任务，助力达人创收，商家增效</p>
      </div>
      
      <div class="category-tabs">
        <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
          <el-tab-pane v-for="category in categories" :key="category.id" :label="category.name" :name="category.id.toString()">
            <div v-if="loading" class="loading-container">
              <el-skeleton :rows="3" animated />
              <el-skeleton :rows="3" animated />
              <el-skeleton :rows="3" animated />
            </div>
            <div v-else>
              <div class="task-grid">
                <div class="task-card" v-for="task in tasks" :key="task.id" @click="viewTaskDetail(task.id)">
                  <div class="task-card-header">
                    <span class="task-category">{{ task.category.name }}</span>
                    <span class="task-price">¥{{ task.unit_price }} <small>/ 单价</small></span>
                  </div>
                  <h3 class="task-title">{{ task.title }}</h3>
                  <p class="task-desc">{{ task.description }}</p>
                  <div class="task-info">
                    <div class="task-merchant">
                      <img :src="task.merchant.avatar" alt="商家头像" class="merchant-avatar" />
                      <span class="merchant-name">{{ task.merchant.username }}</span>
                    </div>
                    <div class="task-stats">
                      <div class="stat-item">
                        <i class="el-icon-connection"></i>
                        <span>{{ task.apply_count }}/{{ task.total_count }}</span>
                      </div>
                      <div class="stat-item">
                        <i class="el-icon-timer"></i>
                        <span>{{ formatRemainDays(task.end_time) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="view-more">
                <router-link to="/tasks" class="view-more-btn">查看更多任务</router-link>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeTaskList',
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(true)
    const activeCategory = ref('0')
    
    // 模拟数据，实际项目中应该从API获取
    const categories = ref([
      { id: 0, name: '全部' },
      { id: 1, name: '短视频' },
      { id: 2, name: '直播' },
      { id: 3, name: '图文' }
    ])
    
    const mockTasks = [
      {
        id: 1,
        title: '美妆产品推广',
        description: '推广XX品牌美妆产品，要求5万+粉丝，发布15-30秒短视频',
        category: { id: 1, name: '短视频' },
        task_type: 1,
        unit_price: 300.00,
        total_count: 50,
        apply_count: 25,
        start_time: '2023-05-01 10:00:00',
        end_time: '2023-06-30 10:00:00',
        merchant: {
          id: 1,
          username: '美妆品牌官方',
          avatar: 'https://via.placeholder.com/40'
        }
      },
      {
        id: 2,
        title: '家居用品直播带货',
        description: '直播推广家居产品系列，要求直播间粉丝3万+，直播时长不少于1小时',
        category: { id: 2, name: '直播' },
        task_type: 2,
        unit_price: 1000.00,
        total_count: 20,
        apply_count: 8,
        start_time: '2023-05-10 10:00:00',
        end_time: '2023-06-15 10:00:00',
        merchant: {
          id: 2,
          username: '家居生活馆',
          avatar: 'https://via.placeholder.com/40'
        }
      },
      {
        id: 3,
        title: '食品试吃测评',
        description: '网红零食测评，要求美食博主，粉丝1万+，发布1分钟以上测评视频',
        category: { id: 1, name: '短视频' },
        task_type: 1,
        unit_price: 200.00,
        total_count: 30,
        apply_count: 18,
        start_time: '2023-05-05 10:00:00',
        end_time: '2023-06-20 10:00:00',
        merchant: {
          id: 3,
          username: '美食工坊',
          avatar: 'https://via.placeholder.com/40'
        }
      },
      {
        id: 4,
        title: '旅行装备推广',
        description: '旅行装备测评推广，适合旅行博主，以图文形式发布使用体验',
        category: { id: 3, name: '图文' },
        task_type: 3,
        unit_price: 150.00,
        total_count: 40,
        apply_count: 12,
        start_time: '2023-05-15 10:00:00',
        end_time: '2023-07-10 10:00:00',
        merchant: {
          id: 4,
          username: '户外探险家',
          avatar: 'https://via.placeholder.com/40'
        }
      }
    ]
    
    const tasks = ref(mockTasks)
    
    const filteredTasks = computed(() => {
      if (activeCategory.value === '0') {
        return mockTasks.slice(0, 8) // 限制显示8个任务
      } else {
        return mockTasks
          .filter(task => task.category.id.toString() === activeCategory.value)
          .slice(0, 8)
      }
    })
    
    // 获取任务和类别数据
    onMounted(async () => {
      try {
        // 实际项目中应该从API获取数据
        // await store.dispatch('task/fetchCategories')
        // await store.dispatch('task/fetchTasks', { limit: 8 })
        
        // 模拟加载
        setTimeout(() => {
          loading.value = false
        }, 1000)
      } catch (error) {
        console.error('加载任务数据失败', error)
        loading.value = false
      }
    })
    
    // 切换任务类别
    const handleCategoryChange = (tab) => {
      loading.value = true
      setTimeout(() => {
        tasks.value = filteredTasks.value
        loading.value = false
      }, 500)
    }
    
    // 查看任务详情
    const viewTaskDetail = (taskId) => {
      router.push(`/tasks/${taskId}`)
    }
    
    // 格式化剩余天数
    const formatRemainDays = (endTimeStr) => {
      const endTime = new Date(endTimeStr)
      const now = new Date()
      const diffTime = endTime - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 0) {
        return '已结束'
      } else if (diffDays === 1) {
        return '剩1天'
      } else {
        return `剩${diffDays}天`
      }
    }
    
    return {
      categories,
      tasks,
      loading,
      activeCategory,
      handleCategoryChange,
      viewTaskDetail,
      formatRemainDays
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  padding: 80px 0;
  background-color: #f8f8f8;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  
  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 15px;
  }
  
  .section-desc {
    font-size: 1.1rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }
}

.loading-container {
  padding: 20px;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.task-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .task-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .task-category {
      background-color: #f0f0f0;
      color: #666;
      font-size: 0.8rem;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .task-price {
      color: #ff2c55;
      font-weight: 700;
      font-size: 1.2rem;
      
      small {
        font-size: 0.7rem;
        font-weight: 400;
        color: #999;
      }
    }
  }
  
  .task-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .task-desc {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 15px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .task-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .task-merchant {
      display: flex;
      align-items: center;
      
      .merchant-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 6px;
      }
      
      .merchant-name {
        font-size: 0.85rem;
        color: #666;
      }
    }
    
    .task-stats {
      display: flex;
      
      .stat-item {
        display: flex;
        align-items: center;
        margin-left: 10px;
        font-size: 0.8rem;
        color: #999;
        
        i {
          margin-right: 4px;
        }
      }
    }
  }
}

.view-more {
  text-align: center;
  margin-top: 40px;
  
  .view-more-btn {
    display: inline-block;
    padding: 10px 30px;
    background-color: #fff;
    color: #ff2c55;
    border: 1px solid #ff2c55;
    border-radius: 4px;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s;
    
    &:hover {
      background-color: #ff2c55;
      color: #fff;
    }
  }
}

@media (max-width: 1200px) {
  .task-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .task-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .task-grid {
    grid-template-columns: 1fr;
  }
}
</style> 