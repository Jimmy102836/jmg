<template>
  <div class="task-create-container">
    <div class="page-title">
      <h2>发布任务</h2>
      <p>发布一个新的推广任务，招募达人进行推广</p>
    </div>
    
    <el-form
      ref="taskForm"
      :model="taskForm"
      :rules="rules"
      label-width="120px"
      class="task-form"
    >
      <el-card class="task-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        
        <el-form-item label="任务标题" prop="title">
          <el-input v-model="taskForm.title" placeholder="请输入任务标题" />
        </el-form-item>
        
        <el-form-item label="任务分类" prop="category_id">
          <el-select v-model="taskForm.category_id" placeholder="请选择任务分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="任务类型" prop="task_type">
          <el-radio-group v-model="taskForm.task_type">
            <el-radio :label="1">短视频</el-radio>
            <el-radio :label="2">直播</el-radio>
            <el-radio :label="3">图文</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="taskForm.description"
            type="textarea"
            placeholder="请详细描述任务内容、要求等"
            rows="4"
          />
        </el-form-item>
      </el-card>
      
      <el-card class="task-card">
        <template #header>
          <div class="card-header">
            <span>任务预算</span>
          </div>
        </template>
        
        <el-form-item label="任务总预算" prop="budget">
          <el-input-number
            v-model="taskForm.budget"
            :min="0"
            :precision="2"
            :step="100"
            controls-position="right"
          />
          <span class="form-tips">元</span>
        </el-form-item>
        
        <el-form-item label="单个任务报酬" prop="unit_price">
          <el-input-number
            v-model="taskForm.unit_price"
            :min="0"
            :precision="2"
            controls-position="right"
          />
          <span class="form-tips">元/单</span>
        </el-form-item>
        
        <el-form-item label="任务数量" prop="total_count">
          <el-input-number
            v-model="taskForm.total_count"
            :min="1"
            :precision="0"
            controls-position="right"
          />
          <span class="form-tips">个</span>
        </el-form-item>
      </el-card>
      
      <el-card class="task-card">
        <template #header>
          <div class="card-header">
            <span>任务要求</span>
          </div>
        </template>
        
        <el-form-item label="平台要求" prop="requirements.platform">
          <el-select v-model="taskForm.requirements.platform" placeholder="请选择平台">
            <el-option label="抖音" value="抖音" />
            <el-option label="快手" value="快手" />
            <el-option label="小红书" value="小红书" />
            <el-option label="视频号" value="视频号" />
            <el-option label="微博" value="微博" />
            <el-option label="不限平台" value="不限平台" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="粉丝要求" prop="requirements.fans_min">
          <el-input-number
            v-model="taskForm.requirements.fans_min"
            :min="0"
            :step="1000"
            :precision="0"
            controls-position="right"
          />
          <span class="form-tips">人以上</span>
        </el-form-item>
        
        <el-form-item label="性别要求" prop="requirements.gender">
          <el-radio-group v-model="taskForm.requirements.gender">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="年龄要求">
          <div class="age-range">
            <el-input-number
              v-model="taskForm.requirements.age_min"
              :min="0"
              :max="taskForm.requirements.age_max || 100"
              :precision="0"
              controls-position="right"
              placeholder="最小年龄"
            />
            <span class="range-separator">至</span>
            <el-input-number
              v-model="taskForm.requirements.age_max"
              :min="taskForm.requirements.age_min || 0"
              :max="100"
              :precision="0"
              controls-position="right"
              placeholder="最大年龄"
            />
            <span class="form-tips">岁（不填则不限）</span>
          </div>
        </el-form-item>
        
        <el-form-item label="地区要求" prop="requirements.region">
          <el-input v-model="taskForm.requirements.region" placeholder="例如：全国、广东省等" />
        </el-form-item>
        
        <el-form-item label="其他要求" prop="requirements.other_requirements">
          <el-input
            v-model="taskForm.requirements.other_requirements"
            type="textarea"
            placeholder="补充说明其他特殊要求"
            rows="3"
          />
        </el-form-item>
      </el-card>
      
      <el-card class="task-card">
        <template #header>
          <div class="card-header">
            <span>任务素材</span>
          </div>
        </template>
        
        <el-form-item label="选择素材" prop="material_ids">
          <el-button type="primary" @click="openMaterialDialog">选择素材</el-button>
          <span class="form-tips">已选择 {{ taskForm.material_ids.length }} 个素材</span>
        </el-form-item>
        
        <div class="selected-materials" v-if="taskForm.material_ids.length > 0">
          <el-empty v-if="materials.length === 0" description="暂无素材展示" />
          <el-row v-else :gutter="20">
            <el-col v-for="item in materials" :key="item.id" :span="8">
              <el-card class="material-item">
                <div class="material-content">
                  <img v-if="item.material_type === 1" :src="item.file_path" alt="素材图片" class="material-img" />
                  <video v-else-if="item.material_type === 2" :src="item.file_path" controls class="material-video"></video>
                  <div v-else class="material-text">{{ item.content }}</div>
                </div>
                <div class="material-info">
                  <span>{{ item.title }}</span>
                  <el-tag size="small" type="info">{{ getMaterialTypeText(item.material_type) }}</el-tag>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
      
      <el-card class="task-card">
        <template #header>
          <div class="card-header">
            <span>任务周期</span>
          </div>
        </template>
        
        <el-form-item label="任务时间" prop="date_range">
          <el-date-picker
            v-model="taskForm.date_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
      </el-card>
      
      <div class="form-actions">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="saveAsDraft">保存草稿</el-button>
        <el-button type="success" @click="submitTask">提交审核</el-button>
      </div>
    </el-form>
    
    <!-- 素材选择弹窗 -->
    <el-dialog v-model="materialDialogVisible" title="选择素材" width="70%">
      <div class="material-filter">
        <el-input 
          v-model="materialSearch" 
          placeholder="搜索素材"
          clearable
          @clear="searchMaterials"
          @input="searchMaterials"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-radio-group v-model="materialTypeFilter" @change="searchMaterials">
          <el-radio-button :label="0">全部</el-radio-button>
          <el-radio-button :label="1">图片</el-radio-button>
          <el-radio-button :label="2">视频</el-radio-button>
          <el-radio-button :label="3">文本</el-radio-button>
        </el-radio-group>
      </div>

      <el-table
        ref="multipleTable"
        :data="allMaterials"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="material_type" label="类型" width="120">
          <template #default="scope">
            {{ getMaterialTypeText(scope.row.material_type) }}
          </template>
        </el-table-column>
        <el-table-column label="预览" width="180">
          <template #default="scope">
            <img 
              v-if="scope.row.material_type === 1" 
              :src="scope.row.file_path" 
              alt="图片预览" 
              class="material-preview-img"
            />
            <video 
              v-else-if="scope.row.material_type === 2" 
              :src="scope.row.file_path" 
              class="material-preview-video"
            ></video>
            <div 
              v-else 
              class="material-preview-text"
            >
              {{ scope.row.content.substring(0, 20) }}...
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
      </el-table>
      
      <div class="dialog-pagination">
        <el-pagination
          v-model:current-page="materialPage.current"
          v-model:page-size="materialPage.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="materialPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="materialDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSelectMaterials">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getTaskCategories, createTask, submitTaskForReview } from '@/api/task'
