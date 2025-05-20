<template>
  <header class="header">
    <!-- 顶部导航 -->
    <div class="top-header">
      <div class="container">
        <div class="logo-container">
          <router-link to="/" class="logo">
            <img src="../assets/images/logo/logo.jpg" alt="吉米哥达人任务平台" />
            <span class="site-name">吉米哥达人任务平台</span>
          </router-link>
        </div>
        
        <div class="nav-tabs">
          <div class="tab-item active">
            <router-link to="/">首页</router-link>
          </div>
          <div class="tab-item">
            <router-link to="/douyin">抖音商品</router-link>
          </div>
          <div class="tab-item">
            <router-link to="/tasks">榜单</router-link>
          </div>
          <div class="tab-item">
            <router-link to="/selected">选品库</router-link>
          </div>
          <div class="tab-item">
            <router-link to="/tools">工具<i class="el-icon-arrow-down"></i></router-link>
          </div>
          <div class="tab-item">
            <router-link to="/more">更多<i class="el-icon-arrow-down"></i></router-link>
          </div>
          
          <!-- 搜索框 -->
          <div class="search-container">
            <div class="search-box">
              <input 
                type="text" 
                placeholder="请输入商品关键字/标题/链接" 
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
              />
              <button class="search-btn" @click="handleSearch">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="user-container">
          <template v-if="isAuthenticated">
            <div class="user-tools">
              <div class="tool-item">
                <router-link to="/user/analysis">
                  <i class="el-icon-data-analysis"></i>
                  <span>收益分析</span>
                </router-link>
              </div>
              <div class="tool-item">
                <router-link to="/user/manage">
                  <i class="el-icon-s-order"></i>
                  <span>橱窗管理</span>
                </router-link>
              </div>
            </div>
            <el-dropdown>
              <div class="user-profile">
                <img :src="userAvatar" alt="用户头像" class="user-avatar" />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/user/profile">个人中心</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="isAdmin || isMerchant">
                    <router-link to="/merchant">商家控制台</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <div class="login-btn-wrap">
              <router-link to="/login" class="login-btn">登录/注册</router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 搜索区域和分类导航已移除 -->
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    const searchKeyword = ref('')

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const user = computed(() => store.getters['auth/user'])
    const username = computed(() => user.value ? user.value.username : '')
    const userAvatar = computed(() => {
      return user.value && user.value.avatar 
        ? user.value.avatar 
        : require('../assets/images/default-avatar.svg')
    })
    const isAdmin = computed(() => {
      return user.value && user.value.roles && user.value.roles.includes('admin')
    })
    const isMerchant = computed(() => {
      return user.value && user.value.roles && user.value.roles.includes('merchant')
    })

    const handleLogout = async () => {
      await store.dispatch('auth/logout')
      router.push('/')
    }
    
    const handleSearch = () => {
      if (searchKeyword.value.trim()) {
        router.push(`/search?keyword=${encodeURIComponent(searchKeyword.value.trim())}`)
      }
    }

    return {
      isAuthenticated,
      username,
      userAvatar,
      isAdmin,
      isMerchant,
      handleLogout,
      searchKeyword,
      handleSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  line-height: 1; /* 防止行高造成额外空间 */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.top-header {
  border-bottom: 1px solid #f0f0f0;
  
  .container {
    display: flex;
    align-items: center;
    height: 39px; /* 精确控制高度 */
  }
}

.logo-container {
  margin-right: 15px;
  display: flex;
  align-items: center;
  height: 100%;
  
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    
    img {
      height: 28px;
      width: auto;
      margin-right: 6px;
      border-radius: 3px;
    }
    
    .site-name {
      font-size: 16px;
      font-weight: bold;
      color: #000000;
    }
  }
}

.nav-tabs {
  display: flex;
  flex: 1;
  align-items: center;
  height: 100%;
  
  .tab-item {
    padding: 0 8px;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    
    a {
      color: #333;
      text-decoration: none;
      font-size: 13px;
      
      &:hover {
        color: #ff2c55;
      }
    }
    
    i {
      margin-left: 2px;
      font-size: 12px;
    }
    
    &.active {
      font-weight: bold;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background-color: #ff2c55;
        border-radius: 1px;
      }
      
      a {
        color: #ff2c55;
      }
    }
  }
}

.user-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
  height: 100%;
  
  .user-tools {
    display: flex;
    gap: 10px;
    
    .tool-item {
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        color: #666;
        font-size: 12px;
        
        i {
          font-size: 16px;
          margin-bottom: 1px;
        }
        
        &:hover {
          color: #ff2c55;
        }
      }
    }
  }
  
  .user-profile {
    cursor: pointer;
    
    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
  }
  
  .login-btn-wrap {
    .login-btn {
      border: 1px solid #ff2c55;
      border-radius: 14px;
      padding: 2px 10px;
      color: #ff2c55;
      font-size: 12px;
      text-decoration: none;
      
      &:hover {
        background-color: #ff2c55;
        color: #fff;
      }
    }
  }
}

/* 搜索框 */
.search-container {
  margin-left: auto;
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 100%;
  
  .search-box {
    width: 300px;
    height: 30px;
    border: 1px solid #ff2c55;
    border-radius: 30px;
    overflow: hidden;
    display: flex;
    
    input {
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      padding: 0 12px;
      font-size: 13px;
      
      &::placeholder {
        color: #999;
        font-size: 12px;
      }
    }
    
    .search-btn {
      width: 36px;
      height: 100%;
      background-color: #ff2c55;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      
      .search-icon {
        width: 18px;
        height: 18px;
        color: white;
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
      }
      
      &:hover {
        background-color: darken(#ff2c55, 5%);
      }
    }
  }
}
</style>