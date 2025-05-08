<template>
  <div class="admin-dashboard">
    <AdminLayout :breadcrumbs="[{title: '控制台', path: '/admin/dashboard'}]">
      <!-- 数据概览卡片 -->
      <el-row :gutter="20" class="data-overview">
        <el-col :span="6" v-for="(item, index) in overviewData" :key="index">
          <el-card shadow="hover" class="overview-card">
            <div class="card-content">
              <div class="card-icon" :style="{ backgroundColor: item.color }">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">{{ item.title }}</div>
                <div class="card-value">{{ item.value }}</div>
                <div class="card-trend" :class="item.trend > 0 ? 'up' : 'down'">
                  {{ Math.abs(item.trend) }}% {{ item.trend > 0 ? '增长' : '下降' }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 图表区域 -->
      <el-row :gutter="20" class="chart-section">
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>任务数据趋势</span>
                <el-radio-group v-model="taskChartType" size="small">
                  <el-radio-button label="week">本周</el-radio-button>
                  <el-radio-button label="month">本月</el-radio-button>
                  <el-radio-button label="year">全年</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="chart-container" ref="taskChartRef"></div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>任务类型分布</span>
              </div>
            </template>
            <div class="chart-container" ref="taskTypeChartRef"></div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 最新动态 -->
      <el-row :gutter="20" class="activity-section">
        <el-col :span="12">
          <el-card class="activity-card">
            <template #header>
              <div class="card-header">
                <span>最新任务</span>
                <el-button type="text">查看全部</el-button>
              </div>
            </template>
            <el-table :data="latestTasks" style="width: 100%">
              <el-table-column prop="title" label="任务名称" />
              <el-table-column prop="merchant" label="发布商家" />
              <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="发布时间" />
            </el-table>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card class="activity-card">
            <template #header>
              <div class="card-header">
                <span>系统通知</span>
                <el-button type="text">查看全部</el-button>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :type="activity.type"
                :color="activity.color"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>
    </AdminLayout>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts'
import {
  User,
  Goods,
  Money,
  Star
} from '@element-plus/icons-vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

export default {
  name: 'AdminDashboard',
  components: {
    AdminLayout,
    User,
    Goods,
    Money,
    Star
  },
  setup() {
    const store = useStore()
    const taskChartRef = ref(null)
    const taskTypeChartRef = ref(null)
    const taskChartType = ref('week')
    let taskChart = null
    let taskTypeChart = null

    // 数据概览
    const overviewData = computed(() => {
      const data = store.getters['stats/overview']
      return [
        {
          title: '总用户数',
          value: data.totalUsers || 0,
          trend: data.userTrend || 0,
          icon: 'User',
          color: '#409EFF'
        },
        {
          title: '总任务数',
          value: data.totalTasks || 0,
          trend: data.taskTrend || 0,
          icon: 'Goods',
          color: '#67C23A'
        },
        {
          title: '总交易额',
          value: data.totalAmount ? `￥${data.totalAmount}` : '￥0',
          trend: data.amountTrend || 0,
          icon: 'Money',
          color: '#E6A23C'
        },
        {
          title: '好评率',
          value: data.positiveRate ? `${data.positiveRate}%` : '0%',
          trend: data.rateTrend || 0,
          icon: 'Star',
          color: '#F56C6C'
        }
      ]
    })

    // 最新任务
    const latestTasks = computed(() => store.getters['stats/latestTasks'] || [])
    // 系统通知
    const activities = computed(() => store.getters['stats/activities'] || [])

    // 初始化任务趋势图表
    const initTaskChart = (trendData) => {
      taskChart = echarts.init(taskChartRef.value)
      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['发布任务', '完成任务', '进行中'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: trendData.xAxis || [] },
        yAxis: { type: 'value' },
        series: [
          { name: '发布任务', type: 'line', data: trendData.publish || [] },
          { name: '完成任务', type: 'line', data: trendData.complete || [] },
          { name: '进行中', type: 'line', data: trendData.running || [] }
        ]
      }
      taskChart.setOption(option)
    }

    // 初始化任务类型分布图表
    const initTaskTypeChart = (typeData) => {
      taskTypeChart = echarts.init(taskTypeChartRef.value)
      const option = {
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            name: '任务类型',
            type: 'pie',
            radius: '50%',
            data: typeData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      taskTypeChart.setOption(option)
    }

    // 获取状态标签类型
    const getStatusType = (status) => {
      const statusMap = {
        '进行中': 'primary',
        '待审核': 'warning',
        '已完成': 'success',
        '已取消': 'info'
      }
      return statusMap[status] || 'info'
    }

    // 加载所有统计数据
    const loadStats = async () => {
      await Promise.all([
        store.dispatch('stats/fetchOverview'),
        store.dispatch('stats/fetchLatestTasks'),
        store.dispatch('stats/fetchActivities')
      ])
      const trendData = await store.dispatch('stats/fetchTaskTrend', taskChartType.value)
      initTaskChart(trendData)
      const typeData = await store.dispatch('stats/fetchTaskType')
      initTaskTypeChart(typeData)
    }

    // 监听时间类型切换
    watch(taskChartType, async (val) => {
      const trendData = await store.dispatch('stats/fetchTaskTrend', val)
      initTaskChart(trendData)
    })

    // 监听窗口大小变化
    const handleResize = () => {
      taskChart?.resize()
      taskTypeChart?.resize()
    }

    onMounted(() => {
      loadStats()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      taskChart?.dispose()
      taskTypeChart?.dispose()
    })

    return {
      overviewData,
      latestTasks,
      activities,
      taskChartRef,
      taskTypeChartRef,
      taskChartType,
      getStatusType
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-dashboard {
  .data-overview {
    margin-bottom: 20px;
    
    .overview-card {
      .card-content {
        display: flex;
        align-items: center;
        
        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          
          .el-icon {
            font-size: 24px;
            color: white;
          }
        }
        
        .card-info {
          flex: 1;
          
          .card-title {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }
          
          .card-value {
            font-size: 24px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 8px;
          }
          
          .card-trend {
            font-size: 12px;
            
            &.up {
              color: #67C23A;
            }
            
            &.down {
              color: #F56C6C;
            }
          }
        }
      }
    }
  }
  
  .chart-section {
    margin-bottom: 20px;
    
    .chart-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .chart-container {
        height: 300px;
      }
    }
  }
  
  .activity-section {
    .activity-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style> 