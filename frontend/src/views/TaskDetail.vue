<template>
  <div class="task-detail-container">
    <div class="task-detail-header">
      <div class="header-content">
        <div class="back-button" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          <span>返回任务列表</span>
        </div>
        <h1 class="task-title">{{ task.title }}</h1>
        <div class="task-meta">
          <span class="task-id">任务ID: {{ task.id }}</span>
          <span class="task-status" :class="'status-' + task.status">
            {{ getStatusText(task.status) }}
          </span>
        </div>
      </div>
    </div>

    <div class="task-detail-content">
      <el-row :gutter="20">
        <el-col :xs="24" :md="16">
          <el-card class="info-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>任务信息</span>
              </div>
            </template>
            <div class="task-info">
              <div class="info-item">
                <span class="info-label">任务类型</span>
                <span class="info-value">{{ getTaskTypeName(task.task_type) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">任务分类</span>
                <span class="info-value">{{ getCategoryName(task.category) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">发布时间</span>
                <span class="info-value">{{ formatDate(task.created_at) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">截止时间</span>
                <span class="info-value">{{ formatDate(task.expire_at) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">任务单价</span>
                <span class="info-value price">{{ task.price }}元/单</span>
              </div>
              <div class="info-item">
                <span class="info-label">任务数量</span>
                <span class="info-value">共{{ task.max_apply }}个，已申请{{ task.apply_count }}个</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="task-description">
              <h3>任务描述</h3>
              <div class="description-content" v-html="task.description"></div>
            </div>

            <div class="task-requirements">
              <h3>任务要求</h3>
              <ul class="requirements-list">
                <li v-for="(req, index) in task.requirements" :key="index">
                  <i class="el-icon-check"></i>
                  <span>{{ req }}</span>
                </li>
              </ul>
            </div>

            <div class="material-preview" v-if="task.materials && task.materials.length > 0">
              <h3>任务素材</h3>
              <div class="material-list">
                <div class="material-item" v-for="(material, index) in task.materials" :key="index">
                  <img :src="material.url" alt="素材预览" class="material-image">
                  <span class="material-name">{{ material.name }}</span>
                </div>
              </div>
            </div>
          </el-card>

          <el-card class="progress-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>任务流程</span>
              </div>
            </template>
            <el-steps :active="3" finish-status="success" simple>
              <el-step title="申请任务" description="达人提交申请"></el-step>
              <el-step title="商家确认" description="商家审核申请"></el-step>
              <el-step title="任务执行" description="达人完成内容创作"></el-step>
              <el-step title="验收付款" description="商家验收并结算"></el-step>
            </el-steps>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :md="8">
          <el-card class="merchant-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>商家信息</span>
              </div>
            </template>
            <div class="merchant-info">
              <img :src="task.merchant_avatar" class="merchant-avatar" alt="商家头像">
              <h3 class="merchant-name">{{ task.merchant_name }}</h3>
              <div class="merchant-meta">
                <div class="meta-item">
                  <i class="el-icon-date"></i>
                  <span>{{ task.merchantJoinTime }} 加入</span>
                </div>
                <div class="meta-item">
                  <i class="el-icon-document"></i>
                  <span>已发布{{ task.merchantTaskCount }}个任务</span>
                </div>
              </div>
              <div class="merchant-rating">
                <span class="rating-label">商家评分</span>
                <el-rate v-model="task.merchant_rating" disabled show-score text-color="#ff9900"></el-rate>
              </div>
            </div>
          </el-card>

          <el-card class="action-card" shadow="never">
            <div class="action-content">
              <div class="application-status" v-if="hasApplied">
                <i class="el-icon-warning-outline"></i>
                <span>你已申请过该任务，请等待商家审核</span>
              </div>
              <el-button type="primary" class="apply-button" :disabled="hasApplied || !canApply" @click="applyTask">
                {{ getApplyButtonText() }}
              </el-button>
              <div class="action-tips">
                <p>
                  <i class="el-icon-info"></i>
                  <span>申请任务前，请确保你已了解任务要求</span>
                </p>
                <p>
                  <i class="el-icon-info"></i>
                  <span>与商家有任何沟通问题，请通过平台消息系统联系</span>
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date'
import axios from 'axios'

export default {
  name: 'TaskDetail',
  data() {
    return {
      taskId: null,
      task: {
        id: 0,
        title: '',
        status: 1,
        category: '',
        task_type: '',
        price: 0,
        max_apply: 0,
        apply_count: 0,
        created_at: '',
        expire_at: '',
        description: '',
        requirements: [],
        materials: [],
        merchant_name: '',
        merchant_avatar: '',
        merchant_rating: 4.5,
        // 下面是前端显示用的额外数据
        merchantJoinTime: '2021年5月',
        merchantTaskCount: 30,
      },
      hasApplied: false,
      canApply: true,
      isLoading: true
    }
  },
  created() {
    this.taskId = this.$route.params.id
    this.fetchTaskDetail()
  },
  methods: {
    fetchTaskDetail() {
      this.isLoading = true
      axios.get(`/api/tasks/${this.taskId}`)
        .then(response => {
          if (response.data.code === 200) {
            this.task = {
              ...response.data.data,
              // 补充一些前端展示用的数据
              merchantJoinTime: '2021年5月',
              merchantTaskCount: 30,
            }
          }
        })
        .catch(error => {
          console.error('获取任务详情失败', error)
          this.$message.error('获取任务详情失败')
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    goBack() {
      this.$router.go(-1)
    },
    
    getStatusText(status) {
      const statusMap = {
        0: '待审核',
        1: '进行中',
        2: '已结束',
        3: '已取消',
        'active': '进行中',
        'pending': '待审核',
        'completed': '已结束',
        'canceled': '已取消'
      }
      return statusMap[status] || '未知'
    },
    
    getCategoryName(category) {
      const categoryMap = {
        'beauty': '美妆个护',
        'clothing': '服装',
        'food': '食品',
        'digital': '数码',
        'home': '家居',
        'other': '其他',
        '短视频带货': '短视频带货',
        '直播带货': '直播带货'
      }
      return categoryMap[category] || category
    },
    
    getTaskTypeName(type) {
      const typeMap = {
        '短视频': '短视频',
        '直播': '直播',
        '图文': '图文',
        1: '短视频',
        2: '直播',
        3: '图文'
      }
      return typeMap[type] || '未知'
    },
    
    formatDate(date) {
      if (!date) return ''
      return formatDate(new Date(date), 'yyyy-MM-dd HH:mm')
    },
    
    getApplyButtonText() {
      if (this.hasApplied) return '已申请'
      if (!this.canApply) return '申请已截止'
      return '立即申请'
    },
    
    applyTask() {
      if (this.hasApplied || !this.canApply) return
      
      // 判断用户是否登录
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        return
      }
      
      // 实际项目中这里会调用API提交申请
      this.$message.success('申请提交成功，请等待商家审核')
      this.hasApplied = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.task-detail-container {
  .task-detail-header {
    background-color: #fff;
    padding: 20px;
    box-shadow: $box-shadow-light;
    margin-bottom: 20px;
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      
      .back-button {
        display: inline-flex;
        align-items: center;
        color: $text-regular;
        cursor: pointer;
        margin-bottom: 15px;
        
        i {
          margin-right: 5px;
        }
        
        &:hover {
          color: $primary-color;
        }
      }
      
      .task-title {
        font-size: $font-size-xxl;
        color: $text-primary;
        margin: 0 0 15px 0;
        font-weight: 500;
      }
      
      .task-meta {
        display: flex;
        align-items: center;
        
        .task-id {
          font-size: $font-size-small;
          color: $text-secondary;
          margin-right: 20px;
        }
        
        .task-status {
          font-size: $font-size-small;
          padding: 2px 8px;
          border-radius: 4px;
          
          &.status-active {
            background-color: #e1f3d8;
            color: #67c23a;
          }
          
          &.status-pending {
            background-color: #fdf6ec;
            color: #e6a23c;
          }
          
          &.status-completed {
            background-color: #f0f9eb;
            color: #67c23a;
          }
          
          &.status-cancelled {
            background-color: #f4f4f5;
            color: #909399;
          }
        }
      }
    }
  }
  
  .task-detail-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 40px;
    
    .info-card, .progress-card, .merchant-card, .action-card {
      margin-bottom: 20px;
      border-radius: $border-radius-base;
      
      .card-header {
        font-weight: 500;
        color: $text-primary;
      }
    }
    
    .task-info {
      margin-bottom: 20px;
      
      .info-item {
        display: flex;
        margin-bottom: 15px;
        
        .info-label {
          width: 80px;
          color: $text-secondary;
        }
        
        .info-value {
          color: $text-regular;
          
          &.price {
            color: $primary-color;
            font-weight: 500;
          }
        }
      }
    }
    
    .divider {
      height: 1px;
      background-color: $border-color;
      margin: 20px 0;
    }
    
    .task-description, .task-requirements {
      margin-bottom: 25px;
      
      h3 {
        font-size: $font-size-medium;
        color: $text-primary;
        margin-bottom: 15px;
        font-weight: 500;
      }
      
      .description-content {
        color: $text-regular;
        line-height: 1.6;
      }
    }
    
    .requirements-list {
      padding-left: 0;
      list-style: none;
      
      li {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        color: $text-regular;
        
        i {
          color: $success-color;
          margin-right: 10px;
          margin-top: 3px;
        }
      }
    }
    
    .material-preview {
      h3 {
        font-size: $font-size-medium;
        color: $text-primary;
        margin-bottom: 15px;
        font-weight: 500;
      }
      
      .material-list {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        
        .material-item {
          width: 100px;
          text-align: center;
          
          .material-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: $border-radius-small;
            margin-bottom: 5px;
          }
          
          .material-name {
            font-size: $font-size-small;
            color: $text-secondary;
            display: block;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    
    .merchant-info {
      text-align: center;
      padding: 10px 0;
      
      .merchant-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 15px;
      }
      
      .merchant-name {
        font-size: $font-size-medium;
        color: $text-primary;
        margin-bottom: 15px;
      }
      
      .merchant-meta {
        margin-bottom: 20px;
        
        .meta-item {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          color: $text-secondary;
          
          i {
            margin-right: 5px;
          }
        }
      }
      
      .merchant-rating {
        .rating-label {
          display: block;
          margin-bottom: 10px;
          color: $text-regular;
        }
      }
    }
    
    .action-content {
      padding: 10px 0;
      
      .application-status {
        background-color: #fdf6ec;
        padding: 10px 15px;
        border-radius: $border-radius-small;
        color: #e6a23c;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        
        i {
          margin-right: 5px;
        }
      }
      
      .apply-button {
        width: 100%;
        margin-bottom: 20px;
      }
      
      .action-tips {
        p {
          display: flex;
          align-items: flex-start;
          margin-bottom: 10px;
          font-size: $font-size-small;
          color: $text-secondary;
          
          i {
            margin-right: 5px;
            margin-top: 3px;
          }
        }
      }
    }
  }
}

// 响应式样式
@media screen and (max-width: $breakpoint-md) {
  .task-detail-container {
    .task-detail-header {
      .header-content {
        .task-title {
          font-size: $font-size-xl;
        }
      }
    }
  }
}
</style> 