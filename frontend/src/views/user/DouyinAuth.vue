<template>
  <div class="douyin-auth">
    <Header />
    
    <div class="container">
      <div class="page-header">
        <h1>抖音账号授权</h1>
        <p>授权您的抖音账号，享受更多平台功能</p>
      </div>
      
      <el-card class="auth-card">
        <template #header>
          <div class="auth-card-header">
            <h2>授权流程</h2>
          </div>
        </template>
        <div class="auth-steps">
          <el-steps :active="currentStep" finish-status="success">
            <el-step title="申请授权" description="填写基本信息"></el-step>
            <el-step title="扫码授权" description="使用抖音App扫码"></el-step>
            <el-step title="授权完成" description="绑定账号成功"></el-step>
          </el-steps>
          
          <div class="step-content">
            <!-- 步骤1：申请授权 -->
            <div v-if="currentStep === 0" class="step-form">
              <p class="step-desc">请填写您的抖音账号信息，我们将向您发送授权请求。</p>
              
              <el-form :model="authForm" label-width="100px" :rules="authRules" ref="authFormRef">
                <el-form-item label="抖音昵称" prop="nickname">
                  <el-input v-model="authForm.nickname" placeholder="您的抖音昵称"></el-input>
                </el-form-item>
                
                <el-form-item label="抖音号" prop="douyinId">
                  <el-input v-model="authForm.douyinId" placeholder="您的抖音号"></el-input>
                </el-form-item>
                
                <el-form-item label="账号分类" prop="category">
                  <el-select 
                    v-model="authForm.category" 
                    multiple 
                    placeholder="请选择账号分类"
                    style="width: 100%"
                  >
                    <el-option 
                      v-for="category in accountCategories" 
                      :key="category" 
                      :label="category" 
                      :value="category"
                    ></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="粉丝数量" prop="fans">
                  <el-input v-model.number="authForm.fans" placeholder="您的粉丝数量"></el-input>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="submitAuthForm">下一步</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 步骤2：扫码授权 -->
            <div v-if="currentStep === 1" class="step-qrcode">
              <p class="step-desc">请使用抖音App扫描下方二维码，完成账号授权。</p>
              
              <div class="qrcode-container">
                <img src="https://via.placeholder.com/250x250?text=抖音授权码" alt="抖音授权二维码" class="qrcode-img">
                <p class="qrcode-tips">二维码有效期 15 分钟，请尽快扫码</p>
              </div>
              
              <div class="auth-btns">
                <el-button @click="currentStep = 0">上一步</el-button>
                <el-button type="primary" @click="mockAuthComplete">模拟授权完成</el-button>
              </div>
            </div>
            
            <!-- 步骤3：授权完成 -->
            <div v-if="currentStep === 2" class="step-success">
              <div class="success-icon">
                <i class="el-icon-check"></i>
              </div>
              
              <h3>授权成功！</h3>
              <p>您已成功授权抖音账号：{{ authForm.nickname }}</p>
              
              <div class="auth-info">
                <p><span class="label">抖音号：</span>{{ authForm.douyinId }}</p>
                <p><span class="label">授权时间：</span>{{ new Date().toLocaleString() }}</p>
                <p><span class="label">有效期至：</span>{{ getExpireDate() }}</p>
              </div>
              
              <div class="auth-btns">
                <el-button type="success" @click="goToAccountList">查看我的抖音账号</el-button>
                <el-button type="primary" @click="resetAuth">继续添加账号</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      
      <el-card class="tips-card">
        <template #header>
          <div class="tips-header">
            <h3><i class="el-icon-info"></i> 授权说明</h3>
          </div>
        </template>
        <div class="tips-content">
          <h4>授权后您将获得以下功能：</h4>
          <ul>
            <li>一键获取带货数据，自动同步订单信息</li>
            <li>智能分析账号流量和转化数据</li>
            <li>获取更多优质带货任务推荐</li>
            <li>享受平台专属佣金提升和结算加速</li>
          </ul>
          
          <h4>授权须知：</h4>
          <ul>
            <li>授权过程完全安全，不会获取您的抖音登录密码</li>
            <li>授权有效期为一年，到期前会提醒您续期</li>
            <li>您可以随时在账号管理中取消授权</li>
            <li>授权信息仅用于平台服务，不会泄露给第三方</li>
          </ul>
        </div>
      </el-card>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { accountCategories } from '@/mock/douyinAccounts'