import { getMaterialList } from '@/api/material'

const router = useRouter()

// 表单数据
const taskForm = reactive({
  title: '',
  category_id: '',
  task_type: 1,
  description: '',
  budget: 0,
  unit_price: 0,
  total_count: 1,
  date_range: [],
  material_ids: [],
  requirements: {
    fans_min: 0,
    platform: '抖音',
    region: '全国',
    gender: 0,
    age_min: null,
    age_max: null,
    other_requirements: ''
  }
})

// 表单校验规则
const rules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择任务分类', trigger: 'change' }
  ],
  task_type: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入任务描述', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  budget: [
    { required: true, message: '请输入任务预算', trigger: 'blur' },
    { type: 'number', min: 0, message: '预算必须大于等于0', trigger: 'blur' }
  ],
  unit_price: [
    { required: true, message: '请输入单个任务报酬', trigger: 'blur' },
    { type: 'number', min: 0, message: '报酬必须大于等于0', trigger: 'blur' }
  ],
  total_count: [
    { required: true, message: '请输入任务数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于等于1', trigger: 'blur' }
  ],
  date_range: [
    { required: true, message: '请选择任务时间范围', trigger: 'change' }
  ],
  'requirements.platform': [
    { required: true, message: '请选择平台要求', trigger: 'change' }
  ]
}

// 分类数据
const categories = ref([])

// 素材相关
const materialDialogVisible = ref(false)
const materialSearch = ref('')
const materialTypeFilter = ref(0)
const selectedMaterials = ref([])
const allMaterials = ref([])
const materials = ref([])
const materialPage = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 获取分类数据
const getCategories = async () => {
  try {
    const res = await getTaskCategories()
    categories.value = res.data
  } catch (error) {
    ElMessage.error('获取任务分类失败')
  }
}

// 获取素材类型文本
const getMaterialTypeText = (type) => {
  const types = {
    1: '图片',
    2: '视频',
    3: '文本'
  }
  return types[type] || '未知类型'
}

