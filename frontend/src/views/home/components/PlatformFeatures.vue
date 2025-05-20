<template>
  <div class="platform-features section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">平台优势</h2>
        <p class="section-desc">从选品、推广到变现，为商家和达人提供一站式解决方案</p>
      </div>
      
      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="index" class="feature-item">
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlatformFeatures',
  data() {
    return {
      features: [
        {
          icon: 'el-icon-data-analysis',
          title: '精准匹配',
          description: '利用智能算法，精准匹配商家产品与最适合的抖音达人，提高转化率和ROI'
        },
        {
          icon: 'el-icon-money',
          title: '灵活合作',
          description: '支持多种合作模式，包括CPS、CPM、定制化推广方案，满足不同营销需求'
        },
        {
          icon: 'el-icon-document',
          title: '透明数据',
          description: '实时监控推广效果，展示详细数据报表，让每一笔投入都清晰可见'
        },
        {
          icon: 'el-icon-user',
          title: '达人资源',
          description: '平台汇集海量优质达人资源，覆盖各类目，满足不同推广需求'
        },
        {
          icon: 'el-icon-picture',
          title: '素材支持',
          description: '提供专业素材支持，帮助达人创作出更具吸引力的推广内容'
        },
        {
          icon: 'el-icon-service',
          title: '一对一服务',
          description: '为重点商家和达人提供专属客户经理，解决合作过程中的各类问题'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.platform-features {
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
    font-size: 2.2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 15px;
    position: relative;
    display: inline-block;
    
    &:after {
      content: "";
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background-color: #ff2c55;
    }
  }
  
  .section-desc {
    font-size: 1.1rem;
    color: #666;
    max-width: 600px;
    margin: 25px auto 0;
    line-height: 1.6;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.feature-item {
  background-color: #f9f9f9;
  padding: 40px 30px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    
    .feature-icon {
      background-color: #ff2c55;
      color: #fff;
      transform: rotateY(180deg);
    }
  }
}

.feature-icon {
  width: 80px;
  height: 80px;
  background-color: rgba(255, 44, 85, 0.1);
  color: #ff2c55;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 25px;
  transition: all 0.5s ease;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.feature-desc {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}
</style> 