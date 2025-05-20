<template>
  <div class="products-page">
    <Header />
    
    <div class="container">
      <div class="page-header">
        <h1>精选商品库</h1>
        <p>汇集抖音平台优质高佣商品，助力达人获取更高收益</p>
      </div>
      
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="filter-tabs">
              <div class="filter-tab" v-for="category in categories" :key="category.id" :class="{ active: filters.category === category.id }" @click="filters.category = category.id">
                {{ category.name }}
              </div>
            </div>
          </el-col>
        </el-row>
        
        <div class="sub-filters">
          <div class="filter-group">
            <div class="filter-label">佣金比例:</div>
            <div class="filter-options">
              <div class="filter-option" :class="{ active: filters.commission === '' }" @click="filters.commission = ''">全部</div>
              <div class="filter-option" :class="{ active: filters.commission === '30' }" @click="filters.commission = '30'">30%以上</div>
              <div class="filter-option" :class="{ active: filters.commission === '40' }" @click="filters.commission = '40'">40%以上</div>
              <div class="filter-option" :class="{ active: filters.commission === '50' }" @click="filters.commission = '50'">50%以上</div>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-label">价格区间:</div>
            <div class="filter-options">
              <div class="filter-option" :class="{ active: filters.price === '' }" @click="filters.price = ''">全部</div>
              <div class="filter-option" :class="{ active: filters.price === '0-50' }" @click="filters.price = '0-50'">0-50元</div>
              <div class="filter-option" :class="{ active: filters.price === '50-100' }" @click="filters.price = '50-100'">50-100元</div>
              <div class="filter-option" :class="{ active: filters.price === '100-200' }" @click="filters.price = '100-200'">100-200元</div>
              <div class="filter-option" :class="{ active: filters.price === '200+' }" @click="filters.price = '200+'">200元以上</div>
            </div>
          </div>
        </div>
        
        <div class="filter-tags">
          <span class="tag-title">商品标签：</span>
          <div class="tag-options">
            <div 
              v-for="tag in productTags" 
              :key="tag.id"
              :class="['tag-option', { active: selectedTags.includes(tag.id) }]"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </div>
          </div>
        </div>
        
        <div class="filter-search">
          <div class="search-box">
            <i class="el-icon-search"></i>
            <input 
              v-model="searchKeyword" 
              placeholder="搜索商品名称/描述"
              @keyup.enter="searchProducts" 
            />
            <button class="search-btn" @click="searchProducts">搜索</button>
          </div>
        </div>
      </div>
      
      <div class="products-grid">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" :lg="6" v-for="(product, index) in filteredProducts" :key="index">
            <div class="product-card" @click="viewProductDetail(product.id)">
              <div class="product-image">
                <img :src="product.mainImage" :alt="product.title">
                <div class="discount-tag" v-if="product.discountRate">{{ product.discountRate }}%</div>
              </div>
              
              <div class="product-info">
                <h3 class="product-title" :title="product.title">{{ product.title }}</h3>
                
                <div class="price-info">
                  <span class="price-symbol">¥</span>
                  <span class="current-price">{{ product.price }}</span>
                  <span class="original-price">¥{{ product.originalPrice }}</span>
                </div>
                
                <div class="product-meta">
                  <span class="sales-count">{{ formatSalesNumber(product.sales.total) }}人已购</span>
                  <span class="commission-tag">佣金{{ product.commission.rate }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalProducts"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { products, categories, productTags } from '@/mock/products'

export default {
  name: 'Products',
  components: {
    Header,
    Footer
  },
  setup() {
    const router = useRouter()
    const searchKeyword = ref('')
    const selectedTags = ref([])
    const currentPage = ref(1)
    const pageSize = ref(12)
    
    // 筛选条件
    const filters = ref({
      category: 'all',
      commission: '',
      price: '',
      salesSort: 'default'
    })
    
    // 过滤商品列表
    const filteredProducts = computed(() => {
      let result = products.slice()
      
      // 搜索关键词过滤
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(item => 
          item.title.toLowerCase().includes(keyword) || 
          item.description.toLowerCase().includes(keyword)
        )
      }
      
      // 分类过滤
      if (filters.value.category !== 'all') {
        result = result.filter(item => item.category === filters.value.category)
      }
      
      // 佣金过滤
      if (filters.value.commission) {
        const minCommission = parseInt(filters.value.commission)
        result = result.filter(item => {
          const commissionRate = parseInt(item.commission.rate)
          return commissionRate >= minCommission
        })
      }
      
      // 价格过滤
      if (filters.value.price) {
        const priceRange = filters.value.price.split('-')
        if (priceRange.length === 2) {
          const min = parseInt(priceRange[0])
          const max = parseInt(priceRange[1])
          result = result.filter(item => item.price >= min && item.price <= max)
        } else if (filters.value.price.includes('+')) {
          const min = parseInt(filters.value.price)
          result = result.filter(item => item.price >= min)
        }
      }
      
      // 标签过滤
      if (selectedTags.value.length > 0) {
        const tagMap = {
          'hot': ['爆款', '热销', '好卖'],
          'new': ['新品', '新款'],
          'highComm': ['高佣金'],
          'quality': ['品质优选'],
          'recommend': ['好物推荐', '厨房必备', '居家好物', '数码好物']
        }
        
        result = result.filter(product => {
          return selectedTags.value.some(tagId => {
            return product.tags.some(tag => tagMap[tagId]?.includes(tag))
          })
        })
      }
      
      // 销量排序
      if (filters.value.salesSort !== 'default') {
        result.sort((a, b) => {
          if (filters.value.salesSort === 'desc') {
            return b.sales.total - a.sales.total
          } else {
            return a.sales.total - b.sales.total
          }
        })
      }
      
      // 分页
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      
      return result.slice(start, end)
    })
    
    // 计算总商品数
    const totalProducts = computed(() => {
      let result = products.slice()
      
      // 搜索关键词过滤
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(item => 
          item.title.toLowerCase().includes(keyword) || 
          item.description.toLowerCase().includes(keyword)
        )
      }
      
      // 分类过滤
      if (filters.value.category !== 'all') {
        result = result.filter(item => item.category === filters.value.category)
      }
      
      // 佣金过滤
      if (filters.value.commission) {
        const minCommission = parseInt(filters.value.commission)
        result = result.filter(item => {
          const commissionRate = parseInt(item.commission.rate)
          return commissionRate >= minCommission
        })
      }
      
      // 价格过滤
      if (filters.value.price) {
        const priceRange = filters.value.price.split('-')
        if (priceRange.length === 2) {
          const min = parseInt(priceRange[0])
          const max = parseInt(priceRange[1])
          result = result.filter(item => item.price >= min && item.price <= max)
        } else if (filters.value.price.includes('+')) {
          const min = parseInt(filters.value.price)
          result = result.filter(item => item.price >= min)
        }
      }
      
      // 标签过滤
      if (selectedTags.value.length > 0) {
        const tagMap = {
          'hot': ['爆款', '热销', '好卖'],
          'new': ['新品', '新款'],
          'highComm': ['高佣金'],
          'quality': ['品质优选'],
          'recommend': ['好物推荐', '厨房必备', '居家好物', '数码好物']
        }
        
        result = result.filter(product => {
          return selectedTags.value.some(tagId => {
            return product.tags.some(tag => tagMap[tagId]?.includes(tag))
          })
        })
      }
      
      return result.length
    })
    
    // 监听筛选条件变化，重置页码
    watch([filters, searchKeyword, selectedTags], () => {
      currentPage.value = 1
    })
    
    // 格式化销售数字
    const formatSalesNumber = (num) => {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w+'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k+'
      }
      return num
    }
    
    // 切换标签
    const toggleTag = (tagId) => {
      if (selectedTags.value.includes(tagId)) {
        selectedTags.value = selectedTags.value.filter(id => id !== tagId)
      } else {
        selectedTags.value.push(tagId)
      }
      // 当切换标签时，重置到第一页
      currentPage.value = 1
    }
    
    // 搜索商品
    const searchProducts = () => {
      currentPage.value = 1
      // 触发计算属性重新计算
    }
    
    // 页码变化
    const handlePageChange = (page) => {
      currentPage.value = page
    }
    
    // 查看商品详情
    const viewProductDetail = (id) => {
      router.push(`/products/${id}`)
    }
    
    return {
      searchKeyword,
      filters,
      categories,
      productTags,
      selectedTags,
      currentPage,
      pageSize,
      filteredProducts,
      totalProducts,
      formatSalesNumber,
      toggleTag,
      searchProducts,
      handlePageChange,
      viewProductDetail
    }
  }
}
</script>

