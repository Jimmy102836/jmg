<template>
  <div class="banner">
    <el-carousel height="400px" indicator-position="outside" :interval="5000">
      <el-carousel-item v-for="(item, index) in bannerItems" :key="index">
        <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="banner-content">
            <h2 class="banner-title">{{ item.title }}</h2>
            <p class="banner-desc">{{ item.description }}</p>
            <router-link :to="item.link" class="banner-btn">{{ item.buttonText }}</router-link>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'HomeBanner',
  setup() {
    // 轮播图数据
    const bannerItems = [
      {
        title: '抖音电商短视频带货',
        description: '连接优质达人和品牌商家，打造高效电商带货生态',
        image: require('@/assets/banner1.jpg'),
        link: '/tasks',
        buttonText: '立即开始'
      },
      {
        title: '优质达人资源',
        description: '汇集抖音平台数万名优质达人，精准分类，快速匹配',
        image: require('@/assets/banner2.jpg'),
        link: '/talent',
        buttonText: '成为达人'
      },
      {
        title: '专业商家服务',
        description: '一站式品牌推广解决方案，提升产品销量和品牌知名度',
        image: require('@/assets/banner3.jpg'),
        link: '/merchant/register',
        buttonText: '商家入驻'
      }
    ]

    return {
      bannerItems
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  margin-top: 64px;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
  }
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: #fff;
  max-width: 500px;
  z-index: 1;
}

.banner-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.banner-desc {
  font-size: 1.1rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.banner-btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: #ff2c55;
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: darken(#ff2c55, 10%);
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 1.8rem;
  }
  
  .banner-desc {
    font-size: 1rem;
  }
  
  .banner-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>