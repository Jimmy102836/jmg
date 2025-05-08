<template>
  <div class="merchant-list">
    <AdminLayout :breadcrumbs="[
      {title: '用户管理', path: '/admin/users'},
      {title: '商家管理', path: '/admin/users/merchant'}
    ]">
      <div class="page-header">
        <h2 class="page-title">商家管理</h2>
        <el-button type="primary" @click="addMerchant">
          <i class="el-icon-plus"></i> 添加商家
        </el-button>
      </div>
      
      <!-- 搜索和筛选区域 -->
      <el-card class="filter-card">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="商家名称">
            <el-input
              v-model="filterForm.name"
              placeholder="请输入商家名称"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input
              v-model="filterForm.phone"
              placeholder="请输入联系电话"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="正常" value="normal" />
              <el-option label="禁用" value="disabled" />
              <el-option label="待审核" value="pending" />
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 数据表格 -->
      <el-card shadow="never" class="table-card">
        <template #header>
          <div class="card-header">
            <span>商家列表</span>
            <div class="header-buttons">
              <el-button type="warning" plain @click="exportData" size="small">导出</el-button>
            </div>
          </div>
        </template>
        
        <el-table
          v-loading="loading"
          :data="merchantList"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="ID" prop="id" width="80" />
          <el-table-column label="商家名称" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="头像" width="80" align="center">
            <template #default="scope">
              <el-avatar :size="40" :src="scope.row.avatar" />
            </template>
          </el-table-column>
          <el-table-column label="联系人" prop="contact" width="120" />
          <el-table-column label="手机号" prop="phone" width="120" />
          <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="注册时间" prop="registerTime" width="160" />
          <el-table-column label="最后登录" prop="lastLoginTime" width="160" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="text" @click="viewMerchant(scope.row)">查看</el-button>
              <el-button type="text" @click="editMerchant(scope.row)">编辑</el-button>
              <el-button type="text" @click="viewTasks(scope.row)">任务</el-button>
              <el-button type="text" class="text-danger" @click="deleteMerchant(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </AdminLayout>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { mockMerchants } from '@/mock/merchants.js'

export default {
  name: 'MerchantList',
  components: {
    AdminLayout,
    Search,
    Refresh
  },
  setup() {
    const router = useRouter()
    const queryForm = ref(null)
    
    const state = reactive({
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 商家总数
      total: 0,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        phone: '',
        status: ''
      },
      // 状态数据字典
      statusOptions: [
        { value: '1', label: '正常' },
        { value: '0', label: '禁用' },
        { value: '2', label: '冻结' }
      ],
      // 商家列表数据
      merchantList: [],
      // 筛选表单
      filterForm: {
        name: '',
        phone: '',
        status: '',
        dateRange: []
      },
      // 当前页码
      currentPage: ref(1),
      // 每页大小
      pageSize: ref(10)
    })
    
    // 获取商家列表
    const getList = () => {
      state.loading = true
      // 模拟API调用
      setTimeout(() => {
        state.merchantList = mockMerchants
        state.total = mockMerchants.length
        state.loading = false
      }, 500)
    }
    
    // 查询按钮
    const handleQuery = () => {
      state.queryParams.pageNum = 1
      getList()
    }
    
    // 重置按钮
    const resetQuery = () => {
      queryForm.value.resetFields()
      state.dateRange = []
      handleQuery()
    }
    
    // 分页
    const handleSizeChange = (val) => {
      state.queryParams.pageSize = val
      getList()
    }
    
    const handleCurrentChange = (val) => {
      state.queryParams.pageNum = val
      getList()
    }
    
    // 添加商家
    const addMerchant = () => {
      router.push('/admin/users/merchant/add')
    }
    
    // 查看商家详情
    const viewMerchant = (row) => {
      router.push(`/admin/users/merchant/detail/${row.id}`)
    }
    
    // 编辑商家
    const editMerchant = (row) => {
      router.push(`/admin/users/merchant/edit/${row.id}`)
    }
    
    // 查看商家任务
    const viewTasks = (row) => {
      router.push(`/admin/tasks/list?merchantId=${row.id}`)
    }
    
    // 删除商家
    const deleteMerchant = (row) => {
      ElMessageBox.confirm(
        `确定要删除商家"${row.name}"吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 模拟API调用
        setTimeout(() => {
          ElMessage.success('删除成功')
          getList()
        }, 500)
      }).catch(() => {})
    }
    
    // 修改商家状态
    const handleStatusChange = (row) => {
      const text = row.status === 'disabled' ? '启用' : '禁用'
      
      ElMessageBox.confirm(
        `确认要${text}商家"${row.name}"吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 模拟API调用
        setTimeout(() => {
          ElMessage.success(`${text}成功`)
          row.status = row.status === 'disabled' ? 'normal' : 'disabled'
        }, 500)
      }).catch(() => {
        row.status = row.status === 'disabled' ? 'normal' : 'disabled'
      })
    }
    
    // 导出数据
    const exportData = () => {
      ElMessage.success('导出成功')
    }
    
    // 搜索
    const handleSearch = () => {
      state.currentPage = 1
      getList()
    }
    
    // 重置
    const handleReset = () => {
      Object.keys(state.filterForm).forEach(key => {
        state.filterForm[key] = ''
      })
      state.filterForm.dateRange = []
      handleSearch()
    }
    
    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        normal: 'success',
        disabled: 'danger',
        pending: 'warning'
      }
      return statusMap[status] || 'info'
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        normal: '正常',
        disabled: '禁用',
        pending: '待审核'
      }
      return statusMap[status] || '未知'
    }
    
    onMounted(() => {
      getList()
    })
    
    return {
      queryForm,
      ...toRefs(state),
      handleQuery,
      resetQuery,
      handleSizeChange,
      handleCurrentChange,
      addMerchant,
      viewMerchant,
      editMerchant,
      viewTasks,
      deleteMerchant,
      handleStatusChange,
      exportData,
      handleSearch,
      handleReset,
      getStatusType,
      getStatusText
    }
  }
}
</script>

<style lang="scss" scoped>
.merchant-list {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .page-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  }
  
  .filter-card {
    margin-bottom: 20px;
  }
  
  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .text-danger {
      color: #f56c6c;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style> 