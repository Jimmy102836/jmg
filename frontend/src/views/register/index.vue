<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-logo">
        <img src="@/assets/images/logo.png" alt="吉米哥达人任务平台" />
        <h2>吉米哥达人任务平台</h2>
      </div>
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="账号信息" />
        <el-step title="个人资料" />
        <el-step title="注册完成" />
      </el-steps>
      
      <el-form
        v-if="active === 0"
        ref="accountForm"
        :model="registerForm"
        :rules="accountRules"
        class="register-form"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号">
            <template #append>
              <el-button 
                :disabled="isCounting" 
                @click="getVerificationCode"
              >
                {{ isCounting ? `${countdown}秒后重新获取` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="验证码" prop="verification_code">
          <el-input v-model="registerForm.verification_code" placeholder="请输入验证码" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input
            v-model="registerForm.password_confirmation"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱(选填)" />
        </el-form-item>
        
        <el-form-item label="用户类型" prop="user_type">
          <el-radio-group v-model="registerForm.user_type">
            <el-radio :label="1">商家</el-radio>
            <el-radio :label="2">达人</el-radio>
            <el-radio :label="3">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="nextStep">下一步</el-button>
          <el-button @click="$router.push('/login')">已有账号，去登录</el-button>
        </el-form-item>
      </el-form>
      
      <el-form
        v-if="active === 1"
        ref="profileForm"
        :model="profileForm"
        :rules="profileRules"
        class="register-form"
        label-width="100px"
      >
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="profileForm.real_name" placeholder="请输入真实姓名" />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="profileForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            placeholder="请输入个人简介"
            rows="4"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button @click="active--">上一步</el-button>
          <el-button type="primary" @click="submitRegister">提交注册</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="active === 2" class="success-info">
        <el-result
          icon="success"
          title="注册成功"
          sub-title="您的账号已经创建成功，快去体验吧！"
        >
          <template #extra>
            <el-button type="primary" @click="goToLogin">去登录</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getVerificationCode, register } from '@/api/user'

const router = useRouter()
const active = ref(0)
const isCounting = ref(false)
const countdown = ref(60)

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerForm.password_confirmation !== '') {
      // 对第二个密码框单独验证
      if (value !== registerForm.password_confirmation) {
        callback(new Error('两次密码不一致'))
      }
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }
  if (!/^1[3-9]\d{9}$/.test(value)) {
    return callback(new Error('请输入正确的手机号'))
  }
  callback()
}

const registerForm = reactive({
  username: '',
  phone: '',
  verification_code: '',
  password: '',
  password_confirmation: '',
  email: '',
  user_type: 1
})

const profileForm = reactive({
  real_name: '',
  gender: 1,
  bio: ''
})

const accountRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'blur' }
  ],
  verification_code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 6, message: '验证码格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  password_confirmation: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  user_type: [
    { required: true, message: '请选择用户类型', trigger: 'change' }
  ]
}

const profileRules = {
  real_name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
}

// 获取验证码
const getVerificationCode = async () => {
  try {
    if (!registerForm.phone) {
      return ElMessage.warning('请先输入手机号')
    }
    
    await getVerificationCode({ phone: registerForm.phone, type: 'register' })
    ElMessage.success('验证码已发送，请注意查收')
    
    // 开始倒计时
    isCounting.value = true
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        isCounting.value = false
      }
    }, 1000)
  } catch (error) {
    ElMessage.error(error.message || '获取验证码失败')
  }
}

// 下一步
const nextStep = () => {
  if (active.value === 0) {
    // 验证账号信息表单
    const accountForm = document.querySelector('.register-form')
    if (!accountForm) return
    
    // 表单验证通过后进入下一步
    active.value++
  }
}

// 提交注册
const submitRegister = async () => {
  try {
    const profileForm = document.querySelector('.register-form')
    if (!profileForm) return
    
    // 合并两个表单数据
    const formData = {
      ...registerForm,
      profile: {
        ...profileForm
      }
    }
    
    await register(formData)
    ElMessage.success('注册成功')
    active.value++
  } catch (error) {
    ElMessage.error(error.message || '注册失败，请重试')
  }
}

// 去登录
const goToLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px 0;
  background-color: #f5f5f5;
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;

  .register-box {
    width: 600px;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .register-logo {
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

  .register-form {
    margin-top: 30px;
  }
  
  .success-info {
    margin-top: 30px;
    text-align: center;
  }
  
  :deep(.el-steps) {
    margin-bottom: 20px;
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .register-container {
    padding: 20px;
    
    .register-box {
      width: 100%;
      padding: 20px;
    }
  }
}
</style> 