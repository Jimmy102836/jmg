<template>
  <div class="material-list">
    <AdminLayout :breadcrumbs="[
      {title: '素材管理', path: '/admin/materials'},
      {title: '素材列表', path: '/admin/materials/list'}
    ]">
      <div class="page-header">
        <h2 class="page-title">素材库管理</h2>
        <el-button type="primary" @click="handleUpload">
          <i class="el-icon-plus"></i> 上传素材
        </el-button>
      </div>
      
      <!-- 搜索和筛选区域 -->
      <el-card shadow="never" class="search-card">
        <el-form :inline="true" :model="filterForm" ref="filterForm" class="search-form">
          <el-form-item label="素材名称">
            <el-input
              v-model="filterForm.name"
              placeholder="请输入素材名称"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="上传商家">
            <el-input
              v-model="filterForm.merchant"
              placeholder="请输入商家名称"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="素材类型">
            <el-select v-model="filterForm.type" placeholder="请选择素材类型" clearable>
              <el-option label="图片" value="image" />
              <el-option label="视频" value="video" />
              <el-option label="文档" value="document" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="待审核" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已拒绝" value="rejected" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="上传时间">
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
      
      <!-- 素材展示区域 -->
      <el-card shadow="never" class="material-card">
        <template #header>
          <div class="card-header">
            <span>素材列表</span>
            <div class="view-switch">
              <el-radio-group v-model="viewMode" size="small">
                <el-radio-button label="grid"><i class="el-icon-s-grid"></i></el-radio-button>
                <el-radio-button label="table"><i class="el-icon-document"></i></el-radio-button>
              </el-radio-group>
            </div>
            <div class="header-operations">
              <el-button type="success" @click="handleExport">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
            </div>
          </div>
        </template>
        
        <!-- 网格视图 -->
        <template v-if="viewMode === 'grid'">
          <el-row :gutter="16">
            <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="item in materialList" :key="item.id">
              <el-card class="material-item" shadow="hover" @click="handlePreview(item)">
                <div class="material-thumbnail" :class="{'is-video': item.materialType === '2'}">
                  <img :src="item.thumbnail" v-if="item.materialType !== '3'">
                  <div class="text-preview" v-else>
                    <i class="el-icon-document"></i>
                    <span>文本素材</span>
                  </div>
                  <div class="material-type-icon" v-if="item.materialType === '2'">
                    <i class="el-icon-video-play"></i>
                  </div>
                </div>
                <div class="material-info">
                  <div class="material-title">{{ item.title }}</div>
                  <div class="material-meta">
                    <span class="meta-item">
                      <i class="el-icon-user"></i> {{ item.userName }}
                    </span>
                    <span class="meta-item">
                      <i class="el-icon-date"></i> {{ formatDate(item.createTime) }}
                    </span>
                  </div>
                </div>
                <div class="material-actions">
                  <el-button type="text" size="mini" @click.stop="handleEdit(item)">
                    <i class="el-icon-edit"></i>
                  </el-button>
                  <el-button type="text" size="mini" @click.stop="handleAssign(item)">
                    <i class="el-icon-share"></i>
                  </el-button>
                  <el-button type="text" size="mini" @click.stop="handleDelete(item)" class="text-danger">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </template>
        
        <!-- 表格视图 -->
        <template v-else>
          <el-table
            v-loading="loading"
            :data="materialList"
            style="width: 100%"
            border
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="ID" prop="id" width="80" />
            <el-table-column label="素材预览" width="120">
              <template #default="{ row }">
                <el-image
                  v-if="row.materialType === '1'"
                  :src="row.thumbnail"
                  :preview-src-list="[row.thumbnail]"
                  fit="cover"
                  class="material-preview"
                />
                <el-icon v-else-if="row.materialType === '2'" class="material-icon">
                  <VideoPlay />
                </el-icon>
                <el-icon v-else class="material-icon">
                  <Document />
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column label="素材名称" prop="title" :show-overflow-tooltip="true" />
            <el-table-column label="上传商家" prop="userName" width="120" />
            <el-table-column label="素材类型" width="100" align="center">
              <template #default="scope">
                <el-tag :type="getMaterialTypeClass(scope.row.materialType)">
                  {{ getMaterialTypeName(scope.row.materialType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="文件大小" prop="fileSize" width="100" align="center">
              <template #default="scope">
                {{ formatFileSize(scope.row.fileSize) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100" align="center">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="上传时间" prop="createTime" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button type="text" @click="handlePreview(scope.row)">预览</el-button>
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleAssign(scope.row)">分配</el-button>
                <el-button type="text" class="text-danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        
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
      
      <!-- 素材预览对话框 -->
      <el-dialog 
        v-model="previewVisible"
        title="素材预览"
        width="800px"
        destroy-on-close
        append-to-body
      >
        <div class="preview-container" v-if="currentMaterial">
          <!-- 图片预览 -->
          <div v-if="currentMaterial.materialType === '1'" class="image-preview">
            <el-image 
              :src="currentMaterial.filePath" 
              fit="contain"
              style="max-width: 100%; max-height: 500px;"
            />
          </div>
          
          <!-- 视频预览 -->
          <div v-if="currentMaterial.materialType === '2'" class="video-preview">
            <video controls :src="currentMaterial.filePath" style="max-width: 100%; max-height: 500px;"></video>
          </div>
          
          <!-- 文本预览 -->
          <div v-if="currentMaterial.materialType === '3'" class="text-preview">
            <pre>{{ currentMaterial.content }}</pre>
          </div>
          
          <div class="preview-info">
            <h3>{{ currentMaterial.title }}</h3>
            <p><strong>上传商家：</strong> {{ currentMaterial.userName }}</p>
            <p><strong>素材类型：</strong> {{ getMaterialTypeName(currentMaterial.materialType) }}</p>
            <p v-if="currentMaterial.materialType !== '3'"><strong>文件大小：</strong> {{ formatFileSize(currentMaterial.fileSize) }}</p>
            <p><strong>上传时间：</strong> {{ currentMaterial.createTime }}</p>
          </div>
        </div>
      </el-dialog>
    </AdminLayout>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { Search, Refresh, Download, VideoPlay, Document } from '@element-plus/icons-vue'
import { mockMaterials } from '@/mock/materials.js'

export default {
  name: 'MaterialList',
  components: {
    AdminLayout,
    Search,
    Refresh,
    Download,
    VideoPlay,
    Document
  },
  setup() {
    const router = useRouter()
    const filterForm = ref(null)
    
    const state = reactive({
      // 遮罩层
      loading: false,
      // 素材总数
      total: 0,
      // 日期范围
      dateRange: [],
      // 视图模式
      viewMode: 'grid',
      // 预览弹窗
      previewVisible: false,
      // 当前预览素材
      currentMaterial: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 12,
        title: '',
        userName: '',
        materialType: '',
        status: ''
      },
      // 素材类型选项
      materialTypeOptions: [
        { value: '1', label: '图片' },
        { value: '2', label: '视频' },
        { value: '3', label: '文本' }
      ],
      // 素材列表数据
      materialList: [],
      currentPage: 1,
      pageSize: 10
    })
    
    // 获取素材列表
    const getList = () => {
      state.loading = true
      
      // 模拟API调用
      setTimeout(() => {
        state.materialList = [...mockMaterials]
        state.total = mockMaterials.length
        state.loading = false
      }, 500)
    }
    
    // 获取素材类型名称
    const getMaterialTypeName = (type) => {
      const typeMap = {
        '1': '图片',
        '2': '视频',
        '3': '文本'
      }
      return typeMap[type] || '未知'
    }
    
    // 获取素材类型样式
    const getMaterialTypeClass = (type) => {
      const classMap = {
        '1': 'success',
        '2': 'danger',
        '3': 'info'
      }
      return classMap[type] || ''
    }
    
    // 格式化文件大小
    const formatFileSize = (size) => {
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
      } else {
        return (size / (1024 * 1024)).toFixed(2) + 'MB'
      }
    }
    
    // 格式化日期
    const formatDate = (dateStr) => {
      return dateStr ? dateStr.split(' ')[0] : ''
    }
    
    // 查询按钮操作
    const handleSearch = () => {
      state.currentPage = 1
      getList()
    }
    
    // 重置按钮操作
    const handleReset = () => {
      filterForm.value.resetFields()
      state.dateRange = []
      handleSearch()
    }
    
    // 分页
    const handleSizeChange = (val) => {
      state.pageSize = val
      getList()
    }
    
    const handleCurrentChange = (val) => {
      state.currentPage = val
      getList()
    }
    
    // 上传素材
    const handleUpload = () => {
      router.push('/admin/materials/upload')
    }
    
    // 预览素材
    const handlePreview = (row) => {
      state.currentMaterial = row
      state.previewVisible = true
    }
    
    // 编辑素材
    const handleEdit = (row) => {
      router.push(`/admin/materials/edit/${row.id}`)
    }
    
    // 分配素材
    const handleAssign = (row) => {
      router.push(`/admin/materials/assign/${row.id}`)
    }
    
    // 删除素材
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除素材"${row.title}"吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 模拟API调用
        setTimeout(() => {
          const index = state.materialList.findIndex(item => item.id === row.id)
          if (index !== -1) {
            state.materialList.splice(index, 1)
            state.total--
          }
          ElMessage.success('删除成功')
        }, 500)
      }).catch(() => {})
    }
    
    // 获取状态标签样式
    const getStatusType = (status) => {
      const statusMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      }
      return statusMap[status] || 'info'
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝'
      }
      return statusMap[status] || '未知'
    }
    
    // 导出数据
    const handleExport = () => {
      // 实现导出功能
      ElMessage.success('导出成功')
    }
    
    onMounted(() => {
      getList()
    })
    
    return {
      filterForm,
      ...toRefs(state),
      getMaterialTypeName,
      getMaterialTypeClass,
      formatFileSize,
      formatDate,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      handleUpload,
      handlePreview,
      handleEdit,
      handleAssign,
      handleDelete,
      getStatusType,
      getStatusText,
      handleExport
    }
  }
}
</script>

