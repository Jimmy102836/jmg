import axios from 'axios';

const state = {
  userLeaderboard: [],
  merchantLeaderboard: [],
  myRank: null,
  leaderboardLoading: false,
};

const getters = {
  getLeaderboard: (state) => (type) => {
    return type === 'user' ? state.userLeaderboard : state.merchantLeaderboard;
  },
  getMyRank: (state) => state.myRank,
  isLoading: (state) => state.leaderboardLoading,
};

const mutations = {
  SET_USER_LEADERBOARD(state, leaderboard) {
    state.userLeaderboard = leaderboard;
  },
  SET_MERCHANT_LEADERBOARD(state, leaderboard) {
    state.merchantLeaderboard = leaderboard;
  },
  SET_MY_RANK(state, rank) {
    state.myRank = rank;
  },
  SET_LOADING(state, loading) {
    state.leaderboardLoading = loading;
  },
};

const actions = {
  async getUserLeaderboard({ commit }, { period = 'all_time', limit = 50 }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/api/leaderboards/users', {
        params: { period, limit }
      });
      
      if (response.data.success) {
        commit('SET_USER_LEADERBOARD', response.data.data);
      }
    } catch (error) {
      console.error('获取用户排行榜失败:', error);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async getMerchantLeaderboard({ commit }, { period = 'all_time', limit = 50 }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/api/leaderboards/merchants', {
        params: { period, limit }
      });
      
      if (response.data.success) {
        commit('SET_MERCHANT_LEADERBOARD', response.data.data);
      }
    } catch (error) {
      console.error('获取商户排行榜失败:', error);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async getMyRank({ commit }, { type, period = 'all_time' }) {
    try {
      const response = await axios.get('/api/leaderboards/my-rank', {
        params: { type, period }
      });
      
      if (response.data.success) {
        commit('SET_MY_RANK', response.data.data);
      }
    } catch (error) {
      console.error('获取我的排名失败:', error);
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 