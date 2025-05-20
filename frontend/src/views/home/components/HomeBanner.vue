<template>
  <div class="home-banner">
    <el-carousel height="350px" :interval="5000" arrow="always" indicator-position="none">
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <div class="banner-slide" :style="{ backgroundImage: `url(${item.imageUrl})` }">
          <div class="banner-overlay"></div>
          <div class="container">
            <div class="banner-content">
              <h2 class="banner-title">{{ item.title }}</h2>
              <p class="banner-desc">{{ item.description }}</p>
              <el-button type="primary" size="large" class="banner-btn" @click="handleAction(item)">{{ item.buttonText }}</el-button>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    
    <!-- 搜索条 -->
    <div class="search-bar">
      <div class="container">
        <div class="search-wrapper">
          <div class="search-tabs">
            <div 
              v-for="(tab, index) in searchTabs" 
              :key="index" 
              class="tab-item" 
              :class="{ active: activeTab === tab.value }"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
            </div>
          </div>
          <div class="search-input">
            <el-input 
              v-model="searchText" 
              :placeholder="getPlaceholderText()" 
              prefix-icon="el-icon-search"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button 
                  type="primary"
                  @click="handleSearch"
                >
                  搜索
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="hot-keywords">
            <span>热门搜索：</span>
            <a 
              href="javascript:;" 
              v-for="(keyword, index) in hotKeywords" 
              :key="index"
              @click="quickSearch(keyword)"
            >
              {{ keyword }}
            </a>
          </div>
        </div>
      </div>
    </div>
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
        title: '吉米哥达人任务平台',
        description: '连接品牌商家与优质达人，打造高效推广解决方案',
        buttonText: '立即发布任务',
        imageUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01v3iiHX1vnmv6Yj2nI_!!6000000006215-0-tps-2880-1070.jpg',
        action: '/merchant/create'
      },
      {
        title: '成为内容推广达人',
        description: '加入我们的达人平台，接取优质任务，获取丰厚收益',
        buttonText: '成为达人',
        imageUrl: 'https://img.alicdn.com/imgextra/i2/O1CN01ftU9kJ28A9hZeV3Oa_!!6000000007891-0-tps-2880-1070.jpg',
        action: '/register?role=talent'
      },
      {
        title: '一站式内容推广',
        description: '提供从选品、素材制作到达人投放的全链路服务',
        buttonText: '了解更多',
        imageUrl: 'https://img.alicdn.com/imgextra/i4/O1CN01xcCnHs1JnJOWyYQ3q_!!6000000001065-0-tps-2880-1070.jpg',
        action: '/about'
      }
    ])
    
    const hotKeywords = ref(['爆款好物', '带货任务', '美妆达人', '短视频推广', '直播合作'])
    const searchText = ref('')
    const activeTab = ref('task')
    
    const searchTabs = [
      { label: '任务', value: 'task' },
      { label: '商品', value: 'product' },
      { label: '达人', value: 'talent' },
      { label: '商家', value: 'merchant' }
    ]
    
    const getPlaceholderText = () => {
      const placeholders = {
        task: '搜索任务名称、类型或关键词',
        product: '搜索商品名称、品牌或类目',
        talent: '搜索达人名称、擅长领域或粉丝数',
        merchant: '搜索商家名称、行业或品牌'
      }
      return placeholders[activeTab.value] || '请输入搜索关键词'
    }
    
    const handleAction = (item) => {
      router.push(item.action)
    }
    
    const handleSearch = () => {
      if (!searchText.value.trim()) {
        return
      }
      
      const routes = {
        task: `/search/tasks?keyword=${encodeURIComponent(searchText.value)}`,
        product: `/search/products?keyword=${encodeURIComponent(searchText.value)}`,
        talent: `/search/talents?keyword=${encodeURIComponent(searchText.value)}`,
        merchant: `/search/merchants?keyword=${encodeURIComponent(searchText.value)}`
      }
      
      router.push(routes[activeTab.value] || '/search')
    }
    
    const quickSearch = (keyword) => {
      searchText.value = keyword
      handleSearch()
    }
    
    return {
      bannerList,
      hotKeywords,
      searchText,
      activeTab,
      searchTabs,
      handleAction,
      handleSearch,
      quickSearch,
      getPlaceholderText
    }
  }
}
</script>

<style lang="scss" scoped>
.home-banner {
  width: 100%;
  position: relative;
  margin-bottom: 60px;
}

.banner-slide {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  height: 100%;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  text-align: left;
  color: #fff;
  z-index: 2;
  width: 50%;
  max-width: 600px;
  
  .banner-title {
    font-size: 2.4rem;
    font-weight: 700;
    margin: 0 0 15px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  .banner-desc {
    font-size: 1.2rem;
    line-height: 1.5;
    margin-bottom: 20px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    opacity: 0.9;
  }
  
  .banner-btn {
    padding: 12px 30px;
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: 4px;
    background-color: #ff2c55;
    border-color: #ff2c55;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: darken(#ff2c55, 10%);
      border-color: darken(#ff2c55, 10%);
      box-shadow: 0 5px 15px rgba(255, 44, 85, 0.3);
    }
  }
}

.search-bar {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  z-index: 10;
  
  .search-wrapper {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
    
    .search-tabs {
      display: flex;
      margin-bottom: 15px;
      
      .tab-item {
        padding: 8px 20px;
        margin-right: 10px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        
        &.active {
          background-color: #ff2c55;
          color: #fff;
        }
        
        &:not(.active):hover {
          background-color: #f7f7f7;
        }
      }
    }
    
    .search-input {
      margin-bottom: 15px;
      
      :deep(.el-input__inner) {
        height: 50px;
        font-size: 15px;
      }
      
      :deep(.el-input-group__append) {
        background-color: #ff2c55;
        border-color: #ff2c55;
        color: #fff;
        padding: 0 20px;
        
        &:hover {
          background-color: darken(#ff2c55, 10%);
          border-color: darken(#ff2c55, 10%);
        }
        
        .el-button {
          color: #fff;
          border: none;
          background: transparent;
          font-size: 15px;
          padding: 0;
          
          &:hover, &:focus {
            color: #fff;
            background: transparent;
            border: none;
          }
        }
      }
    }
    
    .hot-keywords {
      font-size: 13px;
      color: #999;
      
      span {
        margin-right: 10px;
      }
      
      a {
        color: #666;
        margin-right: 15px;
        text-decoration: none;
        transition: all 0.3s ease;
        
        &:hover {
          color: #ff2c55;
        }
      }
    }
  }
}

:deep(.el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  
  i {
    font-size: 18px;
    color: #333;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
}

@media (max-width: 992px) {
  .banner-content {
    width: 70%;
    
    .banner-title {
      font-size: 2.2rem;
    }
    
    .banner-desc {
      font-size: 1.2rem;
    }
  }
}

@media (max-width: 768px) {
  .home-banner {
    margin-bottom: 100px;
  }
  
  .banner-content {
    width: 90%;
    text-align: center;
    left: 50%;
    transform: translate(-50%, -50%);
    
    .banner-title {
      font-size: 2rem;
    }
    
    .banner-desc {
      font-size: 1rem;
    }
  }
  
  .search-bar {
    position: static;
    margin-top: -20px;
    margin-bottom: 20px;
    
    .search-wrapper {
      .search-tabs {
        flex-wrap: wrap;
        justify-content: center;
        
        .tab-item {
          margin-bottom: 10px;
        }
      }
      
      .hot-keywords {
        display: flex;
        flex-wrap: wrap;
        
        span {
          width: 100%;
          margin-bottom: 5px;
        }
        
        a {
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style> 