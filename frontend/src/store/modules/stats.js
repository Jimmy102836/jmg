import axios from 'axios'

const state = {
  overview: {},
  taskTrend: [],
  taskType: [],
  latestTasks: [],
  activities: [],
  loading: false
}

const getters = {
  overview: state => state.overview,
  taskTrend: state => state.taskTrend,
  taskType: state => state.taskType,
  latestTasks: state => state.latestTasks,
  activities: state => state.activities,
  isLoading: state => state.loading
}

const actions = {
  // 获取数据概览
  async fetchOverview({ commit }) {
    commit('SET_LOADING', true)
    try {
      const res = await axios.get('/stats/overview')
      if (res.data.code === 200) {
        commit('SET_OVERVIEW', res.data.data)
      }
      commit('SET_LOADING', false)
      return res.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      throw error
    }
  },
  // 获取任务趋势
  async fetchTaskTrend({ commit }, type = 'week') {
    commit('SET_LOADING', true)
    try {
      const res = await axios.get('/stats/task-trend', { params: { type } })
      if (res.data.code === 200) {
        commit('SET_TASK_TREND', res.data.data)
      }
      commit('SET_LOADING', false)
      return res.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      throw error
    }
  },
  // 获取任务类型分布
  async fetchTaskType({ commit }) {
    commit('SET_LOADING', true)
    try {
      const res = await axios.get('/stats/task-type')
      if (res.data.code === 200) {
        commit('SET_TASK_TYPE', res.data.data)
      }
      commit('SET_LOADING', false)
      return res.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      throw error
    }
  },
  // 获取最新任务
  async fetchLatestTasks({ commit }) {
    commit('SET_LOADING', true)
    try {
      const res = await axios.get('/stats/latest-tasks')
      if (res.data.code === 200) {
        commit('SET_LATEST_TASKS', res.data.data)
      }
      commit('SET_LOADING', false)
      return res.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      throw error
    }
  },
  // 获取系统通知
  async fetchActivities({ commit }) {
    commit('SET_LOADING', true)
    try {
      const res = await axios.get('/stats/activities')
      if (res.data.code === 200) {
        commit('SET_ACTIVITIES', res.data.data)
      }
      commit('SET_LOADING', false)
      return res.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      throw error
    }
  }
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_OVERVIEW(state, data) {
    state.overview = data
  },
  SET_TASK_TREND(state, data) {
    state.taskTrend = data
  },
  SET_TASK_TYPE(state, data) {
    state.taskType = data
  },
  SET_LATEST_TASKS(state, data) {
    state.latestTasks = data
  },
  SET_ACTIVITIES(state, data) {
    state.activities = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} 