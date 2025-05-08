<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <div class="platform-info">
          <img src="@/assets/logo.png" alt="平台logo" class="logo">
          <h1 class="title">抖音团长平台</h1>
          <p class="slogan">连接商家与达人，打造高效短视频营销生态</p>
          <div class="features">
            <div class="feature-item">
              <i class="el-icon-user"></i>
              <span>海量优质达人资源</span>
            </div>
            <div class="feature-item">
              <i class="el-icon-s-order"></i>
              <span>透明的任务管理流程</span>
            </div>
            <div class="feature-item">
              <i class="el-icon-data-analysis"></i>
              <span>实时数据分析与报告</span>
            </div>
            <div class="feature-item">
              <i class="el-icon-money"></i>
              <span>安全可靠的支付系统</span>
            </div>
          </div>
        </div>
      </div>

      <div class="login-right">
        <div class="login-form-container">
          <h2 class="form-title">账号登录</h2>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="用户名/手机号" 
                prefix-icon="el-icon-user"
                clearable>
              </el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                placeholder="密码" 
                prefix-icon="el-icon-lock"
                show-password
                @keyup.enter="handleLogin">
              </el-input>
            </el-form-item>
            
            <el-form-item class="remember-row">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <a href="javascript:;" class="forget-link" @click="toForgotPassword">忘记密码？</a>
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                class="login-button" 
                :loading="loading" 
                @click="handleLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>

          <div class="other-login">
            <p class="other-title">其他登录方式</p>
            <div class="other-ways">
              <i class="el-icon-mobile-phone" @click="handleOtherLogin('mobile')"></i>
              <i class="el-icon-chat-dot-square" @click="handleOtherLogin('wechat')"></i>
            </div>
          </div>

          <div class="register-link">
            <span>还没有账号？</span>
            <router-link to="/register">立即注册</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('请输入用户名或手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          
          // 连接真实API
          this.$axios.post('/api/auth/login', {
            username: this.loginForm.username,
            password: this.loginForm.password
          })
          .then(response => {
            if (response.data.code === 200) {
              this.$message.success('登录成功')
              // 存储登录信息
              const { token, user } = response.data.data
              localStorage.setItem('token', token)
              localStorage.setItem('user', JSON.stringify(user))
              
              // 根据用户角色跳转到不同页面
              const role = user.role
              let redirectPath = this.redirect
              
              if (!redirectPath) {
                if (role === 'admin') {
                  redirectPath = '/admin'
                } else if (role === 'merchant') {
                  redirectPath = '/merchant'
                } else {
                  redirectPath = '/'
                }
              }
              
              this.$router.push({ path: redirectPath })
            } else {
              this.$message.error(response.data.message || '登录失败')
            }
          })
          .catch(error => {
            console.error('登录失败:', error)
            this.$message.error('登录失败: ' + (error.response?.data?.message || '服务器连接错误'))
          })
          .finally(() => {
            this.loading = false
          })
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
    toForgotPassword() {
      this.$message.info('忘记密码功能开发中')
    },
    handleOtherLogin(type) {
      if (type === 'mobile') {
        this.$message.info('手机号登录功能开发中')
      } else if (type === 'wechat') {
        this.$message.info('微信登录功能开发中')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $background-color;
  
  .login-box {
    width: 900px;
    height: 500px;
    background-color: #fff;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-base;
    display: flex;
    overflow: hidden;
    
    .login-left {
      flex: 1;
      background-color: $primary-color;
      color: #fff;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .platform-info {
        .logo {
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
        }
        
        .title {
          font-size: $font-size-xxl;
          margin-bottom: 16px;
          font-weight: 500;
        }
        
        .slogan {
          font-size: $font-size-medium;
          margin-bottom: 40px;
          opacity: 0.9;
          line-height: 1.6;
        }
        
        .features {
          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            
            i {
              margin-right: 10px;
              font-size: 18px;
            }
            
            span {
              font-size: $font-size-base;
            }
          }
        }
      }
    }
    
    .login-right {
      flex: 1;
      padding: 40px;
      display: flex;
      align-items: center;
      
      .login-form-container {
        width: 100%;
        
        .form-title {
          font-size: $font-size-xl;
          color: $text-primary;
          margin-bottom: 30px;
          font-weight: 500;
          text-align: center;
        }
        
        .login-form {
          .remember-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .forget-link {
              color: $primary-color;
              font-size: $font-size-small;
              text-decoration: none;
              
              &:hover {
                text-decoration: underline;
              }
            }
          }
          
          .login-button {
            width: 100%;
            background-color: $primary-color;
            border-color: $primary-color;
            
            &:hover, &:focus {
              background-color: $primary-light;
              border-color: $primary-light;
            }
          }
        }
        
        .other-login {
          margin-top: 20px;
          text-align: center;
          
          .other-title {
            font-size: $font-size-small;
            color: $text-secondary;
            position: relative;
            
            &::before, &::after {
              content: '';
              position: absolute;
              top: 50%;
              width: 60px;
              height: 1px;
              background-color: $border-color;
            }
            
            &::before {
              left: 40px;
            }
            
            &::after {
              right: 40px;
            }
          }
          
          .other-ways {
            margin-top: 15px;
            
            i {
              font-size: 24px;
              color: $text-regular;
              margin: 0 10px;
              cursor: pointer;
              transition: all 0.3s;
              
              &:hover {
                color: $primary-color;
              }
            }
          }
        }
        
        .register-link {
          margin-top: 20px;
          text-align: center;
          font-size: $font-size-base;
          
          span {
            color: $text-regular;
          }
          
          a {
            color: $primary-color;
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}

// 响应式样式
@media screen and (max-width: $breakpoint-md) {
  .login-container {
    .login-box {
      width: 90%;
      height: auto;
      flex-direction: column;
      
      .login-left, .login-right {
        width: 100%;
        padding: 30px;
      }
      
      .login-left {
        padding-bottom: 40px;
      }
    }
  }
}
</style> 