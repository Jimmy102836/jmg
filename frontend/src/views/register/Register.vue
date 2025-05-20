<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <img src="@/assets/logo.png" alt="平台logo" class="logo">
        <h1 class="title">注册吉米哥达人任务平台账号</h1>
      </div>

      <el-steps :active="active" finish-status="success" simple class="register-steps">
        <el-step title="填写账号信息"></el-step>
        <el-step title="完善个人资料"></el-step>
        <el-step title="注册成功"></el-step>
      </el-steps>

      <div class="form-container">
        <!-- 步骤1：账号信息 -->
        <el-form 
          v-if="active === 0" 
          ref="accountForm" 
          :model="accountForm" 
          :rules="accountRules" 
          label-width="100px"
          class="register-form"
        >
          <el-form-item label="用户类型" prop="userType">
            <el-radio-group v-model="accountForm.userType">
              <el-radio :label="1">商家</el-radio>
              <el-radio :label="2">达人</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="accountForm.phone" placeholder="请输入手机号码" clearable></el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="verifyCode">
            <div class="verify-code-container">
              <el-input v-model="accountForm.verifyCode" placeholder="请输入验证码" clearable></el-input>
              <el-button 
                type="primary" 
                plain 
                :disabled="isCodeSending" 
                @click="sendVerifyCode"
              >
                {{ codeButtonText }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="设置密码" prop="password">
            <el-input v-model="accountForm.password" type="password" placeholder="请设置登录密码" show-password></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="accountForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="nextStep">下一步</el-button>
            <el-button @click="toLogin">返回登录</el-button>
          </el-form-item>
        </el-form>

        <!-- 步骤2：个人资料 -->
        <el-form 
          v-else-if="active === 1" 
          ref="profileForm" 
          :model="profileForm" 
          :rules="profileRules" 
          label-width="100px"
          class="register-form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="profileForm.username" placeholder="请设置用户名" clearable></el-input>
          </el-form-item>

          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="profileForm.realName" placeholder="请输入真实姓名" clearable></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="profileForm.email" placeholder="请输入邮箱地址" clearable></el-input>
          </el-form-item>

          <template v-if="accountForm.userType === 2">
            <el-form-item label="平台账号" prop="platformAccount">
              <el-select v-model="profileForm.platform" placeholder="选择平台" style="width: 120px; margin-right: 10px">
                <el-option label="抖音" value="douyin"></el-option>
                <el-option label="快手" value="kuaishou"></el-option>
                <el-option label="小红书" value="xiaohongshu"></el-option>
              </el-select>
              <el-input v-model="profileForm.platformAccount" placeholder="平台账号ID" style="width: calc(100% - 130px)"></el-input>
            </el-form-item>

            <el-form-item label="粉丝数量" prop="fansCount">
              <el-input-number v-model="profileForm.fansCount" :min="0" controls-position="right" placeholder="粉丝数量"></el-input-number>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="profileForm.companyName" placeholder="请输入公司名称" clearable></el-input>
            </el-form-item>

            <el-form-item label="行业分类" prop="industry">
              <el-select v-model="profileForm.industry" placeholder="请选择行业分类">
                <el-option label="美妆个护" value="beauty"></el-option>
                <el-option label="服装" value="clothing"></el-option>
                <el-option label="食品" value="food"></el-option>
                <el-option label="数码" value="digital"></el-option>
                <el-option label="家居" value="home"></el-option>
                <el-option label="其他" value="other"></el-option>
              </el-select>
            </el-form-item>
          </template>

          <el-form-item>
            <el-button type="primary" @click="submitRegistration">提交注册</el-button>
            <el-button @click="active = 0">上一步</el-button>
          </el-form-item>
        </el-form>

        <!-- 步骤3：注册成功 -->
        <div v-else class="success-container">
          <el-result 
            icon="success" 
            title="注册成功" 
            subTitle="恭喜您已成功注册吉米哥达人任务平台账号"
          >
            <template #extra>
              <el-button type="primary" @click="toLogin">前往登录</el-button>
            </template>
          </el-result>
        </div>
      </div>
      
      <div class="agreement-text" v-if="active < 2">
        注册即表示您同意 <a href="javascript:;">《用户协议》</a> 和 <a href="javascript:;">《隐私政策》</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    // 验证手机号
    const validatePhone = (rule, value, callback) => {
      const reg = /^1[3-9]\d{9}$/
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    
    // 验证密码
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        if (this.accountForm.confirmPassword) {
          this.$refs.accountForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    
    // 验证确认密码
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.accountForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!value) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }

    return {
      active: 0,
      codeButtonText: '获取验证码',
      isCodeSending: false,
      countdown: 60,
      accountForm: {
        userType: 2, // 默认为达人
        phone: '',
        verifyCode: '',
        password: '',
        confirmPassword: ''
      },
      accountRules: {
        userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 6, message: '验证码长度为4-6位', trigger: 'blur' }
        ],
        password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
      },
      profileForm: {
        username: '',
        realName: '',
        email: '',
        platform: 'douyin',
        platformAccount: '',
        fansCount: 0,
        companyName: '',
        industry: ''
      },
      profileRules: {
        username: [
          { required: true, message: '请设置用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
        ],
        realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        platformAccount: [{ required: true, message: '请输入平台账号', trigger: 'blur' }],
        fansCount: [{ required: true, message: '请输入粉丝数量', trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        industry: [{ required: true, message: '请选择行业分类', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 发送验证码
    sendVerifyCode() {
      this.$refs.accountForm.validateField('phone', (err) => {
        if (!err) {
          this.isCodeSending = true
          this.codeButtonText = `${this.countdown}秒后重试`
          
          // 模拟发送验证码
          const timer = setInterval(() => {
            this.countdown--
            this.codeButtonText = `${this.countdown}秒后重试`
            
            if (this.countdown <= 0) {
              clearInterval(timer)
              this.isCodeSending = false
              this.codeButtonText = '获取验证码'
              this.countdown = 60
            }
          }, 1000)
          
          this.$message.success('验证码已发送，请注意查收')
        }
      })
    },
    
    // 下一步
    nextStep() {
      this.$refs.accountForm.validate((valid) => {
        if (valid) {
          this.active = 1
        } else {
          return false
        }
      })
    },
    
    // 提交注册
    submitRegistration() {
      this.$refs.profileForm.validate((valid) => {
        if (valid) {
          this.loading = true
          
          // 模拟提交注册
          setTimeout(() => {
            this.loading = false
            this.active = 2
          }, 1500)
        } else {
          return false
        }
      })
    },
    
    // 返回登录页
    toLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $background-color;
  padding: 40px 0;
  
  .register-box {
    width: 700px;
    background-color: #fff;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-base;
    padding: 40px;
    
    .register-header {
      text-align: center;
      margin-bottom: 30px;
      
      .logo {
        width: 60px;
        height: 60px;
        margin-bottom: 16px;
      }
      
      .title {
        font-size: $font-size-xl;
        color: $text-primary;
        font-weight: 500;
      }
    }
    
    .register-steps {
      margin-bottom: 30px;
    }
    
    .form-container {
      .register-form {
        width: 90%;
        margin: 0 auto;
        
        .verify-code-container {
          display: flex;
          
          .el-input {
            margin-right: 10px;
          }
          
          .el-button {
            min-width: 120px;
          }
        }
      }
    }
    
    .success-container {
      padding: 30px 0;
    }
    
    .agreement-text {
      text-align: center;
      margin-top: 30px;
      font-size: $font-size-small;
      color: $text-secondary;
      
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

// 响应式样式
@media screen and (max-width: $breakpoint-md) {
  .register-container {
    .register-box {
      width: 90%;
      padding: 20px;
      
      .form-container {
        .register-form {
          width: 100%;
        }
      }
    }
  }
}
</style>