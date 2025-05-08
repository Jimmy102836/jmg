<template>
  <div class="task-list">
    <AdminLayout :breadcrumbs="[
      {title: '任务管理', path: '/admin/tasks'},
      {title: '任务列表', path: '/admin/tasks/list'}
    ]">
      <div class="page-header">
        <h2 class="page-title">任务列表</h2>
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i> 添加任务
        </el-button>
      </div>
      
      <!-- 搜索和筛选区域 -->
      <el-card class="filter-card">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="任务名称">
            <el-input
              v-model="filterForm.name"
              placeholder="请输入任务名称"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="发布商家">
            <el-input
              v-model="filterForm.merchant"
              placeholder="请输入商家名称"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="任务类型">
            <el-select v-model="filterForm.type" placeholder="请选择任务类型" clearable>
              <el-option label="短视频推广" value="video" />
              <el-option label="直播带货" value="live" />
              <el-option label="产品测评" value="review" />
              <el-option label="图文种草" value="article" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="待审核" value="pending" />
              <el-option label="进行中" value="running" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
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
            <span>任务列表</span>
            <div class="header-buttons">
              <el-button-group>
                <el-button type="primary" plain size="small" @click="handleBatchAudit" :disabled="selectedIds.length === 0">
                  <i class="el-icon-check"></i> 批量审核
                </el-button>
                <el-button type="danger" plain size="small" @click="handleBatchDelete" :disabled="selectedIds.length === 0">
                  <i class="el-icon-delete"></i> 批量删除
                </el-button>
              </el-button-group>
              <el-button type="warning" plain size="small" @click="handleExport" style="margin-left: 10px;">导出</el-button>
            </div>
          </div>
        </template>
        
        <el-table
          v-loading="loading"
          :data="taskList"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="任务ID" prop="id" width="80" />
          <el-table-column label="任务标题" prop="name" :show-overflow-tooltip="true" min-width="180" />
          <el-table-column label="商家名称" prop="merchant" :show-overflow-tooltip="true" width="120" />
          <el-table-column label="任务类型" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getTaskTypeTag(scope.row.type)">{{ getTaskTypeText(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="预算" prop="budget" width="100" align="center" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="申请人数" prop="applicants" width="100" align="center" />
          <el-table-column label="发布时间" prop="createTime" width="160" />
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="scope">
              <el-button type="text" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" @click="handleEdit(scope.row)" v-if="scope.row.status !== '3' && scope.row.status !== '4'">编辑</el-button>
              <el-button type="text" @click="handleAudit(scope.row)" v-if="scope.row.status === '1'">审核</el-button>
              <el-button type="text" class="text-success" @click="handleComplete(scope.row)" v-if="scope.row.status === '2'">完成</el-button>
              <el-button type="text" class="text-warning" @click="handleCancel(scope.row)" v-if="scope.row.status === '1' || scope.row.status === '2'">取消</el-button>
              <el-button type="text" class="text-danger" @click="handleDelete(scope.row)">删除</el-button>
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
      
      <!-- 任务审核对话框 -->
      <el-dialog v-model="auditDialogVisible" title="任务审核" width="500px" append-to-body>
        <el-form :model="auditForm" ref="auditFormRef" label-width="100px">
          <el-form-item label="任务标题" prop="name">
            <div>{{ auditForm.name }}</div>
          </el-form-item>
          <el-form-item label="商家名称" prop="merchant">
            <div>{{ auditForm.merchant }}</div>
          </el-form-item>
          <el-form-item label="任务类型" prop="type">
            <div>{{ getTaskTypeText(auditForm.type) }}</div>
          </el-form-item>
          <el-form-item label="预算" prop="budget">
            <div>{{ auditForm.budget }}</div>
          </el-form-item>
          <el-form-item label="审核结果" prop="result">
            <el-radio-group v-model="auditForm.result">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="comment">
            <el-input
              type="textarea"
              v-model="auditForm.comment"
              placeholder="请输入审核意见"
              :rows="4"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="auditDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitAudit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </AdminLayout>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { useStore } from 'vuex'