<style lang="scss" scoped>
.products-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.page-header {
  padding: 20px 0;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  
  p {
    font-size: 14px;
    color: #666;
  }
}

.filter-section {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  .filter-tabs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    
    .filter-tab {
      padding: 5px 15px;
      margin: 0 10px 10px 0;
      cursor: pointer;
      border-radius: 16px;
      font-size: 14px;
      background-color: #f5f5f5;
      color: #666;
      transition: all 0.2s;
      
      &.active {
        background-color: #ffe8ec;
        color: #ff2c55;
      }
      
      &:hover {
        background-color: #ffe8ec;
        color: #ff2c55;
      }
    }
  }
  
  .sub-filters {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    border-top: 1px dashed #eee;
    border-bottom: 1px dashed #eee;
    padding: 15px 0;
    
    .filter-group {
      margin-right: 30px;
      margin-bottom: 10px;
      
      .filter-label {
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
      }
      
      .filter-options {
        display: flex;
        flex-wrap: wrap;
        
        .filter-option {
          padding: 3px 12px;
          margin: 0 8px 8px 0;
          cursor: pointer;
          border-radius: 16px;
          font-size: 13px;
          background-color: #f5f5f5;
          color: #666;
          transition: all 0.2s;
          
          &.active {
            background-color: #ffe8ec;
            color: #ff2c55;
          }
          
          &:hover {
            background-color: #ffe8ec;
            color: #ff2c55;
          }
        }
      }
    }
  }
  
  .filter-tags {
    display: flex;
    margin-bottom: 15px;
    
    .tag-title {
      font-size: 14px;
      color: #333;
      margin-right: 10px;
      line-height: 32px;
    }
    
    .tag-options {
      display: flex;
      flex-wrap: wrap;
      
      .tag-option {
        padding: 3px 12px;
        margin: 0 8px 8px 0;
        cursor: pointer;
        border-radius: 16px;
        font-size: 13px;
        background-color: #f5f5f5;
        color: #666;
        transition: all 0.2s;
        
        &.active {
          background-color: #ffe8ec;
          color: #ff2c55;
        }
        
        &:hover {
          background-color: #ffe8ec;
          color: #ff2c55;
        }
      }
    }
  }
  
  .filter-search {
    .search-box {
      display: flex;
      max-width: 600px;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 20px;
      overflow: hidden;
      
      i {
        width: 40px;
        line-height: 40px;
        text-align: center;
        color: #999;
      }
      
      input {
        flex: 1;
        border: none;
        outline: none;
        padding: 0 10px;
        font-size: 14px;
        
        &:focus {
          border: none;
          outline: none;
        }
      }
      
      .search-btn {
        width: 80px;
        background-color: #ff2c55;
        color: #fff;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          background-color: darken(#ff2c55, 10%);
        }
      }
    }
  }
}

