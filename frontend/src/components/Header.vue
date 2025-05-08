<template>
  <header class="header">
    <div class="header-container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <img src="../assets/logo.png" alt="抖音团长平台" />
          <span class="site-name">抖音团长平台</span>
        </router-link>
      </div>
      <div class="nav-container">
        <ul class="nav-menu">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/tasks">任务中心</router-link></li>
          <li><router-link to="/merchant">商家中心</router-link></li>
          <li><router-link to="/about">关于我们</router-link></li>
        </ul>
      </div>
      <div class="user-container">
        <template v-if="isAuthenticated">
          <el-dropdown>
            <div class="user-profile">
              <img :src="userAvatar" alt="用户头像" class="user-avatar" />
              <span class="username">{{ username }}</span>
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
          <router-link to="/login" class="login-btn">登录</router-link>
          <router-link to="/register" class="register-btn">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const user = computed(() => store.getters['auth/user'])
    const username = computed(() => user.value ? user.value.username : '')
    const userAvatar = computed(() => {
      return user.value && user.value.avatar 
        ? user.value.avatar 
        : require('../assets/default-avatar.png')
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

    return {
      isAuthenticated,
      username,
      userAvatar,
      isAdmin,
      isMerchant,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.logo-container {
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    
    img {
      height: 36px;
      margin-right: 10px;
    }
    
    .site-name {
      font-size: 18px;
      font-weight: bold;
      color: #ff2c55;
    }
  }
}

.nav-container {
  .nav-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    
    li {
      margin: 0 15px;
      
      a {
        display: block;
        color: #333;
        font-size: 16px;
        text-decoration: none;
        padding: 5px 0;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #ff2c55;
          transition: width 0.3s;
        }
        
        &:hover, &.router-link-active {
          color: #ff2c55;
          
          &::after {
            width: 100%;
          }
        }
      }
    }
  }
}

.user-container {
  display: flex;
  align-items: center;
  
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
  
  .login-btn, .register-btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.3s;
  }
  
  .login-btn {
    color: #ff2c55;
    margin-right: 10px;
    
    &:hover {
      background-color: rgba(255, 44, 85, 0.1);
    }
  }
  
  .register-btn {
    background-color: #ff2c55;
    color: #fff;
    
    &:hover {
      background-color: darken(#ff2c55, 10%);
    }
  }
}
</style>