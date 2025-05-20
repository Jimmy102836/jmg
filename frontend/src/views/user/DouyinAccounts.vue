<template>
  <div class="douyin-accounts">
    <Header />
    
    <div class="container">
      <div class="page-header">
        <h1>我的抖音账号</h1>
        <p>管理您已授权的抖音账号</p>
      </div>
      
      <div class="action-bar">
        <el-button type="primary" icon="el-icon-plus" @click="goToAuth">添加新账号</el-button>
        <el-input
          placeholder="搜索账号昵称/ID"
          v-model="searchKeyword"
          class="search-input"
          clearable
          prefix-icon="el-icon-search"
        ></el-input>
      </div>
      
      <div class="account-list" v-if="filteredAccounts.length > 0">
        <el-card v-for="account in filteredAccounts" :key="account.id" class="account-card">
          <div class="account-header">
            <div class="account-info">
              <img :src="account.avatar" :alt="account.nickname" class="account-avatar">
              <div class="account-details">
                <h3 class="account-name">{{ account.nickname }}</h3>
                <p class="account-id">抖音号: {{ account.douyinId }}</p>
              </div>
            </div>
            <div class="account-status">
              <el-tag 
                :type="getStatusType(account.authStatus)" 
                effect="dark"
              >
                {{ getStatusLabel(account.authStatus) }}
              </el-tag>
              <p class="expire-time" v-if="account.authStatus === 'active'">
                有效期至: {{ account.expireTime }}
              </p>
              <p class="expire-time" v-else-if="account.authStatus === 'expired'">
                已于 {{ account.expireTime }} 过期
              </p>
              <p class="expire-time" v-else>
                申请时间: {{ account.authTime }}
              </p>
            </div>
          </div>
          
          <el-divider></el-divider>
          
          <div class="account-data">
            <div class="data-item">
              <div class="data-value">{{ formatNumber(account.fans) }}</div>
              <div class="data-label">粉丝数</div>
            </div>
            <div class="data-item">
              <div class="data-value">{{ formatNumber(account.works) }}</div>
              <div class="data-label">作品数</div>
            </div>
            <div class="data-item">
              <div class="data-value">{{ formatNumber(account.likes) }}</div>
              <div class="data-label">获赞数</div>
            </div>
            <div class="data-item">
              <div class="data-value">{{ account.category.join('、') }}</div>
              <div class="data-label">账号分类</div>
            </div>
          </div>
          
          <div class="account-sales" v-if="account.authStatus === 'active'">
            <h4>近30天销售数据</h4>
            <div class="sales-data">
              <div class="sales-item">
                <div class="sales-value">¥{{ formatMoney(account.statistics.sales.last30Days) }}</div>
                <div class="sales-label">销售额</div>
              </div>
              <div class="sales-item">
                <div class="sales-value">{{ formatNumber(account.statistics.sales.last30DaysOrders) }}</div>
                <div class="sales-label">订单量</div>
              </div>
              <div class="sales-item">
                <div class="sales-value">{{ formatNumber(account.statistics.videos.last30Days) }}</div>
                <div class="sales-label">视频数</div>
              </div>
              <div class="sales-item">
                <div class="sales-value">{{ formatNumber(account.statistics.liveStreams.last30Days) }}</div>
                <div class="sales-label">直播场次</div>
              </div>
            </div>
          </div>
          
          <div class="account-actions">
            <el-button 
              type="primary" 
              plain 
              icon="el-icon-data-analysis" 
              @click="viewAccountDetail(account.id)"
              :disabled="account.authStatus !== 'active'"
            >
              数据分析
            </el-button>
            <el-button 
              type="success" 
              plain 
              icon="el-icon-goods" 
              @click="viewAccountProducts(account.id)"
              :disabled="account.authStatus !== 'active' || account.products.length === 0"
            >
              带货商品
            </el-button>
            <el-button 
              type="warning" 
              plain 
              icon="el-icon-refresh" 
              @click="reauthorizeAccount(account.id)"
              v-if="account.authStatus === 'expired'"
            >
              重新授权
            </el-button>
            <el-button 
              type="info" 
              plain 
              icon="el-icon-edit" 
              @click="editAccount(account.id)"
            >
              编辑信息
            </el-button>
            <el-button 
              type="danger" 
              plain 
              icon="el-icon-delete" 
              @click="confirmDeleteAccount(account.id)"
            >
              解除绑定
            </el-button>
          </div>
        </el-card>
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <i class="el-icon-user"></i>
        </div>
        <h3>暂无抖音账号</h3>
        <p>您尚未添加任何抖音账号，点击下方按钮添加</p>
        <el-button type="primary" @click="goToAuth">添加抖音账号</el-button>
      </div>
    </div>
    
    <!-- 账号删除确认对话框 -->
    <el-dialog
      title="解除抖音账号绑定"
      v-model="deleteDialogVisible"
      width="420px"
    >
      <div class="delete-dialog-content">
        <i class="el-icon-warning-outline warning-icon"></i>
        <p>确认要解除该抖音账号的绑定吗？</p>
        <p class="warning-text">解除绑定后，该账号数据将不再同步，您可以随时重新授权。</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteAccount">确认解除</el-button>
        </span>
      </template>
    </el-dialog>
    
    <Footer />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { douyinAccounts, authStatusMap } from '@/mock/douyinAccounts'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'DouyinAccounts',
  components: {
    Header,
    Footer
  },
  setup() {
    const router = useRouter()
    const accounts = ref(douyinAccounts)
    const searchKeyword = ref('')
    const deleteDialogVisible = ref(false)
    const accountToDelete = ref(null)
    
    // 筛选账号
    const filteredAccounts = computed(() => {
      if (!searchKeyword.value) {
        return accounts.value
      }
      
      const keyword = searchKeyword.value.toLowerCase()
      return accounts.value.filter(account => 
        account.nickname.toLowerCase().includes(keyword) || 
        account.douyinId.toLowerCase().includes(keyword)
      )
    })
    
    // 获取账号状态标签
    const getStatusLabel = (status) => {
      return authStatusMap[status]?.label || '未知状态'
    }
    
    // 获取账号状态标签类型
    const getStatusType = (status) => {
      switch (status) {
        case 'active':
          return 'success'
        case 'expired':
          return 'danger'
        case 'pending':
          return 'warning'
        default:
          return 'info'
      }
    }
    
    // 格式化数字
    const formatNumber = (num) => {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    }
    
    // 格式化金额
    const formatMoney = (amount) => {
      return (amount / 10000).toFixed(2) + 'w'
    }
    
    // 跳转到授权页面
    const goToAuth = () => {
      router.push('/user/douyin-auth')
    }
    
    // 查看账号详情
    const viewAccountDetail = (accountId) => {
      router.push(`/user/douyin-accounts/${accountId}`)
    }
    
    // 查看账号带货商品
    const viewAccountProducts = (accountId) => {
      router.push(`/user/douyin-accounts/${accountId}/products`)
    }
    
    // 重新授权账号
    const reauthorizeAccount = (accountId) => {
      router.push(`/user/douyin-auth?reauth=${accountId}`)
    }
    
    // 编辑账号信息
    const editAccount = (accountId) => {
      router.push(`/user/douyin-accounts/${accountId}/edit`)
    }
    
    // 打开删除确认对话框
    const confirmDeleteAccount = (accountId) => {
      accountToDelete.value = accountId
      deleteDialogVisible.value = true
    }
    
    // 删除账号
    const deleteAccount = () => {
      if (accountToDelete.value) {
        accounts.value = accounts.value.filter(account => account.id !== accountToDelete.value)
        ElMessage.success('抖音账号已解除绑定')
        deleteDialogVisible.value = false
        accountToDelete.value = null
      }
    }
    
    return {
      accounts,
      searchKeyword,
      filteredAccounts,
      deleteDialogVisible,
      getStatusLabel,
      getStatusType,
      formatNumber,
      formatMoney,
      goToAuth,
      viewAccountDetail,
      viewAccountProducts,
      reauthorizeAccount,
      editAccount,
      confirmDeleteAccount,
      deleteAccount
    }
  }
}
</script>

