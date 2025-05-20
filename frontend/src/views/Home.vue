<template>
  <div class="home">
    <!-- 顶部导航 -->
    <Header />
    
    <div class="main-content">
      <div class="container">
        <!-- 主要内容区域 -->
        <div class="content-layout">
          <!-- 左侧榜单区域 -->
          <div class="left-sidebar">
            <div class="hot-rank-section">
              <div class="section-header">
                <div class="tab-controls">
                  <span class="tab" :class="{'active': activeRankTab === 'talent'}" @click="activeRankTab = 'talent'">达人榜</span>
                  <span class="tab" :class="{'active': activeRankTab === 'merchant'}" @click="activeRankTab = 'merchant'">商家榜</span>
                  <span class="tab-more">更多 &gt;</span>
                </div>
              </div>
              
              <div class="rank-list">
                <!-- 使用外层包装元素和v-if来切换不同类型的排行榜 -->
                <template v-if="activeRankTab === 'talent'">
                  <!-- 达人榜：按GMV排名 -->
                  <div class="rank-item" v-for="(item, index) in leaderboardData.slice(0, 4)" :key="`talent-${index}`">
                    <div class="rank-number" :class="{'top-rank': index < 3}">{{ index + 1 }}</div>
                    <div class="user-avatar">
                      <img :src="item.avatar" :alt="item.name">
                    </div>
                    <div class="user-info">
                      <div class="user-name">{{ item.name }}</div>
                      <div class="user-stats">
                        <span class="fans-count">{{ item.fans }}粉丝</span>
                        <div class="gmv">
                          <span class="label">GMV:</span>
                          <span class="value">{{ item.gmv }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                
                <template v-else>
                  <!-- 商家榜：按评分排名 -->
                  <div class="rank-item" v-for="(item, index) in merchantRankData.slice(0, 4)" :key="`merchant-${index}`">
                    <div class="rank-number" :class="{'top-rank': index < 3}">{{ index + 1 }}</div>
                    <div class="merchant-logo">
                      <img :src="item.logo" :alt="item.name">
                    </div>
                    <div class="merchant-info">
                      <div class="merchant-name">{{ item.name }}</div>
                      <div class="merchant-rating">
                        <div class="stars">
                          <i class="el-icon-star-on" v-for="n in Math.floor(item.rating)" :key="`star-${n}`"></i>
                          <i class="el-icon-star-half" v-if="item.rating % 1 >= 0.5"></i>
                        </div>
                        <span class="rating-score">{{ item.rating.toFixed(1) }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          
          <!-- 中间内容区域 -->
          <div class="main-area">
            <!-- 618促销横幅 -->
            <div class="promo-banner">
              <img src="@/assets/images/banners/618-promo.svg" alt="618热卖爆款">
            </div>
    
    <!-- 平台数据统计 -->
    <div class="platform-stats">
        <div class="stats-wrapper">
          <div class="stats-item">
                  <div class="stats-label">高佣商品</div>
                  <div class="stats-number">277.47<span class="stats-unit">万+</span></div>
          </div>
          <div class="stats-item">
                  <div class="stats-label">服务达人</div>
                  <div class="stats-number">109.87<span class="stats-unit">万+</span></div>
          </div>
          <div class="stats-item">
            <div class="stats-label">合作商家</div>
                  <div class="stats-number">82.77<span class="stats-unit">万+</span></div>
          </div>
            </div>
          </div>
            

        </div>
    
          <!-- 右侧区域 -->
          <div class="right-sidebar">
            <div class="user-stats">
              <div class="login-prompt" v-if="!isAuthenticated">
                <div class="btn-group">
                  <button class="register-btn">立即登录</button>
      </div>
                <p>登录解锁更多权益</p>
              </div>
              <div class="user-info" v-else>
                <div class="user-avatar">
                  <img :src="userAvatar" alt="用户头像">
                </div>
                <div class="user-name">{{ username }}</div>
    </div>
    
              <div class="stats-info">
                <p>近1小时出单量达 <span class="highlight">2,376</span></p>
              </div>
            </div>
          </div>
        </div>
            
        <!-- 任务管理区域 -->
        <div class="tasks-section section-card">
        <div class="section-header">
            <h2 class="section-title">热门任务</h2>
            <router-link to="/tasks" class="view-more">全部任务 &gt;</router-link>
        </div>
          <div class="tasks-content">
            <div class="tasks-list">
              <div class="task-item" v-for="(task, index) in latestTasks" :key="index">
                <div class="task-card">
                  <div class="task-header">
                    <div class="task-tag" :class="task.type">{{ task.typeName }}</div>
                    <div class="task-price">￥{{ task.price }}</div>
            </div>
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-bottom">
                    <div class="task-company">{{ task.company }}</div>
                    <div class="task-people">{{ task.applicants }}人申请</div>
          </div>
        </div>
      </div>
    </div>
    
            <div class="task-publish">
              <div class="publish-card">
                <div class="icon-circle">
                  <i class="el-icon-plus"></i>
                </div>
                <h3>发布任务</h3>
                <p>连接百万达人 高效引流推广</p>
                <router-link to="/task/publish" class="publish-btn">立即发布</router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 商品推荐区域 -->
        <div class="products-section">
            <ProductShowcase />
          </div>
          
        <!-- 抖音账号授权区域 -->
        <div class="account-auth-section section-card">
              <div class="section-header">
            <h2 class="section-title">抖音账号授权</h2>
            <router-link to="/user/douyinAuth" class="view-more">账号管理 &gt;</router-link>
              </div>
          <div class="auth-steps">
            <div class="auth-step">
              <div class="step-number">1</div>
              <div class="step-icon">
                <i class="el-icon-edit-outline"></i>
                  </div>
              <div class="step-desc">填写账号信息</div>
                </div>
            <div class="step-arrow">
              <i class="el-icon-arrow-right"></i>
              </div>
            <div class="auth-step">
              <div class="step-number">2</div>
              <div class="step-icon">
                <i class="el-icon-mobile"></i>
            </div>
              <div class="step-desc">扫码授权</div>
          </div>
            <div class="step-arrow">
              <i class="el-icon-arrow-right"></i>
        </div>
            <div class="auth-step">
              <div class="step-number">3</div>
              <div class="step-icon">
                <i class="el-icon-check"></i>
              </div>
              <div class="step-desc">完成绑定</div>
            </div>
          </div>
          <div class="auth-desc">
            <p>授权后可查看数据统计、接收任务、管理橱窗等</p>
            <router-link to="/user/douyinAuth" class="auth-btn">立即授权</router-link>
      </div>
    </div>
    
        <!-- 排行榜区域 -->
        <div class="leaderboard-section section-card">
              <div class="section-header">
            <div class="tab-controls">
              <span class="tab active">达人榜</span>
              <span class="tab">商家榜</span>
              <router-link to="/leaderboard" class="view-more">查看更多 &gt;</router-link>
              </div>
                  </div>
          <div class="leaderboard-content">
            <div class="leaderboard-list">
              <div class="leaderboard-item" v-for="(item, index) in leaderboardData" :key="index">
                <div class="rank-number" :class="{'top-rank': index < 3}">{{ index + 1 }}</div>
                <div class="user-info">
                  <img :src="item.avatar" alt="用户头像" class="user-avatar">
                  <div class="user-detail">
                    <div class="user-name">{{ item.name }}</div>
                    <div class="user-fans">{{ item.fans }}粉丝</div>
                </div>
              </div>
                <div class="user-gmv">
                  <div class="gmv-title">GMV</div>
                  <div class="gmv-value">{{ item.gmv }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
        <!-- 会员等级体系 -->
        <div class="member-section section-card">
        <div class="section-header">
            <h2 class="section-title">会员等级体系</h2>
            <router-link to="/member" class="view-more">会员详情 &gt;</router-link>
            </div>
          <div class="member-levels">
            <div class="level-item" v-for="(level, index) in memberLevels" :key="index">
              <div class="level-icon" :class="level.class">
                <i class="el-icon-trophy"></i>
              </div>
              <div class="level-name">{{ level.name }}</div>
              <div class="level-benefits">
                <div class="benefit" v-for="(benefit, i) in level.benefits" :key="i">
                  {{ benefit }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 功能入口区域 -->
        <div class="features-section section-card">
          <div class="features-grid">
            <div class="feature-box">
              <div class="feature-icon blue">
                <i class="el-icon-picture-outline"></i>
            </div>
              <div class="feature-title">素材中心</div>
              <div class="feature-desc">海量营销素材<br>高质量创意参考</div>
              <router-link to="/materials" class="feature-link">前往查看</router-link>
            </div>
            <div class="feature-box">
              <div class="feature-icon green">
                <i class="el-icon-wallet"></i>
              </div>
              <div class="feature-title">结算中心</div>
              <div class="feature-desc">佣金实时结算<br>快速提现到账</div>
              <router-link to="/settlement" class="feature-link">前往查看</router-link>
            </div>
            <div class="feature-box">
              <div class="feature-icon purple">
                <i class="el-icon-data-analysis"></i>
              </div>
              <div class="feature-title">数据分析</div>
              <div class="feature-desc">销售趋势分析<br>精准营销策略</div>
              <router-link to="/data-analysis" class="feature-link">前往查看</router-link>
            </div>
            <div class="feature-box">
              <div class="feature-icon orange">
                <i class="el-icon-s-help"></i>
              </div>
              <div class="feature-title">帮助中心</div>
              <div class="feature-desc">常见问题解答<br>平台规则指南</div>
              <router-link to="/help" class="feature-link">前往查看</router-link>
            </div>
          </div>
        </div>
        
        <!-- 优势介绍 -->
        <div class="service-section">
          <div class="service-wrapper">
            <div class="service-item">
              <div class="service-icon">
                <img src="@/assets/images/categories/fashion.svg" alt="精选货源">
              </div>
              <div class="service-info">
                <h3>精选货源</h3>
                <p>每日更新达人爆款单品</p>
              </div>
            </div>
            <div class="service-item">
              <div class="service-icon">
                <img src="@/assets/images/categories/beauty.svg" alt="150w+高佣优品">
              </div>
              <div class="service-info">
                <h3>150w+高佣优品</h3>
                <p>零囤货，极速发货</p>
              </div>
            </div>
            <div class="service-item">
              <div class="service-icon">
                <img src="@/assets/images/categories/home.svg" alt="商品爆款榜">
              </div>
              <div class="service-info">
                <h3>商品爆款榜</h3>
                <p>热销榜，每日爆单</p>
              </div>
            </div>
            <div class="service-item">
              <div class="service-icon">
                <img src="@/assets/images/icons/shopping-cart.svg" alt="防踩货好物" style="width: 48px; height: 48px;">
              </div>
              <div class="service-info">
                <h3>防踩货好物</h3>
                <p>防踩坑，放心带货</p>
              </div>
            </div>
            <div class="service-item">
              <div class="service-icon">
                <img src="@/assets/images/icons/search.svg" alt="精选爆款小店" style="width: 48px; height: 48px;">
              </div>
              <div class="service-info">
                <h3>精选爆款小店</h3>
                <p>高分销，爆款有保障</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductShowcase from './home/components/ProductShowcase.vue'
import { products } from '@/mock/products'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    ProductShowcase
  },
  setup() {
    const store = useStore()
    
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const user = computed(() => store.getters['auth/user'])
    const username = computed(() => user.value ? user.value.username : '')
    const userAvatar = computed(() => {
      return user.value && user.value.avatar 
        ? user.value.avatar 
        : require('../assets/images/default-avatar.svg')
    })
    
    // 榜单类型选择
    const activeRankTab = ref('talent') // 'talent'或'merchant'
    
    // 获取热门商品
    const hotProducts = products.sort((a, b) => b.sales.total - a.sales.total).slice(0, 10)
    
    // 模拟商家排行榜数据
    const merchantRankData = [
      {
        id: 1,
        name: '优品衣橱旗舰店',
        logo: require('../assets/images/default-avatar.svg'),
        rating: 4.9,
        sales: '¥310.5万'
      },
      {
        id: 2,
        name: '甜蜜零食旗舰店',
        logo: require('../assets/images/default-avatar.svg'),
        rating: 4.8,
        sales: '¥285.3万'
      },
      {
        id: 3,
        name: '珂丝莱特官方旗舰店',
        logo: require('../assets/images/default-avatar.svg'),
        rating: 4.7,
        sales: '¥256.2万'
      },
      {
        id: 4,
        name: '九阳官方旗舰店',
        logo: require('../assets/images/default-avatar.svg'),
        rating: 4.6,
        sales: '¥196.8万'
      }
    ]
    
    // 模拟任务数据
    const latestTasks = [
      {
        id: 1,
        title: '抖音直播推广本店休闲零食品牌',
        price: 2000,
        type: 'live',
        typeName: '直播任务',
        company: '甜蜜零食旗舰店',
        applicants: 32
      },
      {
        id: 2,
        title: '短视频测评夏季女装新款连衣裙',
        price: 1500,
        type: 'video',
        typeName: '视频任务',
        company: '优品衣橱旗舰店',
        applicants: 24
      },
      {
        id: 3,
        title: '小红书笔记分享护肤心得',
        price: 1200,
        type: 'notes',
        typeName: '笔记任务',
        company: '珂丝莱特官方旗舰店',
        applicants: 15
      },
      {
        id: 4,
        title: '抖音商品卡片推广家用小电器',
        price: 1800,
        type: 'card',
        typeName: '商品卡',
        company: '九阳官方旗舰店',
        applicants: 18
      }
    ]
    
    // 模拟排行榜数据
    const leaderboardData = [
      {
        id: 1,
        name: '美妆达人小王',
        avatar: require('../assets/images/default-avatar.svg'),
        fans: '512.6万',
        gmv: '¥128.5万'
      },
      {
        id: 2,
        name: '潮流穿搭师',
        avatar: require('../assets/images/default-avatar.svg'),
        fans: '486.3万',
        gmv: '¥112.8万'
      },
      {
        id: 3,
        name: '家居生活馆',
        avatar: require('../assets/images/default-avatar.svg'),
        fans: '326.7万',
        gmv: '¥95.2万'
      },
      {
        id: 4,
        name: '厨房好物分享',
        avatar: require('../assets/images/default-avatar.svg'),
        fans: '215.4万',
        gmv: '¥76.9万'
      },
      {
        id: 5,
        name: '数码测评达人',
        avatar: require('../assets/images/default-avatar.svg'),
        fans: '198.2万',
        gmv: '¥65.3万'
      }
    ]
    
    // 模拟会员等级数据
    const memberLevels = [
        { 
        id: 1,
        name: '普通会员',
        class: 'normal',
        benefits: ['每日接单5个', '佣金比例85%', 'T+7提现']
        },
        { 
        id: 2,
        name: '银牌会员',
        class: 'silver',
        benefits: ['每日接单10个', '佣金比例90%', 'T+3提现']
        },
        { 
        id: 3,
        name: '金牌会员',
        class: 'gold',
        benefits: ['每日接单20个', '佣金比例92%', 'T+1提现']
        },
        { 
        id: 4,
        name: '钻石会员',
        class: 'diamond',
        benefits: ['接单无限制', '佣金比例95%', '实时提现']
        }
      ]
    
    return {
      isAuthenticated,
      username,
      userAvatar,
      hotProducts,
      latestTasks,
      leaderboardData,
      memberLevels,
      activeRankTab,
      merchantRankData
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  background-color: #f5f5f5;
  min-height: 100vh;
  margin-top: 39px; /* 精确匹配header高度39px */
  padding: 0;
  overflow-x: hidden;
  line-height: 1;
}

/* 为内容区域添加适当的上边距 */
.main-content {
  padding: 0;
  margin: 0;
  background-color: #f5f5f5;
  padding-top: 20px; /* 添加适当的上边距，分隔导航栏和内容 */
}

/* 消除container的上边距，确保没有空白 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 内容布局调整，确保紧贴顶部 */
.content-layout {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  gap: 6px;
  margin: 0; /* 移除所有边距 */
  padding-top: 0; /* 确保顶部没有内边距 */
}

/* 左侧榜单区域 */
.left-sidebar {
  .hot-rank-section {
    background-color: #fff;
    border-radius: 4px;
    padding: 10px; /* 保持内边距 */
    margin: 0;

.section-header {
      margin-bottom: 10px; /* 减小底部边距 */
      display: flex;
      justify-content: space-between;
      align-items: center;
  
  .section-title {
        font-size: 16px;
    color: #333;
    font-weight: 600;
    position: relative;
        padding-left: 10px;
        margin: 0;
    
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
          width: 3px;
      height: 16px;
      background-color: #ff2c55;
        }
      }
      
      .tab-controls {
        display: flex;
        align-items: center;
        
        .tab {
          flex: 1;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          padding: 6px 0;
          text-align: center;
          position: relative;
          
          &.active {
            color: #ff2c55;
            font-weight: 600;
            
            &::after {
              content: '';
              position: absolute;
              left: 25%;
              right: 25%;
              bottom: -10px;
              height: 2px;
              background-color: #ff2c55;
              border-radius: 1px;
            }
          }
          
          &:hover:not(.active) {
            color: #ff2c55;
          }
        }
        
        .tab-more {
          font-size: 13px;
          color: #999;
          cursor: pointer;
          padding: 6px 10px;
          
          &:hover {
            color: #ff2c55;
          }
        }
      }
    }
    
    .rank-list {
      .rank-item {
    display: flex;
        padding: 10px 0; /* 增加内部间距 */
        border-bottom: 1px solid #f5f5f5;
        align-items: center;
        
        &:last-child {
          border-bottom: none;
        }
        
        .rank-number {
          width: 20px;
          height: 20px;
          background-color: #f3f3f3;
          border-radius: 3px;
          color: #666;
    text-align: center;
          line-height: 20px;
          font-size: 13px;
          margin-right: 8px;
          font-weight: bold;
          flex-shrink: 0;
          
          &.top-rank:nth-child(1) {
            background-color: #ff2c55;
            color: #fff;
          }
          
          &.top-rank:nth-child(2) {
            background-color: #ff6e40;
            color: #fff;
          }
          
          &.top-rank:nth-child(3) {
            background-color: #ff9500;
            color: #fff;
          }
        }
        
        // 达人榜样式
        .user-avatar, .merchant-logo {
          width: 36px; /* 增加头像大小 */
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
          flex-shrink: 0;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        
        .user-info, .merchant-info {
          flex: 1;
          min-width: 0; // 防止文本溢出
          
          .user-name, .merchant-name {
            font-size: 13px;
            color: #333;
            font-weight: 500;
            margin-bottom: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .user-stats {
      display: flex;
      align-items: center;
            justify-content: space-between;
            font-size: 12px;
            
            .fans-count {
              color: #999;
            }
            
            .gmv {
              .label {
                color: #999;
                margin-right: 2px;
              }
              
              .value {
                color: #ff2c55;
                font-weight: bold;
              }
            }
          }
          
          // 商家榜样式
          .merchant-rating {
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            .stars {
              color: #faad14;
        font-size: 12px;
      }
      
            .rating-score {
              font-size: 13px;
        color: #ff2c55;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}

/* 中间内容区域 */
.main-area {
  .promo-banner {
      margin-bottom: 6px;
    border-radius: 4px; /* 减小圆角 */
    overflow: hidden;
    line-height: 0; /* 消除图片底部可能的空白 */
    
    img {
      width: 100%;
      height: auto;
      display: block;
      vertical-align: top; /* 消除图片底部可能的空白 */
    }
  }
  
  .platform-stats {
    background-color: #fff;
    border-radius: 8px;
    padding: 10px; /* 减少内边距 */
    margin-bottom: 6px; /* 减少外边距 */
    
    .stats-wrapper {
      display: flex;
      justify-content: space-around;
      
      .stats-item {
        text-align: center;
        
        .stats-label {
          font-size: 14px;
        color: #666;
        margin-bottom: 5px;
      }
      
        .stats-number {
        font-size: 20px;
          font-weight: bold;
        color: #ff2c55;
      
      .stats-unit {
        font-size: 14px;
        font-weight: normal;
          }
        }
      }
      }
    }
    

}

/* 右侧区域 */
.right-sidebar {
  .user-stats {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    
    .login-prompt {
      .btn-group {
        margin-bottom: 10px;
        
        .register-btn {
          background-color: #ff2c55;
          color: #fff;
          border: none;
          padding: 8px 20px;
          border-radius: 20px;
        font-size: 14px;
          cursor: pointer;
          
          &:hover {
            background-color: darken(#ff2c55, 5%);
          }
        }
      }
      
      p {
        font-size: 14px;
        color: #666;
      }
    }
    
    .user-info {
      margin-bottom: 15px;
      
      .user-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 0 auto 10px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .user-name {
        font-size: 16px;
        color: #333;
        font-weight: 500;
      }
    }
    
    .stats-info {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #f5f5f5;
      
      p {
        font-size: 14px;
      color: #666;
        
        .highlight {
          color: #ff2c55;
          font-weight: 600;
        }
      }
    }
  }
}

/* 商品推荐区域 */
.products-section {
  margin-bottom: 20px;
}

/* 通用卡片样式 */
.section-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 10px; /* 减小底部边距 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .section-title {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    position: relative;
    padding-left: 10px;
    margin: 0;
    
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 16px;
      background-color: #ff2c55;
    }
  }
  
  .view-more {
    font-size: 14px;
    color: #999;
    text-decoration: none;
    
    &:hover {
      color: #ff2c55;
    }
  }
  
  .tab-controls {
    display: flex;
    align-items: center;
    
    .tab {
      font-size: 14px;
      color: #666;
    cursor: pointer;
      margin-right: 10px;
      
      &.active {
        color: #ff2c55;
        font-weight: 600;
      }
    }
  }
}

/* 任务区域样式 */
.tasks-section {
  .tasks-content {
    display: flex;
    gap: 20px;
  }
  
  .tasks-list {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .task-item {
    .task-card {
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      padding: 15px;
      height: 100%;
      transition: all 0.3s;
      cursor: pointer;
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      }
      
      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        
        .task-tag {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          color: #fff;
          
          &.live {
            background-color: #ff2c55;
          }
          
          &.video {
            background-color: #00b578;
          }
          
          &.notes {
            background-color: #ff9500;
          }
          
          &.card {
            background-color: #0091ff;
          }
        }
        
        .task-price {
          font-size: 16px;
          font-weight: bold;
          color: #ff2c55;
        }
      }
      
      .task-title {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 10px;
        color: #333;
        line-height: 1.4;
        height: 40px;
        overflow: hidden;
      }
      
      .task-bottom {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .task-publish {
    width: 200px;
    
    .publish-card {
      height: 100%;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .icon-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
        background-color: #ff2c55;
        color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
        margin-bottom: 15px;
      }
      
      h3 {
        font-size: 16px;
        color: #333;
        margin: 0 0 8px;
      }
      
      p {
        font-size: 12px;
        color: #999;
        margin: 0 0 15px;
        text-align: center;
      }
      
      .publish-btn {
        background-color: #ff2c55;
        color: #fff;
        border: none;
        padding: 6px 15px;
        border-radius: 20px;
      font-size: 14px;
        text-decoration: none;
        
        &:hover {
          background-color: darken(#ff2c55, 5%);
    }
  }
}
  }
}

/* 抖音账号授权区域 */
.account-auth-section {
  .auth-steps {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 25px;
    
    .auth-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      
      .step-number {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #ff2c55;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        position: absolute;
        top: -5px;
        right: -5px;
        z-index: 1;
  }
  
      .step-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #fff2ee;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #ff2c55;
        margin-bottom: 8px;
      }
      
      .step-desc {
        font-size: 14px;
        color: #666;
      }
    }
    
    .step-arrow {
      font-size: 20px;
      color: #ddd;
    }
  }
  
  .auth-desc {
    text-align: center;
    
    p {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
    }
    
    .auth-btn {
      display: inline-block;
      background-color: #ff2c55;
      color: #fff;
      padding: 8px 25px;
      border-radius: 20px;
      font-size: 14px;
      text-decoration: none;
      
      &:hover {
        background-color: darken(#ff2c55, 5%);
      }
    }
  }
}

/* 排行榜区域 */
.leaderboard-section {
  .leaderboard-content {
    .leaderboard-list {
      .leaderboard-item {
      display: flex;
      align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .rank-number {
          width: 22px;
          height: 22px;
          background-color: #f3f3f3;
      border-radius: 4px;
          color: #666;
          text-align: center;
          line-height: 22px;
          font-size: 14px;
          margin-right: 10px;
          font-weight: bold;
      
          &.top-rank {
            background-color: #ff2c55;
            color: #fff;
          }
      }
      
        .user-info {
          flex: 1;
          display: flex;
          align-items: center;
          
          .user-avatar {
            width: 36px;
            height: 36px;
        border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
          }
          
          .user-detail {
            .user-name {
              font-size: 14px;
              color: #333;
              margin-bottom: 2px;
            }
            
            .user-fans {
              font-size: 12px;
              color: #999;
            }
          }
        }
        
        .user-gmv {
          text-align: right;
          
          .gmv-title {
            font-size: 12px;
            color: #999;
            margin-bottom: 2px;
          }
          
          .gmv-value {
            font-size: 14px;
            font-weight: bold;
            color: #ff2c55;
          }
        }
      }
    }
  }
}

/* 会员等级体系 */
.member-section {
  .member-levels {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    
    .level-item {
      flex: 1;
      text-align: center;
      border-radius: 8px;
      padding: 20px;
      background-color: #f8f8f8;
      
      .level-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 auto 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 20px;
        
        &.normal {
          background-color: #8c8c8c;
        }
        
        &.silver {
          background-color: #b3b3b3;
        }
        
        &.gold {
          background-color: #ff9500;
        }
        
        &.diamond {
          background-color: #0091ff;
        }
      }
      
      .level-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .level-benefits {
        .benefit {
        font-size: 13px;
          color: #666;
          margin-bottom: 5px;
          
          &:last-child {
            margin-bottom: 0;
      }
    }
  }
}
  }
}

/* 功能入口区域 */
.features-section {
  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    
    .feature-box {
      border-radius: 8px;
      background-color: #f8f8f8;
      padding: 20px;
    text-align: center;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-3px);
  }
  
      .feature-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 auto 10px;
    display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 20px;
        
        &.blue {
          background-color: #0091ff;
        }
        
        &.green {
          background-color: #00b578;
        }
        
        &.purple {
          background-color: #722ed1;
        }
        
        &.orange {
          background-color: #ff9500;
        }
    }
    
      .feature-title {
        font-size: 16px;
        font-weight: bold;
      color: #333;
        margin-bottom: 8px;
    }
    
      .feature-desc {
        font-size: 13px;
        color: #999;
        margin-bottom: 10px;
      line-height: 1.5;
    }
      
      .feature-link {
        display: inline-block;
        padding: 4px 12px;
        background-color: #fff;
        border-radius: 16px;
        font-size: 13px;
        color: #ff2c55;
        text-decoration: none;
        border: 1px solid #ff2c55;
        
        &:hover {
          background-color: #ff2c55;
          color: #fff;
        }
      }
    }
  }
}

/* 服务优势区域 */
.service-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px 0;
  margin-bottom: 20px;
  
  .service-wrapper {
    display: flex;
    
    .service-item {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 15px;
      
      &:not(:last-child) {
        border-right: 1px solid #f0f0f0;
      }
      
      .service-icon {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      
      .service-info {
        h3 {
          font-size: 16px;
          color: #333;
          margin: 0 0 5px;
        }
        
        p {
          font-size: 13px;
          color: #999;
          margin: 0;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
  
  .service-wrapper {
    flex-wrap: wrap;
    
    .service-item {
      width: 50%;
      flex: none;
      margin-bottom: 15px;
      
      &:not(:last-child) {
        border-right: none;
      }
    }
  }
  
  .tasks-section {
    .tasks-content {
      flex-direction: column;
    }
    
    .tasks-list {
      grid-template-columns: 1fr;
    }
    
    .task-publish {
        width: 100%;
      margin-top: 15px;
    }
  }
  
  .member-section {
    .member-levels {
      flex-wrap: wrap;
      
      .level-item {
        width: 48%;
        flex: none;
        margin-bottom: 15px;
      }
    }
  }
  
  .features-section {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
      
      .feature-box {
        margin-bottom: 15px;
    }
  }
  }
}

@media (max-width: 768px) {
  .main-area {
  }
    
  .auth-steps {
    flex-direction: column;
    
    .step-arrow {
      transform: rotate(90deg);
    }
  }
  
  .member-section {
    .member-levels {
      .level-item {
        width: 100%;
      }
    }
  }
  
  .features-section {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 