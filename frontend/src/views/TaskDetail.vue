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
                <span class="info-value">{{ getTaskTypeName(task.taskType) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">任务分类</span>
                <span class="info-value">{{ getCategoryName(task.category) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">发布时间</span>
                <span class="info-value">{{ formatDate(task.publishTime) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">截止时间</span>
                <span class="info-value">{{ formatDate(task.deadline) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">任务单价</span>
                <span class="info-value price">{{ task.unitPrice }}元/单</span>
              </div>
              <div class="info-item">
                <span class="info-label">任务数量</span>
                <span class="info-value">共{{ task.totalCount }}个，已申请{{ task.applyCount }}个</span>
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
              <img :src="task.merchantAvatar" class="merchant-avatar" alt="商家头像">
              <h3 class="merchant-name">{{ task.merchantName }}</h3>
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
                <el-rate v-model="task.merchantRating" disabled show-score text-color="#ff9900"></el-rate>
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

export default {
  name: 'TaskDetail',
  data() {
    return {
      taskId: null,
      task: {
        id: 1,
        title: '抖音短视频带货佛系推广',
        status: 'active',
        category: 'clothing',
        taskType: 1,
        unitPrice: 300,
        totalCount: 50,
        applyCount: 30,
        publishTime: new Date(Date.now() - 3600000 * 48), // 2天前
        deadline: new Date(Date.now() + 3600000 * 24 * 7), // 7天后
        description: `<p>这是一个非常适合达人进行佛系带货的任务，不需要刻意营销，只需要自然地将产品融入到你的日常视频当中。</p>
        <p>我们是优衣库官方旗舰店，本次推广的是2023春季新款系列，风格简约时尚，非常适合日常穿搭。</p>
        <p>希望能够找到气质与我们产品风格相符的达人合作，共同打造优质内容。</p>`,
        requirements: [
          '粉丝数1万以上，内容风格日常、穿搭类为主',
          '视频时长不少于60秒，产品展示时间不少于15秒',
          '视频发布后保留7天以上，不得提前删除',
          '视频上传后需提供数据截图，包括播放量、点赞、评论等',
          '禁止使用低俗、暴力等违规内容'
        ],
        materials: [
          { name: '产品图片1.jpg', url: 'https://via.placeholder.com/300x300' },
          { name: '产品图片2.jpg', url: 'https://via.placeholder.com/300x300' },
          { name: '产品介绍.docx', url: '#' }
        ],
        merchantName: '优衣库官方旗舰店',
        merchantAvatar: require('@/assets/default-avatar.png'),
        merchantJoinTime: '2021年5月',
        merchantTaskCount: 128,
        merchantRating: 4.8
      },
      hasApplied: false,
      canApply: true,
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
      ]
    }
  },
  created() {
    this.taskId = this.$route.params.id
    // 实际项目中这里会根据taskId请求任务详情
    // this.fetchTaskDetail(this.taskId)
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    fetchTaskDetail(id) {
      // 实际项目中这里会调用API获取任务详情
      console.log('获取任务详情，ID:', id)
    },
    
    getStatusText(status) {
      const statusMap = {
        draft: '草稿',
        pending: '待审核',
        active: '进行中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || '未知状态'
    },
    
    getCategoryName(categoryValue) {
      const category = this.categoryOptions.find(item => item.value === categoryValue)
      return category ? category.label : '未知分类'
    },
    
    getTaskTypeName(typeValue) {
      const type = this.taskTypeOptions.find(item => item.value === typeValue)
      return type ? type.label : '未知类型'
    },
    
    formatDate(date) {
      return formatDate(date, 'YYYY-MM-DD HH:mm')
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