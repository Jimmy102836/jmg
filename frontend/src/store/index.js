import { createStore } from 'vuex'
import auth from './modules/auth'
import task from './modules/task'
import material from './modules/material'
import stats from './modules/stats'
import leaderboard from './modules/leaderboard'

export default createStore({
  state: {
    loading: false,
    error: null
  },
  mutations: {
    SET_LOADING(state, isLoading) {
      state.loading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    setLoading({ commit }, isLoading) {
      commit('SET_LOADING', isLoading)
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error)
    }
  },
  modules: {
    auth,
    task,
    material,
    stats,
    leaderboard
  }
}) 