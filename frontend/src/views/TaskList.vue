<template>
  <div class="task-list-container">
    <div class="page-header">
      <h1 class="page-title">任务广场</h1>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索任务"
          prefix-icon="el-icon-search"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
          class="search-input"
        ></el-input>
        <el-button type="primary" icon="el-icon-refresh" circle @click="refreshList"></el-button>
      </div>
    </div>

    <div class="filter-container">
      <el-card class="filter-card">
        <div class="filter-header">
          <span class="filter-title">筛选条件</span>
          <span class="clear-filter" @click="clearFilters">清空筛选</span>
        </div>
        <div class="filter-body">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="filter-item">
                <label class="filter-label">任务分类</label>
                <el-select v-model="filters.category" placeholder="选择分类" clearable class="filter-select">
                  <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="filter-item">
                <label class="filter-label">任务类型</label>
                <el-select v-model="filters.taskType" placeholder="选择类型" clearable class="filter-select">
                  <el-option
                    v-for="item in taskTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="filter-item">
                <label class="filter-label">价格区间</label>
                <div class="price-range">
                  <el-input-number v-model="filters.minPrice" :min="0" controls-position="right" placeholder="最低价" class="price-input"></el-input-number>
                  <span class="price-separator">-</span>
                  <el-input-number v-model="filters.maxPrice" :min="0" controls-position="right" placeholder="最高价" class="price-input"></el-input-number>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="filter-item">
                <label class="filter-label">发布时间</label>
                <el-select v-model="filters.timeRange" placeholder="选择时间" clearable class="filter-select">
                  <el-option
                    v-for="item in timeRangeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          
          <div class="filter-actions">
            <el-button type="primary" @click="handleSearch">筛选</el-button>
            <el-button @click="clearFilters">重置</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div class="task-list">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(task, index) in taskList" :key="index">
          <el-card class="task-card" shadow="hover" @click="goToTaskDetail(task.id)">
            <div class="task-header">
              <span class="task-category" :style="{ backgroundColor: getCategoryColor(task.category) }">
                {{ getCategoryName(task.category) }}
              </span>
              <span class="task-type">{{ getTaskTypeName(task.taskType) }}</span>
            </div>
            <h3 class="task-title">{{ task.title }}</h3>
            <div class="task-info">
              <div class="info-item">
                <i class="el-icon-money"></i>
                <span>{{ task.unitPrice }}元/单</span>
              </div>
              <div class="info-item">
                <i class="el-icon-tickets"></i>
                <span>剩余{{ task.totalCount - task.applyCount }}个</span>
              </div>
              <div class="info-item">
                <i class="el-icon-view"></i>
                <span>{{ task.viewCount }}人浏览</span>
              </div>
            </div>
            <div class="merchant-info">
              <img :src="task.merchantAvatar" class="merchant-avatar" alt="商家头像">
              <span class="merchant-name">{{ task.merchantName }}</span>
            </div>
            <div class="task-footer">
              <span class="publish-time">{{ formatTime(task.publishTime) }}</span>
              <el-button type="primary" size="small" @click.stop="applyTask(task.id)">立即申请</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="pagination-container" v-if="total > 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <div class="empty-data" v-if="taskList.length === 0">
      <el-empty description="暂无任务"></el-empty>
    </div>
  </div>
</template>

<script>
import { formatDate, getRelativeTime } from '@/utils/date'

