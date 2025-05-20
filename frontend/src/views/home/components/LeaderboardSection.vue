<template>
  <div class="leaderboard-section">
    <div class="section-header">
      <h3 class="section-title">平台排行榜</h3>
      <router-link to="/leaderboard" class="view-more">全部 <i class="el-icon-arrow-right"></i></router-link>
    </div>
    
    <div class="leaderboard-tabs">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index" 
        class="tab-item" 
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>
    
    <div class="leaderboard-content">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      <div v-else>
        <div v-if="activeTab === 'user'" class="rank-list">
          <div v-for="(item, index) in userLeaderboard" :key="index" class="rank-item">
            <div class="rank-badge" :class="getRankClass(item.rank)">
              {{ item.rank }}
            </div>
            <div class="user-info">
              <el-avatar :size="40" :src="item.user?.avatar || defaultAvatar"></el-avatar>
              <div class="user-details">
                <div class="username">{{ item.user?.name || '匿名用户' }}</div>
                <div class="user-stats">
                  <span class="user-type">达人</span>
                  <span class="user-metric">GMV: ¥{{ formatNumber(item.score || 0) }}</span>
                </div>
              </div>
            </div>
            <div class="score-trend">
              <i class="el-icon-top" v-if="index < 2"></i>
              <i class="el-icon-bottom" v-else-if="index > 3"></i>
              <i class="el-icon-minus" v-else></i>
            </div>
          </div>
          <div v-if="userLeaderboard.length === 0" class="empty-data">
            <el-empty description="暂无排行数据"></el-empty>
          </div>
        </div>
        
        <div v-else class="rank-list">
          <div v-for="(item, index) in merchantLeaderboard" :key="index" class="rank-item">
            <div class="rank-badge" :class="getRankClass(item.rank)">
              {{ item.rank }}
            </div>
            <div class="user-info">
              <el-avatar :size="40" :src="item.user?.avatar || defaultAvatar"></el-avatar>
              <div class="user-details">
                <div class="username">{{ item.user?.name || '匿名商户' }}</div>
                <div class="user-stats">
                  <span class="user-type">商家</span>
                  <div class="rating">
                    <el-rate
                      v-model="item.score"
                      disabled
                      text-color="#ff9900"
                      score-template="{value}"
                    ></el-rate>
                  </div>
                </div>
              </div>
            </div>
            <div class="score-trend">
              <i class="el-icon-top" v-if="index < 2"></i>
              <i class="el-icon-bottom" v-else-if="index > 3"></i>
              <i class="el-icon-minus" v-else></i>
            </div>
          </div>
          <div v-if="merchantLeaderboard.length === 0" class="empty-data">
            <el-empty description="暂无排行数据"></el-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'LeaderboardSection',
  setup() {
    const store = useStore();
    const activeTab = ref('user');
    const loading = ref(true);
    const defaultAvatar = '/img/default-avatar.png';
    
    const tabs = [
      { label: '达人排行', value: 'user' },
      { label: '商家排行', value: 'merchant' }
    ];
    
    // 从store获取数据
    const userLeaderboard = computed(() => {
      return store.getters['leaderboard/getLeaderboard']('user').slice(0, 5); // 只显示前5名
    });
    
    const merchantLeaderboard = computed(() => {
      return store.getters['leaderboard/getLeaderboard']('merchant').slice(0, 5); // 只显示前5名
    });
    
    // 获取排行榜数据
    const fetchLeaderboardData = async () => {
      loading.value = true;
      try {
        // 获取用户排行榜
        await store.dispatch('leaderboard/getUserLeaderboard', {
          period: 'all_time',
          limit: 5
        });
        
        // 获取商户排行榜
        await store.dispatch('leaderboard/getMerchantLeaderboard', {
          period: 'all_time',
          limit: 5
        });
      } catch (error) {
        console.error('获取排行榜数据失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // 根据排名返回对应的CSS类
    const getRankClass = (rank) => {
      if (rank === 1) return 'rank-first';
      if (rank === 2) return 'rank-second';
      if (rank === 3) return 'rank-third';
      return '';
    };
    
    // 格式化数字
    const formatNumber = (num) => {
      return Number(num).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    onMounted(() => {
      fetchLeaderboardData();
    });
    
    return {
      activeTab,
      loading,
      userLeaderboard,
      merchantLeaderboard,
      defaultAvatar,
      getRankClass,
      formatNumber,
      tabs
    };
  }
};
</script>

<style lang="scss" scoped>
.leaderboard-section {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  padding: 25px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    position: relative;
    padding-left: 15px;
    margin: 0;
    
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 18px;
      background-color: #ff2c55;
      border-radius: 2px;
    }
  }
  
  .view-more {
    color: #666;
    font-size: 14px;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    
    i {
      margin-left: 5px;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: #ff2c55;
      
      i {
        transform: translateX(3px);
      }
    }
  }
}

.leaderboard-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  
  .tab-item {
    padding: 0 20px 12px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    position: relative;
    
    &.active {
      color: #ff2c55;
      font-weight: 500;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #ff2c55;
      }
    }
    
    &:hover:not(.active) {
      color: #ff2c55;
    }
  }
}

.loading-container {
  padding: 20px 0;
}

.rank-list {
  .rank-item {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f5f5f5;
    transition: all 0.3s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: #f9f9f9;
    }
  }
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-weight: 600;
  margin-right: 15px;
  flex-shrink: 0;
  color: #fff;
  background-color: #e0e0e0;
  font-size: 12px;
}

.rank-first {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);
}

.rank-second {
  background: linear-gradient(45deg, #C0C0C0, #A9A9A9);
  box-shadow: 0 2px 6px rgba(192, 192, 192, 0.3);
}

.rank-third {
  background: linear-gradient(45deg, #CD7F32, #B87333);
  box-shadow: 0 2px 6px rgba(205, 127, 50, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.user-details {
  margin-left: 12px;
}

.username {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-stats {
  display: flex;
  align-items: center;
  
  .user-type {
    font-size: 12px;
    color: #999;
    padding: 1px 6px;
    background-color: #f5f5f5;
    border-radius: 3px;
    margin-right: 8px;
  }
  
  .user-metric {
    font-size: 12px;
    color: #ff2c55;
    font-weight: 500;
  }
  
  .rating {
    :deep(.el-rate__icon) {
      font-size: 14px;
      margin-right: 2px;
    }
    
    :deep(.el-rate__text) {
      font-size: 12px;
    }
  }
}

.score-trend {
  margin-left: 15px;
  font-size: 16px;
  
  .el-icon-top {
    color: #52c41a;
  }
  
  .el-icon-bottom {
    color: #ff4d4f;
  }
  
  .el-icon-minus {
    color: #faad14;
  }
}

.empty-data {
  padding: 30px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .user-details {
    max-width: 100%;
  }
  
  .user-stats {
    flex-wrap: wrap;
    
    .user-type {
      margin-bottom: 5px;
    }
  }
}
</style> 