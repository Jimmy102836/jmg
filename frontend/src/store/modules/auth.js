import axios from 'axios'

const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null
}

const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  userRole: state => state.user ? state.user.role : null
}

const actions = {
  // 用户注册
  async register({ commit }, userData) {
    try {
      const response = await axios.post('/auth/register', userData)
      if (response.data.code === 200) {
        const { token, user } = response.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        commit('AUTH_SUCCESS', { token, user })
        return response
      }
    } catch (error) {
      commit('AUTH_ERROR', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error
    }
  },

  // 用户登录
  async login({ commit }, credentials) {
    try {
      const response = await axios.post('/auth/login', credentials)
      if (response.data.code === 200) {
        const { token, user } = response.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        commit('AUTH_SUCCESS', { token, user })
        return response
      }
    } catch (error) {
      commit('AUTH_ERROR', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error
    }
  },

  // 获取用户信息
  async getUserInfo({ commit, state }) {
    try {
      if (!state.token) return
      const response = await axios.get('/user/info')
      if (response.data.code === 200) {
        const user = response.data.data
        localStorage.setItem('user', JSON.stringify(user))
        commit('SET_USER', user)
        return user
      }
    } catch (error) {
      console.error('获取用户信息失败', error)
      throw error
    }
  },

  // 登出
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('LOGOUT')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      resolve()
    })
  }
}

const mutations = {
  AUTH_SUCCESS(state, { token, user }) {
    state.token = token
    state.user = user
  },
  AUTH_ERROR(state) {
    state.token = ''
    state.user = null
  },
  SET_USER(state, user) {
    state.user = user
  },
  LOGOUT(state) {
    state.token = ''
    state.user = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} 