export default {
  name: 'TaskList',
  data() {
    return {
      searchKeyword: '',
      filters: {
        category: '',
        taskType: '',
        minPrice: '',
        maxPrice: '',
        timeRange: ''
      },
      categoryOptions: [
        { value: 'beauty', label: '美妆个护' },
        { value: 'clothing', label: '服装' },
        { value: 'food', label: '食品' },
        { value: 'digital', label: '数码' },
        { value: 'home', label: '家居' },
        { value: 'other', label: '其他' }
      ],
      taskTypeOptions: [
        { value: 1, label: '短视频' },
        { value: 2, label: '直播' },
        { value: 3, label: '图文' }
      ],
      timeRangeOptions: [
        { value: 'today', label: '今天' },
        { value: 'week', label: '本周' },
        { value: 'month', label: '本月' }
      ],
      taskList: [
        {
          id: 1,
          title: '抖音短视频带货佛系推广',
          category: 'clothing',
          taskType: 1,
          unitPrice: 300,
          totalCount: 50,
          applyCount: 30,
          viewCount: 652,
          merchantName: '优衣库官方旗舰店',
          merchantAvatar: require('@/assets/default-avatar.png'),
          publishTime: new Date(Date.now() - 3600000 * 2) // 2小时前
        },
        {
          id: 2,
          title: '美妆产品直播测评，要求5万粉丝以上',
          category: 'beauty',
          taskType: 2,
          unitPrice: 800,
          totalCount: 20,
          applyCount: 5,
          viewCount: 342,
          merchantName: '花西子官方',
          merchantAvatar: require('@/assets/default-avatar.png'),
          publishTime: new Date(Date.now() - 3600000 * 24) // 1天前
        },
        {
          id: 3,
          title: '数码产品开箱测评，高质量视频',
          category: 'digital',
          taskType: 1,
          unitPrice: 500,
          totalCount: 30,
          applyCount: 12,
          viewCount: 478,
          merchantName: '科技数码专营店',
          merchantAvatar: require('@/assets/default-avatar.png'),
          publishTime: new Date(Date.now() - 3600000 * 48) // 2天前
        },
        {
          id: 4,
          title: '零食试吃达人，要求幽默风格',
          category: 'food',
          taskType: 3,
          unitPrice: 200,
          totalCount: 100,
          applyCount: 45,
          viewCount: 896,
          merchantName: '三只松鼠旗舰店',
          merchantAvatar: require('@/assets/default-avatar.png'),
          publishTime: new Date(Date.now() - 3600000 * 72) // 3天前
        },
        {
          id: 5,
          title: '家居产品展示，清新自然风格',
          category: 'home',
          taskType: 1,
          unitPrice: 350,
          totalCount: 40,
          applyCount: 18,
          viewCount: 263,
          merchantName: '宜家旗舰店',
          merchantAvatar: require('@/assets/default-avatar.png'),
          publishTime: new Date(Date.now() - 3600000 * 96) // 4天前
        },
        {
          id: 6,
          title: '国货彩妆试色，真实测评',
          category: 'beauty',
          taskType: 3,
          unitPrice: 280,
          totalCount: 60,
          applyCount: 38,
          viewCount: 527,
          merchantName: '完美日记',
          merchantAvatar: require('@/assets/default-avatar.png'),
          publishTime: new Date(Date.now() - 3600000 * 120) // 5天前
        }
      ],
      total: 6, // 模拟数据总数
      pageSize: 10,
      currentPage: 1
    }
  },
  methods: {
    handleSearch() {
      // 实际项目中这里会调用API进行搜索
      console.log('搜索关键词:', this.searchKeyword)
      console.log('筛选条件:', this.filters)
      // 模拟搜索请求
      this.$message.success('搜索成功！')
    },
    
    clearFilters() {
      this.filters = {
        category: '',
        taskType: '',
        minPrice: '',
        maxPrice: '',
        timeRange: ''
      }
      this.searchKeyword = ''
      this.refreshList()
    },
    
    refreshList() {
      // 实际项目中这里会刷新列表数据
      this.$message.success('刷新成功！')
    },
    
    handleCurrentChange(page) {
      this.currentPage = page
      // 实际项目中这里会请求新一页的数据
    },
    
    goToTaskDetail(taskId) {
      this.$router.push(`/task-detail/${taskId}`)
    },
    
    applyTask(taskId) {
      // 实际项目中这里会处理申请逻辑
      this.$message.success(`已申请任务 #${taskId}，请等待商家审核`)
    },
    
    getCategoryName(categoryValue) {
      const category = this.categoryOptions.find(item => item.value === categoryValue)
      return category ? category.label : '未知分类'
    },
    
    getTaskTypeName(typeValue) {
      const type = this.taskTypeOptions.find(item => item.value === typeValue)
      return type ? type.label : '未知类型'
    },
    
    getCategoryColor(categoryValue) {
      const colors = {
        beauty: '#FF5C8D',
        clothing: '#4A7AFF',
        food: '#FFB31A',
        digital: '#1ABC9C',
        home: '#9B59B6',
        other: '#95A5A6'
      }
      return colors[categoryValue] || '#95A5A6'
    },
    
    formatTime(date) {
      return getRelativeTime(date)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.task-list-container {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .page-title {
      font-size: $font-size-xl;
      font-weight: 500;
      color: $text-primary;
      margin: 0;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      
      .search-input {
        width: 240px;
        margin-right: 10px;
      }
    }
  }
  
  .filter-container {
    margin-bottom: 20px;
    
    .filter-card {
      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        .filter-title {
          font-weight: 500;
          color: $text-primary;
        }
        
        .clear-filter {
          font-size: $font-size-small;
          color: $primary-color;
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      .filter-body {
        .filter-item {
          margin-bottom: 15px;
          
          .filter-label {
            display: block;
            font-size: $font-size-small;
            color: $text-regular;
            margin-bottom: 5px;
          }
          
          .filter-select {
            width: 100%;
          }
          
          .price-range {
            display: flex;
            align-items: center;
            
            .price-input {
              width: calc(50% - 8px);
            }
            
            .price-separator {
              margin: 0 5px;
              color: $text-secondary;
            }
          }
        }
        
        .filter-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }
      }
    }
  }
  
  .task-list {
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
        margin-bottom: 10px;
        
        .task-category {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: $font-size-small;
          color: #fff;
        }
        
        .task-type {
          font-size: $font-size-small;
          color: $text-secondary;
        }
      }
      
      .task-title {
        font-size: $font-size-medium;
        color: $text-primary;
        margin: 10px 0;
        height: 44px;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .task-info {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 15px;
        
        .info-item {
          display: flex;
          align-items: center;
          font-size: $font-size-small;
          color: $text-regular;
          
          i {
            margin-right: 5px;
            color: $primary-color;
          }
        }
      }
      
      .merchant-info {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        
        .merchant-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 10px;
        }
        
        .merchant-name {
          font-size: $font-size-small;
          color: $text-regular;
        }
      }
      
      .task-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .publish-time {
          font-size: $font-size-small;
          color: $text-secondary;
        }
      }
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  
  .empty-data {
    padding: 40px 0;
  }
}

// 响应式样式
@media screen and (max-width: $breakpoint-md) {
  .task-list-container {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      
      .header-actions {
        margin-top: 10px;
        width: 100%;
        
        .search-input {
          width: calc(100% - 50px);
        }
      }
    }
  }
}
</style> 