<template>
  <div class="product-showcase">
    <div class="section-title">
      <h2>精选好物</h2>
      <p>为您推荐高佣优质商品，爆款单品一网打尽</p>
    </div>
    
    <div class="product-filter">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
        <el-tab-pane v-for="category in categories" :key="category.id" :label="category.name" :name="category.id"></el-tab-pane>
      </el-tabs>
      
      <div class="filter-tags">
        <el-tag 
          v-for="tag in productTags" 
          :key="tag.id"
          :type="activeTag === tag.id ? 'primary' : 'info'"
          effect="plain"
          class="filter-tag"
          @click="toggleTag(tag.id)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>
    
    <el-row :gutter="20" class="product-list">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(product, index) in filteredProducts" :key="index" class="product-col">
        <el-card class="product-card" shadow="hover" @click="viewProductDetail(product)">
          <div class="product-image">
            <img :src="product.mainImage" :alt="product.title">
            <div class="product-tags">
              <span v-for="(tag, i) in product.tags.slice(0, 2)" :key="i" class="product-tag">{{ tag }}</span>
            </div>
          </div>
          
          <div class="product-info">
            <h3 class="product-title" :title="product.title">{{ product.title }}</h3>
            
            <div class="price-info">
              <span class="current-price">¥{{ product.price }}</span>
              <span class="original-price">¥{{ product.originalPrice }}</span>
            </div>
            
            <div class="commission-info">
              <span class="commission-rate">佣金比例 {{ product.commission.rate }}</span>
              <span class="commission-value">预估收入 ¥{{ product.commission.value }}</span>
            </div>
            
            <div class="sales-info">
              <div class="sales-number">
                <i class="el-icon-shopping-cart-2"></i>
                <span>已售 {{ formatSalesNumber(product.sales.total) }}</span>
              </div>
              <div class="creators-number">
                <i class="el-icon-user"></i>
                <span>{{ product.relatedCreators }}人在带</span>
              </div>
            </div>
            
            <div class="shop-info">
              <span class="shop-name">{{ product.shop.name }}</span>
              <div class="shop-rating">
                <i class="el-icon-star-on"></i>
                <span>{{ product.shop.rating }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="view-more">
      <el-button type="primary" plain @click="viewAllProducts">查看更多商品</el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { products, categories, productTags } from '@/mock/products'

export default {
  name: 'ProductShowcase',
  setup() {
    const router = useRouter()
    const activeCategory = ref('all')
    const activeTag = ref('')
    
    // 根据分类和标签筛选商品
    const filteredProducts = computed(() => {
      let result = products
      
      // 按分类筛选
      if (activeCategory.value !== 'all') {
        result = result.filter(product => product.category === activeCategory.value)
      }
      
      // 按标签筛选
      if (activeTag.value) {
        const tagMap = {
          'hot': ['爆款', '热销', '好卖'],
          'new': ['新品', '新款'],
          'highComm': ['高佣金'],
          'quality': ['品质优选'],
          'recommend': ['好物推荐', '厨房必备', '居家好物', '数码好物']
        }
        
        result = result.filter(product => {
          return product.tags.some(tag => tagMap[activeTag.value]?.includes(tag))
        })
      }
      
      // 返回前8个结果
      return result.slice(0, 8)
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
    
    // 处理分类切换
    const handleCategoryChange = (tab) => {
      activeCategory.value = tab.paneName
    }
    
    // 切换标签
    const toggleTag = (tagId) => {
      activeTag.value = activeTag.value === tagId ? '' : tagId
    }
    
    // 查看商品详情
    const viewProductDetail = (product) => {
      router.push(`/products/${product.id}`)
    }
    
    // 查看所有商品
    const viewAllProducts = () => {
      router.push('/products')
    }
    
    return {
      activeCategory,
      activeTag,
      categories,
      productTags,
      filteredProducts,
      formatSalesNumber,
      handleCategoryChange,
      toggleTag,
      viewProductDetail,
      viewAllProducts
    }
  }
}
</script>

<style lang="scss" scoped>
.product-showcase {
  padding: 60px 0;
  background-color: #f8f8f8;
  
  .section-title {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 32px;
      color: #333;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 16px;
      color: #666;
    }
  }
  
  .product-filter {
    margin-bottom: 30px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    
    :deep(.el-tabs__nav) {
      display: flex;
      width: 100%;
      
      .el-tabs__item {
        flex: 1;
        text-align: center;
      }
    }
    
    :deep(.el-tabs__active-bar) {
      background-color: #ff2c55;
    }
    
    :deep(.el-tabs__item.is-active) {
      color: #ff2c55;
    }
    
    .filter-tags {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 20px;
      
      .filter-tag {
        margin: 0 8px 8px 0;
        cursor: pointer;
        
        &.el-tag--primary {
          color: #ff2c55;
          border-color: #ff2c55;
        }
      }
    }
  }
  
  .product-list {
    margin-bottom: 40px;
    
    .product-col {
      margin-bottom: 25px;
    }
    
    .product-card {
      height: 100%;
      transition: all 0.3s;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
      }
      
      .product-image {
        position: relative;
        padding-bottom: 100%;
        overflow: hidden;
        
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .product-tags {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-direction: column;
          
          .product-tag {
            margin-bottom: 5px;
            padding: 2px 8px;
            background-color: #ff2c55;
            color: #fff;
            font-size: 12px;
            border-radius: 3px;
          }
        }
      }
      
      .product-info {
        padding: 15px;
        
        .product-title {
          font-size: 14px;
          color: #333;
          margin-bottom: 10px;
          height: 40px;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .price-info {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          .current-price {
            font-size: 18px;
            font-weight: bold;
            color: #ff2c55;
            margin-right: 8px;
          }
          
          .original-price {
            font-size: 14px;
            color: #999;
            text-decoration: line-through;
          }
        }
        
        .commission-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          
          .commission-rate {
            color: #ff9500;
            font-size: 13px;
          }
          
          .commission-value {
            color: #ff9500;
            font-size: 13px;
            font-weight: bold;
          }
        }
        
        .sales-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 12px;
          color: #666;
        }
        
        .shop-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #666;
          
          .shop-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .shop-rating {
            color: #ff9500;
            
            i {
              margin-right: 2px;
            }
          }
        }
      }
    }
  }
  
  .view-more {
    text-align: center;
    
    .el-button {
      padding: 10px 36px;
      border-color: #ff2c55;
      color: #ff2c55;
      
      &:hover {
        background-color: #ff2c55;
        color: #fff;
      }
    }
  }
}

@media (max-width: 768px) {
  .product-showcase {
    padding: 40px 15px;
  }
}
</style> 