// 打开素材选择弹窗
const openMaterialDialog = async () => {
  materialDialogVisible.value = true
  await searchMaterials()
  
  // 设置已选中的素材
  if (taskForm.material_ids.length > 0) {
    allMaterials.value.forEach(item => {
      if (taskForm.material_ids.includes(item.id)) {
        selectedMaterials.value.push(item)
      }
    })
  }
}

// 搜索素材
const searchMaterials = async () => {
  try {
    const params = {
      page: materialPage.current,
      limit: materialPage.size,
      keyword: materialSearch.value,
      material_type: materialTypeFilter.value === 0 ? undefined : materialTypeFilter.value
    }
    
    const res = await getMaterialList(params)
    allMaterials.value = res.data.data
    materialPage.total = res.data.total
    
    // 更新表格选中状态
    if (taskForm.material_ids.length > 0) {
      nextTick(() => {
        allMaterials.value.forEach(item => {
          if (taskForm.material_ids.includes(item.id)) {
            multipleTable.value.toggleRowSelection(item, true)
          }
        })
      })
    }
  } catch (error) {
    ElMessage.error('获取素材列表失败')
  }
}

// 处理素材选择变化
const handleSelectionChange = (val) => {
  selectedMaterials.value = val
}

// 确认选择素材
const confirmSelectMaterials = () => {
  taskForm.material_ids = selectedMaterials.value.map(item => item.id)
  materials.value = selectedMaterials.value
  materialDialogVisible.value = false
}

// 处理页码变化
const handleCurrentChange = (val) => {
  materialPage.current = val
  searchMaterials()
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  materialPage.size = val
  materialPage.current = 1
  searchMaterials()
}

// 保存为草稿
const saveAsDraft = async () => {
  try {
    // 表单验证
    await taskForm.value.validate()
    
    // 处理提交数据
    const submitData = {
      ...taskForm,
      start_time: taskForm.date_range[0],
      end_time: taskForm.date_range[1]
    }
    delete submitData.date_range
    
    // 保存草稿
    await createTask(submitData)
    ElMessage.success('保存草稿成功')
    router.push('/merchant/task')
  } catch (error) {
    ElMessage.error(error.message || '保存失败，请重试')
  }
}

// 提交审核
const submitTask = async () => {
  try {
    // 表单验证
    await taskForm.value.validate()
    
    // 确认提交
    await ElMessageBox.confirm('确认提交任务进行审核吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 处理提交数据
    const submitData = {
      ...taskForm,
      start_time: taskForm.date_range[0],
      end_time: taskForm.date_range[1]
    }
    delete submitData.date_range
    
    // 创建任务
    const res = await createTask(submitData)
    
    // 提交审核
    await submitTaskForReview(res.data.id)
    
    ElMessage.success('任务提交成功，请等待审核')
    router.push('/merchant/task')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '提交失败，请重试')
    }
  }
}

// 初始化
onMounted(() => {
  getCategories()
})
</script>

<style lang="scss" scoped>
.task-create-container {
  padding: 20px;
  
  .page-title {
    margin-bottom: 20px;
    
    h2 {
      font-size: 24px;
      margin: 0 0 10px;
    }
    
    p {
      color: #666;
      margin: 0;
    }
  }
  
  .task-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
    }
  }
  
  .form-tips {
    margin-left: 10px;
    color: #666;
  }
  
  .age-range {
    display: flex;
    align-items: center;
    
    .range-separator {
      margin: 0 10px;
    }
  }
  
  .selected-materials {
    margin-top: 10px;
    
    .material-item {
      margin-bottom: 10px;
      
      .material-content {
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        
        .material-img,
        .material-video {
          max-width: 100%;
          max-height: 150px;
        }
        
        .material-text {
          padding: 10px;
          height: 100%;
          overflow-y: auto;
          background-color: #f9f9f9;
        }
      }
      
      .material-info {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
      }
    }
  }
  
  .form-actions {
    margin-top: 30px;
    text-align: center;
    
    .el-button {
      min-width: 120px;
      margin: 0 10px;
    }
  }
  
  .material-filter {
    display: flex;
    margin-bottom: 20px;
    
    .el-input {
      width: 300px;
      margin-right: 20px;
    }
  }
  
  .material-preview-img,
  .material-preview-video {
    max-width: 100px;
    max-height: 60px;
  }
  
  .material-preview-text {
    max-width: 150px;
    max-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .dialog-pagination {
    margin-top: 20px;
    text-align: right;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    
    .el-button {
      min-width: 100px;
    }
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .task-create-container {
    padding: 10px;
    
    .el-form-item {
      margin-bottom: 15px;
    }
    
    .form-actions {
      .el-button {
        min-width: auto;
        margin: 0 5px;
      }
    }
  }
}
</style> 