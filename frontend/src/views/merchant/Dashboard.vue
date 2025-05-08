<template>
  <div class="merchant-dashboard">
    <MerchantLayout :breadcrumbs="[{title: '控制台', path: '/merchant'}]">
      <div class="dashboard-content">
        <!-- 数据概览卡片 -->
        <div class="data-overview">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="6">
              <el-card shadow="hover" class="data-card">
                <div class="data-card-content">
                  <div class="data-card-icon task-icon">
                    <i class="el-icon-s-order"></i>
                  </div>
                  <div class="data-card-info">
                    <div class="data-card-value">{{ dashboardData.taskCount }}</div>
                    <div class="data-card-title">发布任务</div>
                  </div>
                </div>
                <div class="data-card-footer">
                  <div class="trend up">
                    <i class="el-icon-top"></i>
                    <span>{{ dashboardData.taskGrowth }}%</span>
                  </div>
                  <div class="period">较上月</div>
                </div>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="6">
              <el-card shadow="hover" class="data-card">
                <div class="data-card-content">
                  <div class="data-card-icon talent-icon">
                    <i class="el-icon-user"></i>
                  </div>
                  <div class="data-card-info">
                    <div class="data-card-value">{{ dashboardData.talentCount }}</div>
                    <div class="data-card-title">合作达人</div>
                  </div>
                </div>
                <div class="data-card-footer">
                  <div class="trend up">
                    <i class="el-icon-top"></i>
                    <span>{{ dashboardData.talentGrowth }}%</span>
                  </div>
                  <div class="period">较上月</div>
                </div>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="6">
              <el-card shadow="hover" class="data-card">
                <div class="data-card-content">
                  <div class="data-card-icon exposure-icon">
                    <i class="el-icon-view"></i>
                  </div>
                  <div class="data-card-info">
                    <div class="data-card-value">{{ formatNumber(dashboardData.exposureCount) }}</div>
                    <div class="data-card-title">内容曝光</div>
                  </div>
                </div>
                <div class="data-card-footer">
                  <div class="trend up">
                    <i class="el-icon-top"></i>
                    <span>{{ dashboardData.exposureGrowth }}%</span>
                  </div>
                  <div class="period">较上周</div>
                </div>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="6">
              <el-card shadow="hover" class="data-card">
                <div class="data-card-content">
                  <div class="data-card-icon sales-icon">
                    <i class="el-icon-shopping-cart-full"></i>
                  </div>
                  <div class="data-card-info">
                    <div class="data-card-value">{{ formatCurrency(dashboardData.salesAmount) }}</div>
                    <div class="data-card-title">带货销售额</div>
                  </div>
                </div>
                <div class="data-card-footer">
                  <div class="trend up">
                    <i class="el-icon-top"></i>
                    <span>{{ dashboardData.salesGrowth }}%</span>
                  </div>
                  <div class="period">较上月</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 图表区域 -->
        <div class="chart-section">
          <el-row :gutter="20">
            <el-col :xs="24" :lg="16">
              <el-card shadow="hover" class="chart-card">
                <template #header>
                  <div class="chart-header">
                    <div class="chart-title">销售趋势</div>
                    <el-radio-group v-model="timeRange" size="small">
                      <el-radio-button label="week">本周</el-radio-button>
                      <el-radio-button label="month">本月</el-radio-button>
                      <el-radio-button label="year">全年</el-radio-button>
                    </el-radio-group>
                  </div>
                </template>
                <div class="chart-placeholder">
                  <!-- 这里应该放置销售趋势图表 -->
                  <div class="placeholder-text">销售趋势图表</div>
                </div>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :lg="8">
              <el-card shadow="hover" class="chart-card">
                <template #header>
                  <div class="chart-title">达人任务分布</div>
                </template>
                <div class="chart-placeholder">
                  <!-- 这里应该放置任务分布图表 -->
                  <div class="placeholder-text">任务分布图表</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 最近任务列表 -->
        <el-card shadow="hover" class="recent-tasks">
          <template #header>
            <div class="card-header">
              <span>最近任务</span>
              <el-button type="text" @click="viewAllTasks">查看全部</el-button>
            </div>
          </template>
          
          <el-table :data="recentTasks" style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="任务名称" min-width="200">
              <template #default="scope">
                <router-link :to="`/merchant/tasks/${scope.row.id}`" class="task-link">
                  {{ scope.row.title }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="120"></el-table-column>
            <el-table-column prop="budget" label="预算" width="120">
              <template #default="scope">
                ¥ {{ scope.row.budget }}
              </template>
            </el-table-column>
            <el-table-column prop="applied" label="已申请/总数" width="120">
              <template #default="scope">
                {{ scope.row.applied }}/{{ scope.row.total }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="text" size="small" @click="viewTaskDetail(scope.row)">查看</el-button>
                <el-button type="text" size="small" @click="editTask(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </MerchantLayout>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MerchantLayout from '@/components/merchant/MerchantLayout.vue'

export default {
  name: 'MerchantDashboard',
  components: {
    MerchantLayout
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const timeRange = ref('month')
    
    // 仪表盘数据
    const dashboardData = reactive({
      taskCount: 24,
      taskGrowth: 15,
      talentCount: 68,
      talentGrowth: 8,
      exposureCount: 1250000,
      exposureGrowth: 12,
      salesAmount: 158620,
      salesGrowth: 20
    })
    
    // 近期任务数据
    const recentTasks = ref([
      {
        id: 1,
        title: '抖音电商带货短视频推广',
        category: '短视频',
        budget: 5000,
        applied: 8,
        total: 20,
        status: '进行中'
      },
      {
        id: 2,
        title: '新品首发达人直播',
        category: '直播',
        budget: 8000,
        applied: 3,
        total: 5,
        status: '审核中'
      },
      {
        id: 3,
        title: '618活动爆品推广',
        category: '短视频',
        budget: 10000,
        applied: 12,
        total: 15,
        status: '已完成'
      },
      {
        id: 4,
        title: '新款服装搭配种草',
        category: '图文',
        budget: 3000,
        applied: 5,
        total: 10,
        status: '进行中'
      },
      {
        id: 5,
        title: '美妆产品测评',
        category: '短视频',
        budget: 6000,
        applied: 0,
        total: 8,
        status: '待发布'
      }
    ])
    
    // 格式化数字，添加千位分隔符
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    
    // 格式化货币
    const formatCurrency = (num) => {
      return '¥ ' + formatNumber(num)
    }
    
    // 获取状态标签类型
    const getStatusType = (status) => {
      const statusMap = {
        '进行中': 'success',
        '审核中': 'warning',
        '已完成': 'info',
        '待发布': 'danger'
      }
      return statusMap[status] || 'info'
    }
    
    // 查看所有任务
    const viewAllTasks = () => {
      router.push('/merchant/tasks')
    }
    
    // 查看任务详情
    const viewTaskDetail = (task) => {
      router.push(`/merchant/tasks/${task.id}`)
    }
    
    // 编辑任务
    const editTask = (task) => {
      router.push(`/merchant/tasks/${task.id}/edit`)
    }
    
    onMounted(() => {
      // 在实际应用中，这里会从API获取数据
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 800)
    })
    
    return {
      loading,
      timeRange,
      dashboardData,
      recentTasks,
      formatNumber,
      formatCurrency,
      getStatusType,
      viewAllTasks,
      viewTaskDetail,
      editTask
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-content {
  .data-overview {
    margin-bottom: 20px;
    
    .data-card {
      height: 100%;
      
      .data-card-content {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        .data-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-right: 15px;
          
          &.task-icon {
            background-color: rgba(255, 44, 85, 0.1);
            color: #ff2c55;
          }
          
          &.talent-icon {
            background-color: rgba(64, 158, 255, 0.1);
            color: #409eff;
          }
          
          &.exposure-icon {
            background-color: rgba(103, 194, 58, 0.1);
            color: #67c23a;
          }
          
          &.sales-icon {
            background-color: rgba(230, 162, 60, 0.1);
            color: #e6a23c;
          }
        }
        
        .data-card-info {
          .data-card-value {
            font-size: 22px;
            font-weight: 600;
            line-height: 1.2;
            color: #303133;
          }
          
          .data-card-title {
            font-size: 14px;
            color: #909399;
          }
        }
      }
      
      .data-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        
        .trend {
          display: flex;
          align-items: center;
          
          &.up {
            color: #f56c6c;
          }
          
          &.down {
            color: #67c23a;
          }
          
          i {
            margin-right: 2px;
          }
        }
        
        .period {
          color: #909399;
        }
      }
    }
  }
  
  .chart-section {
    margin-bottom: 20px;
    
    .chart-card {
      height: 350px;
      margin-bottom: 20px;
      
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .chart-title {
        font-size: 16px;
        font-weight: 500;
      }
      
      .chart-placeholder {
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f8f8;
        
        .placeholder-text {
          color: #909399;
          font-size: 14px;
        }
      }
    }
  }
  
  .recent-tasks {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      span {
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .task-link {
      color: #303133;
      text-decoration: none;
      
      &:hover {
        color: #ff2c55;
      }
    }
  }
}
</style> 