<template>
  <div class="platform-features">
    <div class="section-title">
      <h2>平台优势</h2>
      <p>高效连接商家与达人，打造一站式抖音推广服务</p>
    </div>
    
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="(feature, index) in featureList" :key="index">
        <div class="feature-card">
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PlatformFeatures',
  setup() {
    const featureList = ref([
      {
        title: '高效对接',
        description: '快速匹配商家与达人，实现资源高效对接，节省沟通成本',
        icon: 'el-icon-connection'
      },
      {
        title: '透明数据',
        description: '实时监控推广数据，透明展示转化效果，保障投放效果',
        icon: 'el-icon-data-line'
      },
      {
        title: '专业服务',
        description: '提供专业的抖音推广方案，优化投放策略，提升ROI',
        icon: 'el-icon-service'
      },
      {
        title: '丰富资源',
        description: '聚合千万级抖音达人资源，覆盖全行业、多领域',
        icon: 'el-icon-user-solid'
      },
      {
        title: '安全保障',
        description: '完善的资金托管机制，保障双方权益，交易更安心',
        icon: 'el-icon-lock'
      },
      {
        title: '一站式解决',
        description: '从产品选品、素材制作到达人投放的全流程服务',
        icon: 'el-icon-suitcase'
      }
    ])
    
    return {
      featureList
    }
  }
}
</script>

<style lang="scss" scoped>
.platform-features {
  padding: 40px 0;
  
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
  
  .feature-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 30px 20px;
    text-align: center;
    height: 100%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    margin-bottom: 20px;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      width: 70px;
      height: 70px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background-color: #fff0f3;
      display: flex;
      align-items: center;
      justify-content: center;
      
      i {
        font-size: 32px;
        color: #ff2c55;
      }
    }
    
    h3 {
      font-size: 20px;
      color: #333;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
  }
}
</style> 