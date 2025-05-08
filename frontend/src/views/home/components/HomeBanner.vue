<template>
  <div class="home-banner">
    <el-carousel height="500px" :interval="5000" arrow="always">
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <div class="banner-content" :style="{ backgroundImage: `url(${item.imageUrl})` }">
          <div class="banner-text">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <el-button type="primary" size="large" @click="handleAction(item)">{{ item.buttonText }}</el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeBanner',
  setup() {
    const router = useRouter()
    
    const bannerList = ref([
      {
        title: '抖音团长平台',
        description: '连接品牌商家与抖音达人，打造高效推广解决方案',
        buttonText: '立即发布任务',
        imageUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01v3iiHX1vnmv6Yj2nI_!!6000000006215-0-tps-2880-1070.jpg',
        action: '/merchant/create'
      },
      {
        title: '成为抖音推广达人',
        description: '加入我们的达人平台，接取优质任务，获取丰厚收益',
        buttonText: '成为达人',
        imageUrl: 'https://img.alicdn.com/imgextra/i2/O1CN01ftU9kJ28A9hZeV3Oa_!!6000000007891-0-tps-2880-1070.jpg',
        action: '/register?role=talent'
      },
      {
        title: '一站式抖音推广',
        description: '提供从选品、素材制作到达人投放的全链路服务',
        buttonText: '了解更多',
        imageUrl: 'https://img.alicdn.com/imgextra/i4/O1CN01xcCnHs1JnJOWyYQ3q_!!6000000001065-0-tps-2880-1070.jpg',
        action: '/about'
      }
    ])
    
    const handleAction = (item) => {
      router.push(item.action)
    }
    
    return {
      bannerList,
      handleAction
    }
  }
}
</script>

<style lang="scss" scoped>
.home-banner {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .banner-content {
    height: 100%;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    padding: 0 60px;
    
    .banner-text {
      max-width: 500px;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      
      h2 {
        font-size: 36px;
        margin-bottom: 16px;
      }
      
      p {
        font-size: 18px;
        margin-bottom: 24px;
        line-height: 1.5;
      }
    }
  }
}

:deep(.el-carousel__button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

:deep(.el-button--primary) {
  background-color: #ff2c55;
  border-color: #ff2c55;
  
  &:hover, &:focus {
    background-color: #ff4d6d;
    border-color: #ff4d6d;
  }
}
</style> 