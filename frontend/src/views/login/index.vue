<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-logo">
        <img src="@/assets/images/logo.png" alt="吉米哥达人任务平台" />
        <h2>吉米哥达人任务平台</h2>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名/手机号/邮箱"
            type="text"
            auto-complete="on"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="密码"
            auto-complete="off"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
            <template #suffix>
              <el-icon @click="passwordVisible = !passwordVisible">
                <View v-if="passwordVisible" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <router-link to="/reset-password" class="forget-pwd">忘记密码？</router-link>
        </div>

        <el-button
          :loading="loading"
          type="primary"
          class="login-button"
          @click.prevent="handleLogin"
        >
          登录
        </el-button>

        <div class="register-link">
          还没有账号？ <router-link to="/register">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const passwordVisible = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  loading.value = true
  try {
    await store.dispatch('user/login', loginForm)
    ElMessage.success('登录成功')
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;

  .login-box {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .login-logo {
    text-align: center;
    margin-bottom: 30px;

    img {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }

    h2 {
      font-size: 24px;
      color: #333;
      margin: 0;
    }
  }

  .login-form {
    margin-top: 20px;
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .forget-pwd {
      color: #409eff;
      font-size: 14px;
      text-decoration: none;
    }
  }

  .login-button {
    width: 100%;
    margin-bottom: 20px;
  }

  .register-link {
    text-align: center;
    font-size: 14px;

    a {
      color: #409eff;
      text-decoration: none;
    }
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .login-container {
    padding: 20px;
    
    .login-box {
      width: 100%;
    }
  }
}
</style> 