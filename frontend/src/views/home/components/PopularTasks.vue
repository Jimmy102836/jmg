<template>
  <div class="popular-tasks">
    <div class="section-title">
      <h2>热门任务</h2>
      <p>为您精选优质带货任务，涵盖多个领域和行业</p>
    </div>
    
    <div class="task-filter">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
        <el-tab-pane v-for="category in categories" :key="category.value" :label="category.label" :name="category.value"></el-tab-pane>
      </el-tabs>
    </div>
    
    <el-row :gutter="20" class="task-list">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(task, index) in filteredTasks" :key="index">
        <el-card class="task-card" shadow="hover" @click="viewTaskDetail(task)">
          <div class="task-header">
            <el-tag :type="getTaskTypeClass(task.taskType)" size="small">{{ getTaskTypeName(task.taskType) }}</el-tag>
            <div class="task-budget">¥ {{ task.budget }}</div>
          </div>
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-desc">{{ task.description }}</div>
          <div class="task-meta">
            <div class="meta-item">
              <i class="el-icon-user"></i>
              <span>{{ task.applyCount }}/{{ task.totalCount }}</span>
            </div>
            <div class="meta-item">
              <i class="el-icon-time"></i>
              <span>{{ task.deadline }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="view-more">
      <el-button type="primary" plain @click="viewAllTasks">查看更多任务</el-button>
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
        category: 'fashion',
        taskType: '1',
        budget: 3000,
        applyCount: 5,
        totalCount: 10,
        deadline: '3天'
      },
      {
        id: 2,
        title: '美妆新品试用直播',
        description: '招募美妆达人进行新品彩妆试用直播，要求粉丝数10万以上，有较高的互动率。',
        category: 'beauty',
        taskType: '2',
        budget: 5000,
        applyCount: 3,
        totalCount: 5,
        deadline: '5天'
      },
      {
        id: 3,
        title: '零食开箱测评视频',
        description: '寻找美食达人进行零食开箱视频，展示产品包装和试吃体验，风格轻松有趣。',
        category: 'food',
        taskType: '1',
        budget: 2000,
        applyCount: 8,
        totalCount: 15,
        deadline: '7天'
      },
      {
        id: 4,
        title: '智能手表功能展示',
        description: '招募数码达人展示智能手表的功能和使用体验，要求内容专业、讲解清晰。',
        category: 'digital',
        taskType: '1',
        budget: 4000,
        applyCount: 2,
        totalCount: 8,
        deadline: '4天'
      },
      {
        id: 5,
        title: '家居收纳技巧分享',
        description: '寻找生活类达人分享使用我们收纳产品的技巧，展示收纳前后对比效果。',
        category: 'home',
        taskType: '3',
        budget: 1500,
        applyCount: 6,
        totalCount: 12,
        deadline: '6天'
      },
      {
        id: 6,
        title: '夏日防晒产品推荐',
        description: '招募护肤达人推荐我们的夏日防晒系列产品，介绍产品特点和使用方法。',
        category: 'beauty',
        taskType: '1',
        budget: 2500,
        applyCount: 4,
        totalCount: 10,
        deadline: '5天'
      },
      {
        id: 7,
        title: '新款运动鞋穿搭',
        description: '寻找时尚达人展示我们新款运动鞋的多种穿搭方案，风格时尚活力。',
        category: 'fashion',
        taskType: '3',
        budget: 2800,
        applyCount: 3,
        totalCount: 8,
        deadline: '4天'
      },
      {
        id: 8,
        title: '厨房小家电使用直播',
        description: '招募美食达人进行厨房小家电使用直播，展示产品功能和烹饪成果。',
        category: 'home',
        taskType: '2',
        budget: 3500,
        applyCount: 2,
        totalCount: 6,
        deadline: '7天'
      }
    ])
    
    // 根据分类筛选任务
    const filteredTasks = computed(() => {
      if (activeCategory.value === 'all') {
        return tasks.value
      } else {
        return tasks.value.filter(task => task.category === activeCategory.value)
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
        '1': 'success',
        '2': 'danger',
        '3': 'info'
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
    
    // 查看所有任务
    const viewAllTasks = () => {
      router.push('/tasks')
    }
    
    return {
      activeCategory,
      categories,
      filteredTasks,
      getTaskTypeName,
      getTaskTypeClass,
      handleCategoryChange,
      viewTaskDetail,
      viewAllTasks
    }
  }
}
</script>

<style lang="scss" scoped>
.popular-tasks {
  padding: 60px 0;
  
  .section-title {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 32px;
      color: #333;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 16px;
      color: #666;
    }
  }
  
  .task-filter {
    margin-bottom: 30px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    
    :deep(.el-tabs__nav) {
      display: flex;
      width: 100%;
      
      .el-tabs__item {
        flex: 1;
        text-align: center;
      }
    }
    
    :deep(.el-tabs__active-bar) {
      background-color: #ff2c55;
    }
    
    :deep(.el-tabs__item.is-active) {
      color: #ff2c55;
    }
  }
  
  .task-list {
    margin-bottom: 40px;
  }
  
  .task-card {
    height: 100%;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .task-budget {
        font-weight: 600;
        color: #ff2c55;
      }
    }
    
    .task-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .task-desc {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 15px;
      height: 63px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    
    .task-meta {
      display: flex;
      justify-content: space-between;
      
      .meta-item {
        display: flex;
        align-items: center;
        color: #999;
        font-size: 12px;
        
        i {
          margin-right: 5px;
        }
      }
    }
  }
  
  .view-more {
    text-align: center;
    
    :deep(.el-button--primary) {
      &.is-plain {
        color: #ff2c55;
        border-color: #ff2c55;
        
        &:hover, &:focus {
          background-color: #ff2c55;
          color: #fff;
        }
      }
    }
  }
}
</style> 