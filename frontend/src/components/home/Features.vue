<template>
  <section class="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">平台特点</h2>
        <p class="section-desc">吉米哥达人任务平台为您提供全方位的短视频营销服务</p>
      </div>
      <div class="features-grid">
        <div class="feature-item" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeFeatures',
  setup() {
    const features = [
      {
        title: '优质达人资源',
        description: '平台汇集大量优质内容达人，涵盖各行各业，满足不同推广需求',
        icon: 'el-icon-user'
      },
      {
        title: '高效匹配机制',
        description: '智能匹配算法，根据商家需求和达人特点，快速找到最合适的合作伙伴',
        icon: 'el-icon-connection'
      },
      {
        title: '透明交易流程',
        description: '任务发布、申请、执行、验收、结算全流程透明化，保障双方权益',
        icon: 'el-icon-document'
      },
      {
        title: '专业数据分析',
        description: '提供详细的推广效果数据分析，助力商家优化营销策略',
        icon: 'el-icon-data-analysis'
      },
      {
        title: '安全支付系统',
        description: '平台担保交易，确保资金安全，服务满意后再结算',
        icon: 'el-icon-wallet'
      },
      {
        title: '全天候客户服务',
        description: '专业客服团队，为商家和达人提供全天候支持和帮助',
        icon: 'el-icon-service'
      }
    ]

    return {
      features
    }
  }
}
</script>

<style lang="scss" scoped>
.features {
  padding: 80px 0;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    font-size: 2.5rem;
    color: #ff2c55;
    margin-bottom: 20px;
  }
  
  .feature-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
  }
  
  .feature-desc {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.6;
  }
}

@media (max-width: 992px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-item {
    padding: 25px;
  }
}
</style> 