<style lang="scss" scoped>
.douyin-accounts {
  background-color: #f8f8f8;
  min-height: 100vh;
  
  .container {
    max-width: 1000px;
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
  
  .action-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .search-input {
      width: 300px;
    }
  }
  
  .account-list {
    .account-card {
      margin-bottom: 20px;
      
      .account-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .account-info {
          display: flex;
          align-items: center;
          
          .account-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid #eee;
          }
          
          .account-details {
            margin-left: 15px;
            
            .account-name {
              font-size: 18px;
              margin: 0 0 5px;
              color: #333;
            }
            
            .account-id {
              font-size: 14px;
              margin: 0;
              color: #666;
            }
          }
        }
        
        .account-status {
          text-align: right;
          
          .expire-time {
            font-size: 13px;
            margin: 8px 0 0;
            color: #999;
          }
        }
      }
      
      .account-data {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        
        .data-item {
          flex: 1;
          text-align: center;
          
          .data-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          
          .data-label {
            font-size: 13px;
            color: #666;
          }
        }
      }
      
      .account-sales {
        background-color: #f9f9f9;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 20px;
        
        h4 {
          font-size: 16px;
          margin: 0 0 15px;
          color: #333;
        }
        
        .sales-data {
          display: flex;
          justify-content: space-between;
          
          .sales-item {
            flex: 1;
            text-align: center;
            
            .sales-value {
              font-size: 16px;
              font-weight: bold;
              color: #ff6a00;
              margin-bottom: 5px;
            }
            
            .sales-label {
              font-size: 13px;
              color: #666;
            }
          }
        }
      }
      
      .account-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 0;
    
    .empty-icon {
      font-size: 60px;
      color: #ddd;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 20px;
      color: #333;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
  }
}

.delete-dialog-content {
  text-align: center;
  padding: 10px 0;
  
  .warning-icon {
    font-size: 48px;
    color: #ff5722;
    margin-bottom: 15px;
  }
  
  p {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
  }
  
  .warning-text {
    font-size: 14px;
    color: #999;
  }
}

@media (max-width: 768px) {
  .douyin-accounts {
    .action-bar {
      flex-direction: column;
      
      .el-button {
        margin-bottom: 10px;
      }
      
      .search-input {
        width: 100%;
      }
    }
    
    .account-list {
      .account-card {
        .account-header {
          flex-direction: column;
          align-items: flex-start;
          
          .account-status {
            text-align: left;
            margin-top: 15px;
          }
        }
        
        .account-data, .account-sales .sales-data {
          flex-wrap: wrap;
          
          .data-item, .sales-item {
            flex: 0 0 50%;
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}
</style> 