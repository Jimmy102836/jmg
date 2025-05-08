import axios from 'axios'

const state = {
  tasks: [],
  categories: [],
  currentTask: null,
  userTasks: [],
  taskApplications: [],
  totalTasks: 0,
  loading: false
}

const getters = {
  allTasks: state => state.tasks,
  taskCategories: state => state.categories,
  currentTask: state => state.currentTask,
  userTasks: state => state.userTasks,
  taskApplications: state => state.taskApplications,
  totalTasks: state => state.totalTasks,
  isLoading: state => state.loading
}

const actions = {
  // 获取任务分类
  async fetchCategories({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/tasks/categories')
      if (response.data.code === 200) {
        commit('SET_CATEGORIES', response.data.data)
      }
      commit('SET_LOADING', false)
      return response.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('获取任务分类失败', error)
      throw error
    }
  },

  // 获取任务列表
  async fetchTasks({ commit }, params = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/tasks', { params })
      if (response.data.code === 200) {
        commit('SET_TASKS', response.data.data.data)
        commit('SET_TOTAL_TASKS', response.data.data.total)
      }
      commit('SET_LOADING', false)
      return response.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('获取任务列表失败', error)
      throw error
    }
  },

  // 获取任务详情
  async fetchTaskDetail({ commit }, taskId) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get(`/tasks/${taskId}`)
      if (response.data.code === 200) {
        commit('SET_CURRENT_TASK', response.data.data)
      }
      commit('SET_LOADING', false)
      return response.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('获取任务详情失败', error)
      throw error
    }
  },

  // 创建任务
  async createTask({ commit }, taskData) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post('/tasks', taskData)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('创建任务失败', error)
      throw error
    }
  },

  // 获取商家任务列表
  async fetchMerchantTasks({ commit }, params = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/tasks/merchant', { params })
      if (response.data.code === 200) {
        commit('SET_USER_TASKS', response.data.data.data)
      }
      commit('SET_LOADING', false)
      return response.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('获取商家任务列表失败', error)
      throw error
    }
  },

  // 获取达人任务申请列表
  async fetchTaskApplications({ commit }, params = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/tasks/applications', { params })
      if (response.data.code === 200) {
        commit('SET_TASK_APPLICATIONS', response.data.data.data)
      }
      commit('SET_LOADING', false)
      return response.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('获取任务申请列表失败', error)
      throw error
    }
  },

  // 申请任务
  async applyTask({ commit }, { taskId, applyData }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post(`/tasks/${taskId}/apply`, applyData)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('申请任务失败', error)
      throw error
    }
  },

  // 审核任务
  async auditTask({ commit }, { taskId, result, comment }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post(`/tasks/${taskId}/audit`, { result, comment })
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('审核任务失败', error)
      throw error
    }
  },

  // 完成任务
  async completeTask({ commit }, taskId) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post(`/tasks/${taskId}/complete`)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('完成任务失败', error)
      throw error
    }
  },

  // 取消任务
  async cancelTask({ commit }, taskId) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post(`/tasks/${taskId}/cancel`)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('取消任务失败', error)
      throw error
    }
  }
}

const mutations = {
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },
  SET_TOTAL_TASKS(state, total) {
    state.totalTasks = total
  },
  SET_CURRENT_TASK(state, task) {
    state.currentTask = task
  },
  SET_USER_TASKS(state, tasks) {
    state.userTasks = tasks
  },
  SET_TASK_APPLICATIONS(state, applications) {
    state.taskApplications = applications
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} 