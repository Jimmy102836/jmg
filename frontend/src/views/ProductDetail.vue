<template>
  <div class="product-detail">
    <Header />
    
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      
      <div class="product-content" v-if="product">
        <div class="product-gallery">
          <div class="main-image">
            <el-image 
              :src="product.mainImage" 
              :preview-src-list="product.images"
              fit="cover"
            ></el-image>
          </div>
          <div class="image-thumbnails">
            <div 
              v-for="(image, index) in product.images" 
              :key="index" 
              class="thumbnail"
              @click="changeMainImage(image)"
            >
              <img :src="image" :alt="`缩略图${index+1}`">
            </div>
          </div>
        </div>
        
        <div class="product-info">
          <h1 class="product-title">{{ product.title }}</h1>
          
          <div class="product-tags">
            <el-tag v-for="(tag, index) in product.tags" :key="index" type="danger" effect="plain" class="tag">{{ tag }}</el-tag>
          </div>
          
          <div class="product-price">
            <div class="price-row">
              <span class="label">销售价格:</span>
              <span class="price">¥{{ product.price }}</span>
              <span class="original-price">¥{{ product.originalPrice }}</span>
            </div>
            
            <div class="price-row">
              <span class="label">佣金比例:</span>
              <span class="commission">{{ product.commission.rate }}</span>
              <span class="commission-value">预计收入 ¥{{ product.commission.value }}</span>
            </div>
          </div>
          
          <div class="product-stats">
            <div class="stat-item">
              <span class="label">总销量</span>
              <span class="value">{{ product.sales.total }}</span>
            </div>
            <div class="stat-item">
              <span class="label">今日销量</span>
              <span class="value">{{ product.sales.today }}</span>
            </div>
            <div class="stat-item">
              <span class="label">昨日销量</span>
              <span class="value">{{ product.sales.yesterday }}</span>
            </div>
            <div class="stat-item">
              <span class="label">7日销量</span>
              <span class="value">{{ product.sales.sevenDays }}</span>
            </div>
          </div>
          
          <div class="sales-channels">
            <h3>销售渠道占比</h3>
            <el-progress 
              :percentage="parseInt(product.salesByChannel.live.percent)" 
              :format="() => `直播带货 ${product.salesByChannel.live.percent} (${product.salesByChannel.live.count})`"
              :color="'#FF2C55'"
              class="progress-item"
            ></el-progress>
            
            <el-progress 
              :percentage="parseInt(product.salesByChannel.video.percent)" 
              :format="() => `视频带货 ${product.salesByChannel.video.percent} (${product.salesByChannel.video.count})`"
              :color="'#00B578'"
              class="progress-item"
            ></el-progress>
            
            <el-progress 
              :percentage="parseInt(product.salesByChannel.productCard.percent)" 
              :format="() => `商品卡 ${product.salesByChannel.productCard.percent} (${product.salesByChannel.productCard.count})`"
              :color="'#7A52F4'"
              class="progress-item"
            ></el-progress>
          </div>
          
          <div class="target-audience">
            <h3>目标受众</h3>
            <p>性别: {{ product.targetAudience.gender }}</p>
            <p>年龄: {{ product.targetAudience.ageRange }}</p>
          </div>
          
          <div class="product-sku">
            <h3>商品规格</h3>
            <el-radio-group v-model="selectedSku">
              <el-radio v-for="sku in product.skus" :key="sku.id" :label="sku.id" border>
                {{ sku.name }} (库存: {{ sku.stock }})
              </el-radio>
            </el-radio-group>
          </div>
          
          <div class="shop-info">
            <h3>店铺信息</h3>
            <p>
              <span class="shop-name">{{ product.shop.name }}</span>
              <el-rate 
                v-model="product.shop.rating" 
                disabled 
                text-color="#FF9500"
                show-score
              ></el-rate>
            </p>
          </div>
          
          <div class="product-features">
            <h3>服务保障</h3>
            <div class="features-list">
              <div class="feature-item" v-for="(feature, index) in product.features" :key="index">
                <i class="el-icon-check"></i>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button type="danger" size="large" @click="addToPromotion">添加到橱窗</el-button>
            <el-button type="primary" size="large" @click="copyProductLink">复制商品链接</el-button>
          </div>
        </div>
      </div>
      
      <div class="product-description" v-if="product">
        <el-tabs type="border-card">
          <el-tab-pane label="商品详情">
            <div class="description-content">
              <h3>商品描述</h3>
              <p>{{ product.description }}</p>
              
              <div class="detail-images">
                <el-image 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  :src="image"
                  fit="contain"
                  :lazy="true"
                  class="detail-image"
                ></el-image>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="达人数据">
            <div class="creator-stats">
              <div class="stat-card">
                <div class="stat-title">关联达人数</div>
                <div class="stat-value">{{ product.relatedCreators }}</div>
                <div class="stat-desc">个达人正在推广</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-title">关联直播数</div>
                <div class="stat-value">{{ product.relatedLiveStreams }}</div>
                <div class="stat-desc">场直播带货</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-title">关联视频数</div>
                <div class="stat-value">{{ product.relatedVideos }}</div>
                <div class="stat-desc">个视频推广</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-title">平均转化率</div>
                <div class="stat-value">{{ product.conversionRate }}</div>
                <div class="stat-desc">流量转化效果好</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="related-products" v-if="relatedProducts.length > 0">
        <h2 class="section-title">相关推荐</h2>
        
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="(item, index) in relatedProducts" :key="index">
            <el-card class="product-card" shadow="hover" @click="viewProductDetail(item.id)">
              <img :src="item.mainImage" class="image" />
              <div class="product-card-info">
                <div class="title">{{ item.title }}</div>
                <div class="price">¥{{ item.price }}</div>
                <div class="commission">佣金: {{ item.commission.rate }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { products } from '@/mock/products'
import { ElMessage } from 'element-plus'

export default {
  name: 'ProductDetail',
  components: {
    Header,
    Footer
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const selectedSku = ref(null)
    
    // 获取商品ID
    const productId = computed(() => Number(route.params.id))
    
    // 根据ID获取商品详情
    const product = computed(() => {
      return products.find(item => item.id === productId.value) || {}
    })
    
    // 获取相关推荐商品
    const relatedProducts = computed(() => {
      return products
        .filter(item => item.id !== productId.value && item.category === product.value.category)
        .slice(0, 6)
    })
    
    // 初始化选中SKU
    onMounted(() => {
      if (product.value.skus && product.value.skus.length > 0) {
        selectedSku.value = product.value.skus[0].id
      }
    })
    
    // 切换主图
    const changeMainImage = (image) => {
      product.value.mainImage = image
    }
    
    // 添加到橱窗
    const addToPromotion = () => {
      ElMessage.success('商品已添加到您的橱窗')
    }
    
    // 复制商品链接
    const copyProductLink = () => {
      const link = `https://douyintz.com/products/${productId.value}`
      
      navigator.clipboard.writeText(link)
        .then(() => {
          ElMessage.success('商品链接已复制到剪贴板')
        })
        .catch(() => {
          ElMessage.error('复制失败，请手动复制')
        })
    }
    
    // 查看其他商品详情
    const viewProductDetail = (id) => {
      router.push(`/products/${id}`)
    }
    
    return {
      product,
      selectedSku,
      relatedProducts,
      changeMainImage,
      addToPromotion,
      copyProductLink,
      viewProductDetail
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail {
  background-color: #f8f8f8;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .el-breadcrumb {
    margin: 20px 0;
  }
  
  .product-content {
    display: flex;
    margin-bottom: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .product-gallery {
    width: 40%;
    padding: 20px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
    
    .main-image {
      width: 100%;
      height: 400px;
      border: 1px solid #eee;
      overflow: hidden;
      
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    
    .image-thumbnails {
      display: flex;
      margin-top: 10px;
      
      .thumbnail {
        width: 80px;
        height: 80px;
        margin-right: 10px;
        border: 1px solid #eee;
        cursor: pointer;
        
        &:hover {
          border-color: #FF2C55;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  
  .product-info {
    flex: 1;
    padding: 20px 30px;
    
    .product-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #333;
    }
    
    .product-tags {
      margin-bottom: 20px;
      
      .tag {
        margin-right: 10px;
      }
    }
    
    .product-price {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #FFF9FA;
      border-radius: 6px;
      
      .price-row {
        margin-bottom: 10px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .label {
          color: #666;
          margin-right: 10px;
        }
        
        .price {
          font-size: 28px;
          font-weight: bold;
          color: #FF2C55;
          margin-right: 10px;
        }
        
        .original-price {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
        }
        
        .commission {
          font-size: 20px;
          font-weight: bold;
          color: #FF9500;
          margin-right: 10px;
        }
        
        .commission-value {
          color: #FF9500;
        }
      }
    }
    
    .product-stats {
      display: flex;
      margin-bottom: 20px;
      
      .stat-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        border-right: 1px solid #eee;
        
        &:last-child {
          border-right: none;
        }
        
        .label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .value {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
      }
    }
    
    .sales-channels, .target-audience, .product-sku, .shop-info, .product-features {
      margin-bottom: 20px;
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #333;
      }
    }
    
    .sales-channels {
      .progress-item {
        margin-bottom: 10px;
      }
    }
    
    .product-sku {
      .el-radio {
        margin-right: 15px;
        margin-bottom: 10px;
      }
    }
    
    .shop-info {
      .shop-name {
        font-size: 16px;
        margin-right: 10px;
      }
    }
    
    .product-features {
      .features-list {
        display: flex;
        flex-wrap: wrap;
        
        .feature-item {
          display: flex;
          align-items: center;
          width: 50%;
          margin-bottom: 10px;
          
          i {
            color: #00B578;
            margin-right: 5px;
          }
        }
      }
    }
    
    .action-buttons {
      display: flex;
      justify-content: space-between;
      
      .el-button {
        flex: 1;
        margin: 0 10px;
        
        &:first-child {
          margin-left: 0;
        }
        
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  
  .product-description {
    margin-bottom: 30px;
    
    .description-content {
      padding: 20px;
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #333;
      }
      
      p {
        margin-bottom: 20px;
        line-height: 1.6;
        color: #666;
      }
      
      .detail-images {
        .detail-image {
          width: 100%;
          margin-bottom: 15px;
        }
      }
    }
  }
  
  .creator-stats {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    
    .stat-card {
      width: calc(25% - 20px);
      margin: 10px;
      padding: 20px;
      text-align: center;
      background-color: #f9f9f9;
      border-radius: 8px;
      
      @media (max-width: 768px) {
        width: calc(50% - 20px);
      }
      
      .stat-title {
        font-size: 16px;
        color: #666;
        margin-bottom: 10px;
      }
      
      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #FF2C55;
        margin-bottom: 10px;
      }
      
      .stat-desc {
        font-size: 14px;
        color: #999;
      }
    }
  }
  
  .related-products {
    margin-bottom: 40px;
    
    .section-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #333;
      text-align: center;
    }
    
    .product-card {
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
      }
      
      .image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      
      .product-card-info {
        padding: 10px;
        
        .title {
          font-size: 14px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-bottom: 8px;
        }
        
        .price {
          font-size: 16px;
          font-weight: bold;
          color: #FF2C55;
          margin-bottom: 5px;
        }
        
        .commission {
          font-size: 12px;
          color: #FF9500;
        }
      }
    }
  }
}
</style> 