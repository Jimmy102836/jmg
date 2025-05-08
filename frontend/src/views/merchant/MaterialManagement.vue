<template>
  <div class="material-management">
    <MerchantLayout :breadcrumbs="[{title: '素材管理', path: '/merchant/materials'}]">
      <div class="page-header">
        <h2 class="page-title">素材管理</h2>
        <el-button type="primary" @click="uploadMaterial">
          <i class="el-icon-plus"></i> 上传素材
        </el-button>
      </div>
      
      <!-- 搜索和筛选区域 -->
      <el-card class="filter-container" shadow="never">
        <el-form :inline="true" :model="queryParams" class="filter-form">
          <el-form-item label="素材名称">
            <el-input v-model="queryParams.title" placeholder="请输入素材名称" clearable></el-input>
          </el-form-item>
          
          <el-form-item label="素材类型">
            <el-select v-model="queryParams.materialType" placeholder="所有类型" clearable>
              <el-option v-for="item in materialTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="上传时间">
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
      
      <!-- 素材展示区域 -->
      <el-card shadow="never" class="material-list-card">
        <template #header>
          <div class="card-header">
            <span>我的素材库</span>
            <div class="header-operations">
              <el-radio-group v-model="viewMode" size="small">
                <el-radio-button label="grid">
                  <i class="el-icon-s-grid"></i>
                </el-radio-button>
                <el-radio-button label="list">
                  <i class="el-icon-document"></i>
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>
        
        <!-- 素材展示 - 网格模式 -->
        <div v-if="viewMode === 'grid'" class="material-grid">
          <el-row :gutter="16">
            <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="item in materialList" :key="item.id">
              <el-card class="material-card" shadow="hover" @click="previewMaterial(item)">
                <div class="material-thumbnail" :class="{'is-video': item.materialType === '2'}">
                  <img :src="item.thumbnail" :alt="item.title" v-if="item.materialType !== '3'">
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
                    <span class="material-type">{{ getMaterialTypeName(item.materialType) }}</span>
                    <span class="material-size">{{ formatFileSize(item.fileSize) }}</span>
                  </div>
                </div>
                <div class="material-actions">
                  <el-button type="text" @click.stop="editMaterial(item)">
                    <i class="el-icon-edit"></i>
                  </el-button>
                  <el-button type="text" @click.stop="copyMaterialUrl(item)">
                    <i class="el-icon-copy-document"></i>
                  </el-button>
                  <el-button type="text" @click.stop="deleteMaterial(item)" class="delete-btn">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
      
      <!-- 上传素材对话框 -->
      <el-dialog
        title="上传素材"
        v-model="uploadDialogVisible"
        width="500px"
        append-to-body
        destroy-on-close>
        <el-form ref="uploadForm" :model="uploadForm" :rules="uploadRules" label-width="80px">
          <el-form-item label="素材类型" prop="materialType">
            <el-select v-model="uploadForm.materialType" placeholder="请选择素材类型" style="width: 100%">
              <el-option v-for="item in materialTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="素材标题" prop="title">
            <el-input v-model="uploadForm.title" placeholder="请输入素材标题"></el-input>
          </el-form-item>
          
          <el-form-item label="素材文件" prop="file" v-if="uploadForm.materialType !== '3'">
            <el-upload
              ref="upload"
              :action="uploadAction"
              :before-upload="beforeUpload"
              :limit="1"
              :auto-upload="false"
              :on-exceed="handleExceed"
              :on-change="handleFileChange">
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  {{ getUploadTip(uploadForm.materialType) }}
                </div>
              </template>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="文本内容" prop="content" v-if="uploadForm.materialType === '3'">
            <el-input
              type="textarea"
              v-model="uploadForm.content"
              :rows="6"
              placeholder="请输入文本内容">
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelUpload">取消</el-button>
            <el-button type="primary" @click="submitUpload">确认上传</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 素材预览对话框 -->
      <el-dialog
        title="素材预览"
        v-model="previewDialogVisible"
        width="800px"
        append-to-body
        destroy-on-close
        class="preview-dialog">
        <div class="preview-content" v-if="currentMaterial">
          <!-- 图片预览 -->
          <div v-if="currentMaterial.materialType === '1'" class="image-preview">
            <img :src="currentMaterial.filePath" :alt="currentMaterial.title">
          </div>
          
          <!-- 视频预览 -->
          <div v-if="currentMaterial.materialType === '2'" class="video-preview">
            <video controls :src="currentMaterial.filePath" width="100%"></video>
          </div>
          
          <!-- 文本预览 -->
          <div v-if="currentMaterial.materialType === '3'" class="text-preview-content">
            <pre>{{ currentMaterial.content }}</pre>
          </div>
          
          <div class="preview-info">
            <h3>{{ currentMaterial.title }}</h3>
            <div class="info-item">
              <span class="label">素材类型:</span>
              <span>{{ getMaterialTypeName(currentMaterial.materialType) }}</span>
            </div>
            <div class="info-item" v-if="currentMaterial.materialType !== '3'">
              <span class="label">文件大小:</span>
              <span>{{ formatFileSize(currentMaterial.fileSize) }}</span>
            </div>
            <div class="info-item">
              <span class="label">上传时间:</span>
              <span>{{ formatDate(currentMaterial.createTime) }}</span>
            </div>
          </div>
        </div>
      </el-dialog>
    </MerchantLayout>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MerchantLayout from '@/components/merchant/MerchantLayout.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'MaterialManagement',
  components: {
    MerchantLayout
  },
  setup() {
    const router = useRouter()
    const viewMode = ref('grid')
    const loading = ref(false)
    const uploadDialogVisible = ref(false)
    const previewDialogVisible = ref(false)
    const currentMaterial = ref(null)
    
    // 查询参数
    const queryParams = reactive({
      title: '',
      materialType: '',
      dateRange: [],
      pageNum: 1,
      pageSize: 20
    })
    
    // 素材类型选项
    const materialTypes = ref([
      { value: '1', label: '图片' },
      { value: '2', label: '视频' },
      { value: '3', label: '文本' }
    ])
    
    // 上传表单
    const uploadForm = reactive({
      materialType: '1',
      title: '',
      content: '',
      file: null
    })
    
    // 上传表单规则
    const uploadRules = {
      materialType: [
        { required: true, message: '请选择素材类型', trigger: 'change' }
      ],
      title: [
        { required: true, message: '请输入素材标题', trigger: 'blur' },
        { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请输入文本内容', trigger: 'blur' }
      ]
    }
    
    // 模拟素材列表数据
    const materialList = ref([
      {
        id: 1,
        title: '夏季新品主图',
        materialType: '1',
        fileSize: 1024 * 512, // 512KB
        filePath: 'https://placeholder.pics/svg/300x300/DEDEDE/555555/Product%20Image',
        thumbnail: 'https://placeholder.pics/svg/300x300/DEDEDE/555555/Product%20Image',
        createTime: '2023-05-20 10:30:45'
      },
      {
        id: 2,
        title: '产品使用视频',
        materialType: '2',
        fileSize: 1024 * 1024 * 15, // 15MB
        filePath: 'https://www.example.com/video.mp4',
        thumbnail: 'https://placeholder.pics/svg/300x300/DEDEDE/555555/Video%20Thumbnail',
        createTime: '2023-05-18 14:25:30'
      },
      {
        id: 3,
        title: '产品文案说明',
        materialType: '3',
        fileSize: 1024 * 2, // 2KB
        content: '这是一段产品文案说明，详细介绍了产品的特点、使用方法和注意事项。适合用于抖音带货视频的文案参考。',
        createTime: '2023-05-15 09:40:22'
      },
      {
        id: 4,
        title: '优惠活动海报',
        materialType: '1',
        fileSize: 1024 * 780, // 780KB
        filePath: 'https://placeholder.pics/svg/300x300/DEDEDE/555555/Promotion%20Poster',
        thumbnail: 'https://placeholder.pics/svg/300x300/DEDEDE/555555/Promotion%20Poster',
        createTime: '2023-05-12 16:50:18'
      },
      {
        id: 5,
        title: '产品开箱视频',
        materialType: '2',
        fileSize: 1024 * 1024 * 25, // 25MB
        filePath: 'https://www.example.com/unboxing.mp4',
        thumbnail: 'https://placeholder.pics/svg/300x300/DEDEDE/555555/Unboxing%20Video',
        createTime: '2023-05-10 11:20:35'
      },
      {
        id: 6,
        title: '直播话术模板',
        materialType: '3',
        fileSize: 1024 * 3, // 3KB
        content: '这是一段直播话术模板，包含开场白、产品介绍、优惠说明和互动环节的话术内容，适合直播带货使用。',
        createTime: '2023-05-08 15:10:42'
      }
    ])
    
    // 获取素材类型名称
    const getMaterialTypeName = (type) => {
      const typeMap = {
        '1': '图片',
        '2': '视频',
        '3': '文本'
      }
      return typeMap[type] || '未知'
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
      return dateStr
    }
    
    // 获取上传提示文本
    const getUploadTip = (type) => {
      const tipMap = {
        '1': '只能上传jpg/png/gif文件，且不超过5MB',
        '2': '只能上传mp4/mov文件，且不超过50MB'
      }
      return tipMap[type] || ''
    }
    
    // 上传素材
    const uploadMaterial = () => {
      uploadDialogVisible.value = true
    }
    
    // 提交上传
    const submitUpload = () => {
      // 这里是上传逻辑
      ElMessage.success('上传成功')
      uploadDialogVisible.value = false
    }
    
    // 取消上传
    const cancelUpload = () => {
      uploadDialogVisible.value = false
    }
    
    // 预览素材
    const previewMaterial = (material) => {
      currentMaterial.value = material
      previewDialogVisible.value = true
    }
    
    // 编辑素材
    const editMaterial = (material) => {
      ElMessage.info('编辑素材: ' + material.title)
    }
    
    // 复制素材链接
    const copyMaterialUrl = (material) => {
      ElMessage.success('已复制素材链接')
    }
    
    // 删除素材
    const deleteMaterial = (material) => {
      ElMessageBox.confirm(`确定要删除素材"${material.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里是删除素材的API调用
        ElMessage.success('删除成功')
        const index = materialList.value.findIndex(item => item.id === material.id)
        if (index !== -1) {
          materialList.value.splice(index, 1)
        }
      }).catch(() => {})
    }
    
    // 处理搜索
    const handleSearch = () => {
      // 这里是搜索逻辑
    }
    
    // 重置查询条件
    const resetQuery = () => {
      queryParams.title = ''
      queryParams.materialType = ''
      queryParams.dateRange = []
    }
    
    // 上传相关方法
    const uploadAction = ''
    
    const beforeUpload = (file) => {
      // 这里是上传前的验证逻辑
      return true
    }
    
    const handleExceed = () => {
      ElMessage.warning('最多只能上传一个文件')
    }
    
    const handleFileChange = (file) => {
      uploadForm.file = file
    }
    
    onMounted(() => {
      // 初始化数据
    })
    
    return {
      viewMode,
      loading,
      queryParams,
      materialTypes,
      materialList,
      uploadDialogVisible,
      previewDialogVisible,
      currentMaterial,
      uploadForm,
      uploadRules,
      uploadAction,
      getMaterialTypeName,
      formatFileSize,
      formatDate,
      getUploadTip,
      uploadMaterial,
      submitUpload,
      cancelUpload,
      previewMaterial,
      editMaterial,
      copyMaterialUrl,
      deleteMaterial,
      handleSearch,
      resetQuery,
      beforeUpload,
      handleExceed,
      handleFileChange
    }
  }
}
</script>

<style lang="scss" scoped>
.material-management {
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
  
  .material-list-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      span {
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .material-grid {
      margin-bottom: 20px;
      
      .material-card {
        margin-bottom: 16px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        
        .material-thumbnail {
          position: relative;
          height: 160px;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .text-preview {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #999;
            
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
          padding: 10px;
          
          .material-title {
            font-size: 14px;
            color: #303133;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .material-meta {
            display: flex;
            justify-content: space-between;
            color: #909399;
            font-size: 12px;
          }
        }
        
        .material-actions {
          display: flex;
          justify-content: space-around;
          padding: 0 10px 10px;
          
          .el-button {
            padding: 0;
            
            &.delete-btn {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }
  
  .preview-dialog {
    .preview-content {
      .image-preview, .video-preview {
        text-align: center;
        margin-bottom: 20px;
        max-height: 500px;
        overflow: hidden;
        
        img, video {
          max-width: 100%;
          max-height: 500px;
        }
      }
      
      .text-preview-content {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        max-height: 300px;
        overflow-y: auto;
        
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 0;
          font-family: inherit;
        }
      }
      
      .preview-info {
        h3 {
          margin-top: 0;
          margin-bottom: 15px;
        }
        
        .info-item {
          margin-bottom: 8px;
          
          .label {
            font-weight: bold;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style> 