export default {
  name: 'TaskList',
  components: {
    AdminLayout,
    Search,
    Refresh
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const queryForm = ref(null)
    const auditFormRef = ref(null)
    
    const state = reactive({
      // 遮罩层
      loading: false,
      // 选中数组
      selectedIds: [],
      // 任务总数
      total: 0,
      // 日期范围
      dateRange: [],
      // 审核对话框
      auditDialogVisible: false,
      // 审核表单
      auditForm: {
        id: '',
        name: '',
        merchant: '',
        type: '',
        budget: '',
        result: 1,
        comment: ''
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: '',
        name: '',
        merchant: '',
        type: '',
        status: '',
        merchantId: route.query.merchantId || ''
      },
      // 任务类型选项
      taskTypeOptions: [
        { value: '1', label: '短视频' },
        { value: '2', label: '直播' },
        { value: '3', label: '图文' }
      ],
      // 任务状态选项
      statusOptions: [
        { value: '0', label: '草稿' },
        { value: '1', label: '审核中' },
        { value: '2', label: '进行中' },
        { value: '3', label: '已完成' },
        { value: '4', label: '已取消' }
      ],
      // 任务列表数据
      taskList: [],
      // 筛选表单
      filterForm: {
        name: '',
        merchant: '',
        type: '',
        status: '',
        dateRange: []
      },
      // 当前页码
      currentPage: ref(1),
      // 每页大小
      pageSize: ref(10)
    })
    
    // 获取任务列表
    const getList = async () => {
      state.loading = true
      try {
        // 组装查询参数
        const params = {
          page: state.currentPage,
          pageSize: state.pageSize,
          name: state.filterForm.name,
          merchant: state.filterForm.merchant,
          type: state.filterForm.type,
          status: state.filterForm.status,
          startDate: state.filterForm.dateRange && state.filterForm.dateRange[0],
          endDate: state.filterForm.dateRange && state.filterForm.dateRange[1]
        }
        const res = await store.dispatch('task/fetchTasks', params)
        state.taskList = res.data
        state.total = res.total
      } catch (error) {
        console.error('获取任务列表失败', error)
      } finally {
        state.loading = false
      }
    }
    
    // 查询按钮操作
    const handleQuery = () => {
      state.queryParams.pageNum = 1
      getList()
    }
    
    // 重置按钮操作
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
    
    // 选择行变化
    const handleSelectionChange = (selection) => {
      state.selectedIds = selection.map(item => item.id)
    }
    
    // 获取任务类型名称
    const getTaskTypeName = (type) => {
      const typeMap = {
        '1': '短视频',
        '2': '直播',
        '3': '图文'
      }
      return typeMap[type] || ''
    }
    
    // 获取任务类型样式
    const getTaskTypeClass = (type) => {
      const classMap = {
        '1': 'success',
        '2': 'danger',
        '3': 'info'
      }
      return classMap[type] || ''
    }
    
    // 获取状态名称
    const getStatusName = (status) => {
      const statusMap = {
        '0': '草稿',
        '1': '审核中',
        '2': '进行中',
        '3': '已完成',
        '4': '已取消'
      }
      return statusMap[status] || ''
    }
    
    // 获取状态样式
    const getStatusClass = (status) => {
      const classMap = {
        '0': 'info',
        '1': 'warning',
        '2': 'primary',
        '3': 'success',
        '4': 'danger'
      }
      return classMap[status] || ''
    }
    
    // 添加任务
    const handleAdd = () => {
      router.push('/admin/tasks/add')
    }
    
    // 查看任务
    const handleView = (row) => {
      router.push(`/admin/tasks/detail/${row.id}`)
    }
    
    // 编辑任务
    const handleEdit = (row) => {
      router.push(`/admin/tasks/edit/${row.id}`)
    }
    
    // 任务审核
    const handleAudit = (row) => {
      state.auditForm = {
        id: row.id,
        name: row.name,
        merchant: row.merchant,
        type: row.type,
        budget: row.budget,
        result: 1,
        comment: ''
      }
      state.auditDialogVisible = true
    }
    
    // 提交审核
    const submitAudit = async () => {
      try {
        await store.dispatch('task/auditTask', {
          taskId: state.auditForm.id,
          result: state.auditForm.result,
          comment: state.auditForm.comment
        })
        ElMessage.success('审核成功')
        state.auditDialogVisible = false
        getList()
      } catch (error) {
        ElMessage.error('审核失败')
      }
    }
    
    // 完成任务
    const handleComplete = (row) => {
      ElMessageBox.confirm(
        `确认将任务"${row.name}"标记为已完成吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await store.dispatch('task/completeTask', row.id)
          ElMessage.success('操作成功')
          getList()
        } catch (error) {
          ElMessage.error('操作失败')
        }
      }).catch(() => {})
    }
    
    // 取消任务
    const handleCancel = (row) => {
      ElMessageBox.confirm(
        `确认取消任务"${row.name}"吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await store.dispatch('task/cancelTask', row.id)
          ElMessage.success('任务已取消')
          getList()
        } catch (error) {
          ElMessage.error('操作失败')
        }
      }).catch(() => {})
    }
    
    // 删除任务
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除任务"${row.name}"吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await store.dispatch('task/deleteTask', row.id)
          ElMessage.success('删除成功')
          getList()
        } catch (error) {
          ElMessage.error('删除失败')
        }
      }).catch(() => {})
    }
    
    // 批量审核
    const handleBatchAudit = () => {
      ElMessageBox.confirm(
        `确认批量审核选中的 ${state.selectedIds.length} 个任务吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 模拟API调用
        setTimeout(() => {
          ElMessage.success('批量审核成功')
          getList()
        }, 500)
      }).catch(() => {})
    }
    
    // 批量删除
    const handleBatchDelete = () => {
      ElMessageBox.confirm(
        `确认删除选中的 ${state.selectedIds.length} 个任务吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await Promise.all(state.selectedIds.map(id => store.dispatch('task/deleteTask', id)))
          ElMessage.success('批量删除成功')
          getList()
        } catch (error) {
          ElMessage.error('批量删除失败')
        }
      }).catch(() => {})
    }
    
    // 导出数据
    const handleExport = () => {
      ElMessage.success('导出成功')
    }
    
    onMounted(() => {
      getList()
    })
    
    return {
      queryForm,
      auditFormRef,
      ...toRefs(state),
      getTaskTypeName,
      getTaskTypeClass,
      getStatusName,
      getStatusClass,
      handleQuery,
      resetQuery,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      handleAdd,
      handleView,
      handleEdit,
      handleAudit,
      submitAudit,
      handleComplete,
      handleCancel,
      handleDelete,
      handleBatchAudit,
      handleBatchDelete,
      handleExport
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
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
    
    .text-success {
      color: #67c23a;
    }
    
    .text-warning {
      color: #e6a23c;
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