<template>
  <div class="admin-layout">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
          <span v-show="!isCollapse">抖音团长平台</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="isCollapse"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#ff2c55"
          router
        >
          <el-menu-item index="/admin">
            <el-icon><HomeFilled /></el-icon>
            <template #title>控制台</template>
          </el-menu-item>
          
          <el-sub-menu index="user">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/merchants">商家管理</el-menu-item>
            <el-menu-item index="/admin/talents">达人管理</el-menu-item>
            <el-menu-item index="/admin/members">会员等级</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="task">
            <template #title>
              <el-icon><List /></el-icon>
              <span>任务管理</span>
            </template>
            <el-menu-item index="/admin/tasks">任务列表</el-menu-item>
            <el-menu-item index="/admin/task-categories">任务分类</el-menu-item>
            <el-menu-item index="/admin/task-applications">申请审核</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="material">
            <template #title>
              <el-icon><Picture /></el-icon>
              <span>素材管理</span>
            </template>
            <el-menu-item index="/admin/materials">素材列表</el-menu-item>
            <el-menu-item index="/admin/material-review">素材审核</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="finance">
            <template #title>
              <el-icon><Money /></el-icon>
              <span>财务管理</span>
            </template>
            <el-menu-item index="/admin/finance/settlement">结算记录</el-menu-item>
            <el-menu-item index="/admin/finance/withdraw">提现申请</el-menu-item>
            <el-menu-item index="/admin/finance/commission">佣金设置</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="content">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>内容管理</span>
            </template>
            <el-menu-item index="/admin/content/banner">首页轮播</el-menu-item>
            <el-menu-item index="/admin/content/notice">平台公告</el-menu-item>
            <el-menu-item index="/admin/content/help">帮助中心</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/admin/system/admin">管理员</el-menu-item>
            <el-menu-item index="/admin/system/role">角色权限</el-menu-item>
            <el-menu-item index="/admin/system/log">操作日志</el-menu-item>
            <el-menu-item index="/admin/system/config">系统配置</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-container class="main-container">
        <!-- 顶部导航 -->
        <el-header class="header">
          <div class="header-left">
            <el-icon 
              class="collapse-btn"
              @click="toggleSidebar"
            >
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path">
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown trigger="click">
              <div class="user-info">
                <el-avatar :size="32" :src="userAvatar"></el-avatar>
                <span>{{ userName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人资料</el-dropdown-item>
                  <el-dropdown-item>修改密码</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <!-- 内容区域 -->
        <el-main class="main-content">
          <div class="content-wrapper">
            <slot></slot>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  HomeFilled,
  User,
  List,
  Picture,
  Money,
  Document,
  Setting,
  Expand,
  Fold,
  ArrowDown
} from '@element-plus/icons-vue'

export default {
  name: 'AdminLayout',
  components: {
    HomeFilled,
    User,
    List,
    Picture,
    Money,
    Document,
    Setting,
    Expand,
    Fold,
    ArrowDown
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ title: '首页', path: '/admin' }]
    }
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const isCollapse = ref(false)
    
    // 用户信息
    const userName = computed(() => store.state.auth.user?.name || '管理员')
    const userAvatar = computed(() => store.state.auth.user?.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
    
    // 当前激活菜单
    const activeMenu = computed(() => {
      return route.path
    })
    
    // 切换侧边栏折叠状态
    const toggleSidebar = () => {
      isCollapse.value = !isCollapse.value
    }
    
    // 退出登录
    const handleLogout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    }
    
    return {
      isCollapse,
      activeMenu,
      userName,
      userAvatar,
      toggleSidebar,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-layout {
  height: 100vh;
  
  .layout-container {
    height: 100%;
  }
  
  .sidebar {
    background-color: #001529;
    transition: width 0.3s;
    overflow-x: hidden;
    
    .logo {
      height: 60px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      color: white;
      background-color: #001529;
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }
      
      span {
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
      }
    }
    
    .sidebar-menu {
      border-right: none;
      
      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        &:hover {
          background-color: #1890ff !important;
        }
      }
      
      :deep(.el-menu-item.is-active) {
        background-color: #1890ff !important;
      }
    }
  }
  
  .main-container {
    background-color: #f0f2f5;
    
    .header {
      background-color: white;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      
      .header-left {
        display: flex;
        align-items: center;
        
        .collapse-btn {
          font-size: 20px;
          cursor: pointer;
          margin-right: 20px;
          
          &:hover {
            color: #1890ff;
          }
        }
      }
      
      .header-right {
        .user-info {
          display: flex;
          align-items: center;
          cursor: pointer;
          
          span {
            margin: 0 8px;
          }
        }
      }
    }
    
    .main-content {
      padding: 20px;
      
      .content-wrapper {
        background-color: white;
        padding: 24px;
        border-radius: 4px;
        min-height: calc(100vh - 140px);
      }
    }
  }
}
</style> 