.products-grid {
  .el-row {
    margin-left: -10px !important;
    margin-right: -10px !important;
  }
  
  .el-col {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
  
  .product-card {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 20px;
    border: 1px solid #f0f0f0;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    }
    
    .product-image {
      position: relative;
      padding-bottom: 100%;
      overflow: hidden;
      
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
      
      .discount-tag {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #ff2c55;
        color: #fff;
        padding: 2px 5px;
        font-size: 12px;
        font-weight: bold;
        border-radius: 4px;
      }
    }
    
    .product-info {
      padding: 10px;
      
      .product-title {
        font-size: 14px;
        color: #333;
        margin: 0 0 8px;
        line-height: 1.3;
        height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .price-info {
        margin-bottom: 8px;
        
        .price-symbol {
          font-size: 14px;
          color: #ff2c55;
          font-weight: bold;
        }
        
        .current-price {
          font-size: 20px;
          color: #ff2c55;
          font-weight: bold;
          margin-right: 5px;
        }
        
        .original-price {
          font-size: 12px;
          color: #999;
          text-decoration: line-through;
        }
      }
      
      .product-meta {
        display: flex;
        justify-content: space-between;
        
        .sales-count {
          font-size: 12px;
          color: #999;
        }
        
        .commission-tag {
          font-size: 12px;
          color: #ff6e40;
          background-color: #fff2ee;
          padding: 2px 4px;
          border-radius: 2px;
        }
      }
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  
  :deep(.el-pagination) {
    .el-pager li.active {
      color: #fff;
      background-color: #ff2c55;
      border-color: #ff2c55;
    }
    
    .el-pager li:hover {
      color: #ff2c55;
    }
  }
}

@media (max-width: 768px) {
  .sub-filters {
    .filter-group {
      width: 100%;
      margin-right: 0;
    }
  }
  
  .products-grid {
    .product-card {
      .product-title {
        height: 40px;
      }
    }
  }
}
</style> 