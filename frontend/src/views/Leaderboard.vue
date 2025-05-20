<template>
  <div class="leaderboard-page">
    <Header />
    
    <div class="page-content">
      <div class="leaderboard-container">
        <el-card class="leaderboard-card">
          <template #header>
            <div class="card-header">
              <h2>吉米哥达人任务平台排行榜</h2>
              <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane label="达人GMV排行榜" name="user"></el-tab-pane>
                <el-tab-pane label="商户评分排行榜" name="merchant"></el-tab-pane>
              </el-tabs>
            </div>
          </template>
          
          <div class="period-filter">
            <el-radio-group v-model="period" @change="fetchLeaderboard">
              <el-radio-button label="daily">日榜</el-radio-button>
              <el-radio-button label="weekly">周榜</el-radio-button>
              <el-radio-button label="monthly">月榜</el-radio-button>
              <el-radio-button label="all_time">总榜</el-radio-button>
            </el-radio-group>
          </div>
          
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="10" animated />
          </div>
          
          <div v-else class="leaderboard-content">
            <div v-if="myRank" class="my-rank">
              <div class="rank-title">我的排名</div>
              <div class="rank-info">
                <span class="rank-number">{{ myRank.rank || '未上榜' }}</span>
                <span class="score">{{ formatScore(myRank.score) }}</span>
              </div>
            </div>
            
            <el-table :data="leaderboardData" style="width: 100%">
              <el-table-column label="排名" width="80">
                <template #default="scope">
                  <div class="rank-cell">
                    <div :class="['rank-badge', getRankClass(scope.row.rank)]">{{ scope.row.rank }}</div>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column label="用户信息">
                <template #default="scope">
                  <div class="user-info">
                    <el-avatar :size="40" :src="scope.row.user.avatar || defaultAvatar"></el-avatar>
                    <div class="user-details">
                      <div class="username">{{ scope.row.user.name }}</div>
                      <div class="user-type">{{ getUserType(scope.row.user.role) }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column :label="activeTab === 'user' ? 'GMV (元)' : '评分'" width="120" align="right">
                <template #default="scope">
                  <div class="score-cell">
                    <template v-if="activeTab === 'user'">
                      <span class="gmv">¥ {{ formatNumber(scope.row.score) }}</span>
                    </template>
                    <template v-else>
                      <el-rate
                        v-model="scope.row.score"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
                      ></el-rate>
                    </template>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <div v-if="leaderboardData.length === 0" class="empty-data">
              <el-empty description="暂无排行数据"></el-empty>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'LeaderboardView',
  components: {
    Header,
    Footer
  },
  setup() {
    const store = useStore();
    const activeTab = ref('user');
    const period = ref('all_time');
    const loading = ref(true);
    const leaderboardData = ref([]);
    const myRank = ref(null);
    const defaultAvatar = '/img/default-avatar.png';
    
    const periodText = computed(() => {
      const map = {
        daily: '日榜',
        weekly: '周榜',
        monthly: '月榜',
        all_time: '总榜'
      };
      return map[period.value] || '总榜';
    });
    
    const fetchLeaderboard = async () => {
      loading.value = true;
      try {
        // 根据当前标签页获取排行榜数据
        if (activeTab.value === 'user') {
          await store.dispatch('leaderboard/getUserLeaderboard', { period: period.value });
        } else {
          await store.dispatch('leaderboard/getMerchantLeaderboard', { period: period.value });
        }
        
        // 获取用户自己的排名
        await store.dispatch('leaderboard/getMyRank', { 
          type: activeTab.value,
          period: period.value
        });
        
        leaderboardData.value = store.getters['leaderboard/getLeaderboard'](activeTab.value);
        myRank.value = store.getters['leaderboard/getMyRank'];
      } catch (error) {
        console.error('获取排行榜数据失败:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const handleTabChange = () => {
      fetchLeaderboard();
    };
    
    const getRankClass = (rank) => {
      if (rank === 1) return 'rank-first';
      if (rank === 2) return 'rank-second';
      if (rank === 3) return 'rank-third';
      return '';
    };
    
    const getUserType = (role) => {
      const map = {
        creator: '达人',
        merchant: '商家',
        admin: '管理员'
      };
      return map[role] || '用户';
    };
    
    const formatNumber = (num) => {
      return Number(num).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    const formatScore = (score) => {
      if (activeTab.value === 'user') {
        return `GMV: ¥${formatNumber(score)}`;
      } else {
        return `评分: ${score.toFixed(1)}`;
      }
    };
    
    onMounted(() => {
      fetchLeaderboard();
    });
    
    return {
      activeTab,
      period,
      periodText,
      loading,
      leaderboardData,
      myRank,
      defaultAvatar,
      handleTabChange,
      getRankClass,
      getUserType,
      formatNumber,
      formatScore,
      fetchLeaderboard
    };
  }
};
</script>

<style lang="scss" scoped>
.leaderboard-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 40px 0;
  background-color: #f5f7fa;
}

.leaderboard-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.leaderboard-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  flex-direction: column;
}

.card-header h2 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.period-filter {
  margin: 20px 0;
  text-align: center;
}

.loading-container {
  padding: 20px;
}

.leaderboard-content {
  padding: 10px 0;
}

.my-rank {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rank-title {
  font-weight: bold;
  font-size: 16px;
}

.rank-info {
  display: flex;
  align-items: center;
}

.rank-number {
  font-size: 24px;
  font-weight: bold;
  margin-right: 15px;
  color: #409EFF;
}

.rank-cell {
  display: flex;
  justify-content: center;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-weight: bold;
}

.rank-first {
  background-color: #FFD700;
  color: #fff;
}

.rank-second {
  background-color: #C0C0C0;
  color: #fff;
}

.rank-third {
  background-color: #CD7F32;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-left: 10px;
}

.username {
  font-weight: bold;
}

.user-type {
  font-size: 0.85rem;
  color: #999;
}

.empty-data {
  padding: 30px 0;
  text-align: center;
}
</style> 