<style lang="scss" scoped>
.material-list {
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
  
  .search-card {
    margin-bottom: 20px;
  }
  
  .material-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .material-item {
      margin-bottom: 16px;
      cursor: pointer;
      
      .material-thumbnail {
        height: 160px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        position: relative;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .text-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #909399;
          
          i {
            font-size: 32px;
            margin-bottom: 8px;
          }
        }
        
        .material-type-icon {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      
      .material-info {
        padding: 12px;
        
        .material-title {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .material-meta {
          font-size: 12px;
          color: #909399;
          
          .meta-item {
            margin-right: 10px;
            
            i {
              margin-right: 4px;
            }
          }
        }
      }
      
      .material-actions {
        padding: 0 12px 12px;
        display: flex;
        justify-content: space-around;
        
        .text-danger {
          color: #f56c6c;
        }
      }
    }
  }
  
  .text-placeholder, .image-placeholder {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    
    i {
      font-size: 24px;
      color: #909399;
    }
  }
  
  .preview-container {
    .image-preview, .video-preview, .text-preview {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
    }
    
    .text-preview {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 0;
        font-family: inherit;
        max-height: 300px;
        overflow-y: auto;
      }
    }
    
    .preview-info {
      border-top: 1px solid #ebeef5;
      padding-top: 20px;
      
      h3 {
        margin-top: 0;
        margin-bottom: 16px;
      }
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style> 