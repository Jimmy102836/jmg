<template>
  <div class="merchant-layout">
    <div class="sidebar">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/logo.png" alt="抖音团长平台" />
          <span>抖音团长平台</span>
        </router-link>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ff2c55"
        router
      >
        <el-menu-item index="/merchant">
          <i class="el-icon-s-home"></i>
          <span>控制台</span>
        </el-menu-item>
        
        <el-submenu index="tasks">
          <template #title>
            <i class="el-icon-s-order"></i>
            <span>任务管理</span>
          </template>
          <el-menu-item index="/merchant/tasks">任务列表</el-menu-item>
          <el-menu-item index="/merchant/tasks/create">创建任务</el-menu-item>
          <el-menu-item index="/merchant/tasks/applications">达人申请</el-menu-item>
        </el-submenu>
        
        <el-menu-item index="/merchant/materials">
          <i class="el-icon-picture"></i>
          <span>素材管理</span>
        </el-menu-item>
        
        <el-menu-item index="/merchant/settlements">
          <i class="el-icon-money"></i>
          <span>结算管理</span>
        </el-menu-item>
        
        <el-menu-item index="/merchant/statistics">
          <i class="el-icon-data-analysis"></i>
          <span>数据统计</span>
        </el-menu-item>
        
        <el-menu-item index="/merchant/settings">
          <i class="el-icon-setting"></i>
          <span>账户设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    
    <div class="main-content">
      <div class="header">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/merchant' }">商家中心</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="user-info">
          <el-dropdown>
            <div class="user-profile">
              <img :src="userAvatar" alt="用户头像" class="user-avatar" />
              <span class="username">{{ username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/merchant/profile">个人信息</router-link>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <div class="page-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'MerchantLayout',
  props: {
    breadcrumbs: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    const user = computed(() => store.getters['auth/user'])
    const username = computed(() => user.value ? user.value.username : '')
    const userAvatar = computed(() => {
      return user.value && user.value.avatar 
        ? user.value.avatar 
        : require('@/assets/default-avatar.png')
    })
    
    const activeMenu = computed(() => {
      return route.path
    })
    
    const handleLogout = async () => {
      await store.dispatch('auth/logout')
      router.push('/login')
    }
    
    return {
      username,
      userAvatar,
      activeMenu,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
.merchant-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background-color: #001529;
  color: #fff;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  
  .logo {
    height: 64px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #fff;
      
      img {
        height: 32px;
        margin-right: 10px;
      }
      
      span {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  
  .sidebar-menu {
    border-right: none;
    
    :deep(.el-submenu__title) {
      &:hover {
        background-color: #000c17;
      }
    }
    
    :deep(.el-menu-item) {
      &:hover {
        background-color: #000c17;
      }
      
      &.is-active {
        background-color: #000c17;
      }
    }
  }
}

.main-content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  
  .header {
    height: 64px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .breadcrumb {
      font-size: 14px;
    }
    
    .user-info {
      .user-profile {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .username {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
  
  .page-content {
    padding: 20px;
    background-color: #f0f2f5;
    min-height: calc(100vh - 64px);
  }
}
</style> 