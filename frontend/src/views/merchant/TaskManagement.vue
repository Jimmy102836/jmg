<template>
  <div class="task-management">
    <MerchantLayout :breadcrumbs="[{title: '任务管理', path: '/merchant/tasks'}]">
      <div class="page-header">
        <h2 class="page-title">任务管理</h2>
        <el-button type="primary" @click="createTask">
          <i class="el-icon-plus"></i> 发布新任务
        </el-button>
      </div>
      
      <!-- 搜索和筛选区域 -->
      <el-card class="filter-container" shadow="never">
        <el-form :inline="true" :model="queryParams" class="filter-form">
          <el-form-item label="任务标题">
            <el-input v-model="queryParams.title" placeholder="请输入任务标题" clearable></el-input>
          </el-form-item>
          
          <el-form-item label="任务类型">
            <el-select v-model="queryParams.taskType" placeholder="所有类型" clearable>
              <el-option v-for="item in taskTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="任务状态">
            <el-select v-model="queryParams.status" placeholder="所有状态" clearable>
              <el-option v-for="item in taskStatuses" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="queryParams.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD">
            </el-date-picker>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 任务列表 -->
      <el-card shadow="never" class="task-list-card">
        <template #header>
          <div class="card-header">
            <span>我的任务列表</span>
            <div class="header-operations">
              <el-button type="text" @click="refreshList">
                <i class="el-icon-refresh"></i> 刷新
              </el-button>
              <el-button type="text" @click="batchDelete" :disabled="selectedTasks.length === 0">
                <i class="el-icon-delete"></i> 批量删除
              </el-button>
              <el-dropdown @command="handleExport">
                <el-button type="text">
                  <i class="el-icon-download"></i> 导出 <i class="el-icon-arrow-down"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="current">导出当前页</el-dropdown-item>
                    <el-dropdown-item command="selected" :disabled="selectedTasks.length === 0">导出选中项</el-dropdown-item>
                    <el-dropdown-item command="all">导出全部</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
        
        <el-table
          ref="taskTable"
          v-loading="loading"
          :data="taskList"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="title" label="任务标题" min-width="180" show-overflow-tooltip>
            <template #default="scope">
              <router-link :to="`/merchant/tasks/${scope.row.id}`" class="task-link">
                {{ scope.row.title }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="100"></el-table-column>
          <el-table-column prop="taskType" label="类型" width="100">
            <template #default="scope">
              {{ getTaskTypeName(scope.row.taskType) }}
            </template>
          </el-table-column>
          <el-table-column prop="budget" label="预算(元)" width="120" sortable>
            <template #default="scope">
              {{ scope.row.budget.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="申请/总数" width="100">
            <template #default="scope">
              {{ scope.row.applyCount }}/{{ scope.row.totalCount }}
            </template>
          </el-table-column>
          <el-table-column prop="completeCount" label="已完成" width="80" sortable></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusName(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="180" sortable>
            <template #default="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="text" size="small" @click="viewTask(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="editTask(scope.row)" 
                         :disabled="!['0', '1'].includes(scope.row.status)">编辑</el-button>
              <el-button type="text" size="small" @click="viewApplications(scope.row)">申请</el-button>
              <el-button type="text" size="small" @click="deleteTask(scope.row)" class="delete-btn">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :current-page="queryParams.pageNum"
            :page-size="queryParams.pageSize"
            :total="totalTasks"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </el-card>
    </MerchantLayout>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MerchantLayout from '@/components/merchant/MerchantLayout.vue'
import { formatDate as formatDateUtil } from '@/utils/date'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'TaskManagement',
  components: {
    MerchantLayout
  },
  setup() {
    const router = useRouter()
    const taskTable = ref(null)
    const loading = ref(false)
    const selectedTasks = ref([])
    const totalTasks = ref(0)
    
    // 查询参数
    const queryParams = reactive({
      title: '',
      taskType: '',
      status: '',
      dateRange: [],
      pageNum: 1,
      pageSize: 10,
      orderByColumn: 'createTime',
      isAsc: 'desc'
    })
    
    // 任务类型选项
    const taskTypes = ref([
      { value: '1', label: '短视频' },
      { value: '2', label: '直播' },
      { value: '3', label: '图文' }
    ])
    
    // 任务状态选项
    const taskStatuses = ref([
      { value: '0', label: '草稿' },
      { value: '1', label: '审核中' },
      { value: '2', label: '进行中' },
      { value: '3', label: '已完成' },
      { value: '4', label: '已取消' }
    ])
    
    // 任务列表数据
    const taskList = ref([
      {
        id: 1,
        title: '抖音电商带货短视频推广',
        category: '电商',
        taskType: '1',
        budget: 5000.00,
        applyCount: 8,
        totalCount: 20,
        completeCount: 3,
        status: '2',
        createTime: '2023-05-20 15:30:45'
      },
      {
        id: 2,
        title: '美妆新品上市推广计划',
        category: '美妆',
        taskType: '2',
        budget: 8000.00,
        applyCount: 5,
        totalCount: 10,
        completeCount: 2,
        status: '2',
        createTime: '2023-05-18 10:15:22'
      },
      {
        id: 3,
        title: '夏季服装搭配短视频',
        category: '服装',
        taskType: '1',
        budget: 3000.00,
        applyCount: 12,
        totalCount: 15,
        completeCount: 10,
        status: '3',
        createTime: '2023-05-10 09:45:30'
      },
      {
        id: 4,
        title: '新款手机开箱测评',
        category: '数码',
        taskType: '1',
        budget: 4500.00,
        applyCount: 0,
        totalCount: 5,
        completeCount: 0,
        status: '1',
        createTime: '2023-05-22 16:20:18'
      },
      {
        id: 5,
        title: '零食试吃达人直播',
        category: '食品',
        taskType: '2',
        budget: 6000.00,
        applyCount: 3,
        totalCount: 8,
        completeCount: 1,
        status: '2',
        createTime: '2023-05-15 14:10:35'
      }
    ])
    
    // 格式化日期
    const formatDate = (dateStr) => {
      return formatDateUtil(dateStr, 'YYYY-MM-DD HH:mm')
    }
    
    // 获取任务类型名称
    const getTaskTypeName = (type) => {
      const typeMap = {
        '1': '短视频',
        '2': '直播',
        '3': '图文'
      }
      return typeMap[type] || '未知'
    }
    
    // 获取任务状态名称
    const getStatusName = (status) => {
      const statusMap = {
        '0': '草稿',
        '1': '审核中',
        '2': '进行中',
        '3': '已完成',
        '4': '已取消'
      }
      return statusMap[status] || '未知'
    }
    
    // 获取状态标签类型
    const getStatusType = (status) => {
      const typeMap = {
        '0': 'info',
        '1': 'warning',
        '2': 'success',
        '3': 'info',
        '4': 'danger'
      }
      return typeMap[status] || ''
    }
    
    // 创建新任务
    const createTask = () => {
      router.push('/merchant/tasks/create')
    }
    
    // 查看任务详情
    const viewTask = (row) => {
      router.push(`/merchant/tasks/${row.id}`)
    }
    
    // 编辑任务
    const editTask = (row) => {
      router.push(`/merchant/tasks/${row.id}/edit`)
    }
    
    // 查看任务申请列表
    const viewApplications = (row) => {
      router.push(`/merchant/tasks/${row.id}/applications`)
    }
    
    // 删除任务
    const deleteTask = (row) => {
      ElMessageBox.confirm(`确定要删除任务"${row.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里是删除任务的API调用
        // 示例代码仅做演示
        setTimeout(() => {
          ElMessage.success('删除成功')
          const index = taskList.value.findIndex(item => item.id === row.id)
          if (index !== -1) {
            taskList.value.splice(index, 1)
          }
        }, 500)
      }).catch(() => {})
    }
    
    // 批量删除
    const batchDelete = () => {
      if (selectedTasks.value.length === 0) {
        ElMessage.warning('请选择要删除的任务')
        return
      }
      
      const taskNames = selectedTasks.value.map(item => item.title).join('、')
      ElMessageBox.confirm(`确定要删除选中的 ${selectedTasks.value.length} 个任务吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里是批量删除任务的API调用
        // 示例代码仅做演示
        setTimeout(() => {
          ElMessage.success('批量删除成功')
          const ids = selectedTasks.value.map(item => item.id)
          taskList.value = taskList.value.filter(item => !ids.includes(item.id))
          selectedTasks.value = []
        }, 500)
      }).catch(() => {})
    }
    
    // 表格选择项变化
    const handleSelectionChange = (selection) => {
      selectedTasks.value = selection
    }
    
    // 处理搜索
    const handleSearch = () => {
      queryParams.pageNum = 1
      getTaskList()
    }
    
    // 重置查询条件
    const resetQuery = () => {
      queryParams.title = ''
      queryParams.taskType = ''
      queryParams.status = ''
      queryParams.dateRange = []
      queryParams.pageNum = 1
      getTaskList()
    }
    
    // 刷新列表
    const refreshList = () => {
      getTaskList()
    }
    
    // 处理导出
    const handleExport = (command) => {
      let message = ''
      switch (command) {
        case 'current':
          message = '当前页'
          break
        case 'selected':
          message = `选中的 ${selectedTasks.value.length} 项`
          break
        case 'all':
          message = '全部数据'
          break
      }
      
      ElMessage.success(`已导出${message}`)
    }
    
    // 分页大小变化
    const handleSizeChange = (val) => {
      queryParams.pageSize = val
      getTaskList()
    }
    
    // 页码变化
    const handleCurrentChange = (val) => {
      queryParams.pageNum = val
      getTaskList()
    }
    
    // 获取任务列表
    const getTaskList = () => {
      loading.value = true
      
      // 这里应该是API调用
      // 示例代码仅做演示
      setTimeout(() => {
        // 在真实环境中，这里会从API获取数据
        totalTasks.value = 28
        loading.value = false
      }, 500)
    }
    
    onMounted(() => {
      getTaskList()
    })
    
    return {
      taskTable,
      loading,
      queryParams,
      taskTypes,
      taskStatuses,
      taskList,
      totalTasks,
      selectedTasks,
      formatDate,
      getTaskTypeName,
      getStatusName,
      getStatusType,
      createTask,
      viewTask,
      editTask,
      viewApplications,
      deleteTask,
      batchDelete,
      handleSelectionChange,
      handleSearch,
      resetQuery,
      refreshList,
      handleExport,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style lang="scss" scoped>
.task-management {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }
  
  .filter-container {
    margin-bottom: 20px;
    
    .filter-form {
      display: flex;
      flex-wrap: wrap;
    }
  }
  
  .task-list-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      span {
        font-size: 16px;
        font-weight: 500;
      }
      
      .header-operations {
        display: flex;
        align-items: center;
        
        .el-button + .el-button,
        .el-button + .el-dropdown {
          margin-left: 10px;
        }
      }
    }
    
    .task-link {
      color: #409eff;
      text-decoration: none;
      
      &:hover {
        color: #ff2c55;
      }
    }
    
    .delete-btn {
      color: #f56c6c;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style> 