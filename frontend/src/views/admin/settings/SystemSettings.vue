<template>
  <div class="system-settings">
    <el-tabs v-model="activeTab" class="settings-tabs">
      <!-- 基本设置 -->
      <el-tab-pane label="基本设置" name="basic">
        <el-form
          ref="basicFormRef"
          :model="basicForm"
          :rules="basicRules"
          label-width="120px"
          class="settings-form"
        >
          <el-form-item label="平台名称" prop="platformName">
            <el-input v-model="basicForm.platformName" placeholder="请输入平台名称" />
          </el-form-item>
          
          <el-form-item label="平台Logo">
            <el-upload
              class="logo-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleLogoSuccess"
              :before-upload="beforeLogoUpload"
            >
              <img v-if="basicForm.logo" :src="basicForm.logo" class="logo" />
              <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">建议尺寸：200x200px，支持jpg、png格式</div>
          </el-form-item>
          
          <el-form-item label="平台描述" prop="description">
            <el-input
              v-model="basicForm.description"
              type="textarea"
              rows="4"
              placeholder="请输入平台描述"
            />
          </el-form-item>
          
          <el-form-item label="客服电话" prop="servicePhone">
            <el-input v-model="basicForm.servicePhone" placeholder="请输入客服电话" />
          </el-form-item>
          
          <el-form-item label="客服邮箱" prop="serviceEmail">
            <el-input v-model="basicForm.serviceEmail" placeholder="请输入客服邮箱" />
          </el-form-item>
          
          <el-form-item label="备案信息" prop="icp">
            <el-input v-model="basicForm.icp" placeholder="请输入备案信息" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleBasicSave">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <!-- 安全设置 -->
      <el-tab-pane label="安全设置" name="security">
        <el-form
          ref="securityFormRef"
          :model="securityForm"
          :rules="securityRules"
          label-width="120px"
          class="settings-form"
        >
          <el-form-item label="登录验证码" prop="loginCaptcha">
            <el-switch v-model="securityForm.loginCaptcha" />
            <div class="setting-tip">开启后，用户登录时需要输入验证码</div>
          </el-form-item>
          
          <el-form-item label="密码最小长度" prop="passwordMinLength">
            <el-input-number
              v-model="securityForm.passwordMinLength"
              :min="6"
              :max="20"
            />
            <div class="setting-tip">设置用户密码的最小长度要求</div>
          </el-form-item>
          
          <el-form-item label="密码复杂度" prop="passwordComplexity">
            <el-checkbox-group v-model="securityForm.passwordComplexity">
              <el-checkbox label="uppercase">必须包含大写字母</el-checkbox>
              <el-checkbox label="lowercase">必须包含小写字母</el-checkbox>
              <el-checkbox label="number">必须包含数字</el-checkbox>
              <el-checkbox label="special">必须包含特殊字符</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="登录失败锁定" prop="loginLock">
            <el-switch v-model="securityForm.loginLock" />
            <div class="setting-tip">开启后，连续登录失败将锁定账号</div>
          </el-form-item>
          
          <el-form-item
            v-if="securityForm.loginLock"
            label="失败次数"
            prop="loginFailCount"
          >
            <el-input-number
              v-model="securityForm.loginFailCount"
              :min="3"
              :max="10"
            />
            <div class="setting-tip">连续登录失败多少次后锁定账号</div>
          </el-form-item>
          
          <el-form-item
            v-if="securityForm.loginLock"
            label="锁定时间"
            prop="loginLockTime"
          >
            <el-input-number
              v-model="securityForm.loginLockTime"
              :min="5"
              :max="60"
            />
            <div class="setting-tip">账号锁定时间（分钟）</div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSecuritySave">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <!-- 通知设置 -->
      <el-tab-pane label="通知设置" name="notification">
        <el-form
          ref="notificationFormRef"
          :model="notificationForm"
          label-width="120px"
          class="settings-form"
        >
          <el-form-item label="邮件通知">
            <el-switch v-model="notificationForm.emailEnabled" />
            <div class="setting-tip">开启后，系统将通过邮件发送通知</div>
          </el-form-item>
          
          <template v-if="notificationForm.emailEnabled">
            <el-form-item label="SMTP服务器" prop="smtpServer">
              <el-input v-model="notificationForm.smtpServer" placeholder="请输入SMTP服务器地址" />
            </el-form-item>
            
            <el-form-item label="SMTP端口" prop="smtpPort">
              <el-input-number v-model="notificationForm.smtpPort" :min="1" :max="65535" />
            </el-form-item>
            
            <el-form-item label="发件人邮箱" prop="smtpUsername">
              <el-input v-model="notificationForm.smtpUsername" placeholder="请输入发件人邮箱" />
            </el-form-item>
            
            <el-form-item label="邮箱密码" prop="smtpPassword">
              <el-input
                v-model="notificationForm.smtpPassword"
                type="password"
                placeholder="请输入邮箱密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleTestEmail">测试邮件</el-button>
            </el-form-item>
          </template>
          
          <el-form-item label="短信通知">
            <el-switch v-model="notificationForm.smsEnabled" />
            <div class="setting-tip">开启后，系统将通过短信发送通知</div>
          </el-form-item>
          
          <template v-if="notificationForm.smsEnabled">
            <el-form-item label="短信服务商" prop="smsProvider">
              <el-select v-model="notificationForm.smsProvider" placeholder="请选择短信服务商">
                <el-option label="阿里云" value="aliyun" />
                <el-option label="腾讯云" value="tencent" />
                <el-option label="华为云" value="huawei" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="AccessKey" prop="smsAccessKey">
              <el-input v-model="notificationForm.smsAccessKey" placeholder="请输入AccessKey" />
            </el-form-item>
            
            <el-form-item label="AccessSecret" prop="smsAccessSecret">
              <el-input
                v-model="notificationForm.smsAccessSecret"
                type="password"
                placeholder="请输入AccessSecret"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleTestSms">测试短信</el-button>
            </el-form-item>
          </template>
          
          <el-form-item>
            <el-button type="primary" @click="handleNotificationSave">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'SystemSettings',
  components: {
    Plus
  },
  setup() {
    // 当前激活的标签页
    const activeTab = ref('basic')
    
    // 基本设置表单
    const basicFormRef = ref(null)
    const basicForm = reactive({
      platformName: '',
      logo: '',
      description: '',
      servicePhone: '',
      serviceEmail: '',
      icp: ''
    })
    
    // 基本设置表单验证规则
    const basicRules = {
      platformName: [
        { required: true, message: '请输入平台名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入平台描述', trigger: 'blur' },
        { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
      ],
      servicePhone: [
        { required: true, message: '请输入客服电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ],
      serviceEmail: [
        { required: true, message: '请输入客服邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      icp: [
        { required: true, message: '请输入备案信息', trigger: 'blur' }
      ]
    }
    
    // 安全设置表单
    const securityFormRef = ref(null)
    const securityForm = reactive({
      loginCaptcha: true,
      passwordMinLength: 8,
      passwordComplexity: ['uppercase', 'lowercase', 'number'],
      loginLock: true,
      loginFailCount: 5,
      loginLockTime: 30
    })
    
    // 安全设置表单验证规则
    const securityRules = {
      passwordMinLength: [
        { required: true, message: '请设置密码最小长度', trigger: 'blur' }
      ],
      loginFailCount: [
        { required: true, message: '请设置失败次数', trigger: 'blur' }
      ],
      loginLockTime: [
        { required: true, message: '请设置锁定时间', trigger: 'blur' }
      ]
    }
    
    // 通知设置表单
    const notificationFormRef = ref(null)
    const notificationForm = reactive({
      emailEnabled: false,
      smtpServer: '',
      smtpPort: 465,
      smtpUsername: '',
      smtpPassword: '',
      smsEnabled: false,
      smsProvider: '',
      smsAccessKey: '',
      smsAccessSecret: ''
    })
    
    // 上传相关
    const uploadUrl = '/api/upload' // 替换为实际的上传接口
    
    const beforeLogoUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG && !isPNG) {
        ElMessage.error('上传Logo只能是JPG或PNG格式!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('上传Logo大小不能超过2MB!')
        return false
      }
      return true
    }
    
    const handleLogoSuccess = (res) => {
      basicForm.logo = res.url
    }
    
    // 保存基本设置
    const handleBasicSave = async () => {
      if (!basicFormRef.value) return
      
      await basicFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            // 这里应该调用实际的API
            // await api.saveBasicSettings(basicForm)
            ElMessage.success('保存成功')
          } catch (error) {
            console.error('保存失败:', error)
            ElMessage.error('保存失败')
          }
        }
      })
    }
    
    // 保存安全设置
    const handleSecuritySave = async () => {
      if (!securityFormRef.value) return
      
      await securityFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            // 这里应该调用实际的API
            // await api.saveSecuritySettings(securityForm)
            ElMessage.success('保存成功')
          } catch (error) {
            console.error('保存失败:', error)
            ElMessage.error('保存失败')
          }
        }
      })
    }
    
    // 保存通知设置
    const handleNotificationSave = async () => {
      if (!notificationFormRef.value) return
      
      await notificationFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            // 这里应该调用实际的API
            // await api.saveNotificationSettings(notificationForm)
            ElMessage.success('保存成功')
          } catch (error) {
            console.error('保存失败:', error)
            ElMessage.error('保存失败')
          }
        }
      })
    }
    
    // 测试邮件
    const handleTestEmail = async () => {
      try {
        // 这里应该调用实际的API
        // await api.testEmail(notificationForm)
        ElMessage.success('测试邮件发送成功')
      } catch (error) {
        console.error('发送失败:', error)
        ElMessage.error('发送失败')
      }
    }
    
    // 测试短信
    const handleTestSms = async () => {
      try {
        // 这里应该调用实际的API
        // await api.testSms(notificationForm)
        ElMessage.success('测试短信发送成功')
      } catch (error) {
        console.error('发送失败:', error)
        ElMessage.error('发送失败')
      }
    }
    
    // 获取设置
    const getSettings = async () => {
      try {
        // 这里应该调用实际的API
        // const res = await api.getSettings()
        // Object.assign(basicForm, res.data.basic)
        // Object.assign(securityForm, res.data.security)
        // Object.assign(notificationForm, res.data.notification)
      } catch (error) {
        console.error('获取设置失败:', error)
        ElMessage.error('获取设置失败')
      }
    }
    
    onMounted(() => {
      getSettings()
    })
    
    return {
      activeTab,
      basicFormRef,
      basicForm,
      basicRules,
      securityFormRef,
      securityForm,
      securityRules,
      notificationFormRef,
      notificationForm,
      uploadUrl,
      beforeLogoUpload,
      handleLogoSuccess,
      handleBasicSave,
      handleSecuritySave,
      handleNotificationSave,
      handleTestEmail,
      handleTestSms
    }
  }
}
</script>

<style lang="scss" scoped>
.system-settings {
  .settings-tabs {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
  }
  
  .settings-form {
    max-width: 800px;
    margin: 20px auto;
  }
  
  .logo-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      
      &:hover {
        border-color: var(--el-color-primary);
      }
    }
    
    .logo-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 200px;
      text-align: center;
      line-height: 200px;
    }
    
    .logo {
      width: 200px;
      height: 200px;
      display: block;
      object-fit: contain;
    }
  }
  
  .upload-tip {
    font-size: 12px;
    color: #606266;
    margin-top: 8px;
  }
  
  .setting-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}
</style> 