export default {
  name: 'DouyinAuth',
  components: {
    Header,
    Footer
  },
  setup() {
    const router = useRouter()
    const authFormRef = ref(null)
    const currentStep = ref(0)
    
    // 表单数据
    const authForm = reactive({
      nickname: '',
      douyinId: '',
      category: [],
      fans: ''
    })
    
    // 表单验证规则
    const authRules = {
      nickname: [
        { required: true, message: '请输入抖音昵称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      douyinId: [
        { required: true, message: '请输入抖音号', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_-]{4,20}$/, message: '抖音号格式不正确', trigger: 'blur' }
      ],
      category: [
        { required: true, message: '请至少选择一个分类', trigger: 'change' },
        { type: 'array', min: 1, max: 3, message: '最多选择3个分类', trigger: 'change' }
      ],
      fans: [
        { required: true, message: '请输入粉丝数量', trigger: 'blur' },
        { type: 'number', message: '粉丝数量必须为数字', trigger: 'blur' }
      ]
    }
    
    // 提交表单
    const submitAuthForm = () => {
      authFormRef.value.validate((valid) => {
        if (valid) {
          currentStep.value = 1
        }
      })
    }
    
    // 模拟授权完成
    const mockAuthComplete = () => {
      currentStep.value = 2
    }
    
    // 获取过期日期（一年后）
    const getExpireDate = () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() + 1)
      return date.toLocaleDateString()
    }
    
    // 重置授权流程
    const resetAuth = () => {
      currentStep.value = 0
      authForm.nickname = ''
      authForm.douyinId = ''
      authForm.category = []
      authForm.fans = ''
    }
    
    // 跳转到账号列表
    const goToAccountList = () => {
      router.push('/user/douyin-accounts')
    }
    
    return {
      currentStep,
      authForm,
      authFormRef,
      authRules,
      accountCategories,
      submitAuthForm,
      mockAuthComplete,
      getExpireDate,
      resetAuth,
      goToAccountList
    }
  }
}
</script>

<style lang="scss" scoped>
.douyin-auth {
  background-color: #f8f8f8;
  min-height: 100vh;
  
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 30px;
    
    h1 {
      font-size: 32px;
      color: #333;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 16px;
      color: #666;
    }
  }
  
  .auth-card {
    margin-bottom: 30px;
    
    .auth-card-header {
      display: flex;
      align-items: center;
      
      h2 {
        font-size: 20px;
        margin: 0;
        color: #333;
      }
    }
    
    .auth-steps {
      padding: 20px 0;
      
      .step-content {
        margin-top: 40px;
        padding: 20px;
        border-top: 1px solid #eee;
        
        .step-desc {
          margin-bottom: 20px;
          font-size: 16px;
          color: #666;
          text-align: center;
        }
        
        .step-form {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .step-qrcode {
          text-align: center;
          
          .qrcode-container {
            margin: 30px 0;
            
            .qrcode-img {
              display: block;
              margin: 0 auto 15px;
              border: 1px solid #eee;
              padding: 10px;
              border-radius: 8px;
            }
            
            .qrcode-tips {
              color: #999;
              font-size: 14px;
            }
          }
        }
        
        .step-success {
          text-align: center;
          
          .success-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background-color: #00B578;
            color: #fff;
            border-radius: 50%;
            font-size: 36px;
          }
          
          h3 {
            font-size: 24px;
            color: #333;
            margin-bottom: 15px;
          }
          
          p {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
          }
          
          .auth-info {
            background-color: #f9f9f9;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: left;
            display: inline-block;
            
            p {
              margin-bottom: 10px;
              
              &:last-child {
                margin-bottom: 0;
              }
              
              .label {
                font-weight: bold;
                color: #333;
              }
            }
          }
        }
        
        .auth-btns {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 20px;
        }
      }
    }
  }
  
  .tips-card {
    margin-bottom: 40px;
    
    .tips-header {
      h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
        
        i {
          color: #409EFF;
          margin-right: 5px;
        }
      }
    }
    
    .tips-content {
      h4 {
        font-size: 16px;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #333;
        
        &:first-child {
          margin-top: 0;
        }
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
          color: #666;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .douyin-auth {
    .auth-steps {
      .step-content {
        padding: 20px 0;
      }
    }
  }
}
</style> 