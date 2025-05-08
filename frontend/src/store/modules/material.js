import axios from 'axios'

const state = {
  materials: [],
  currentMaterial: null,
  totalMaterials: 0,
  loading: false
}

const getters = {
  allMaterials: state => state.materials,
  currentMaterial: state => state.currentMaterial,
  totalMaterials: state => state.totalMaterials,
  isLoading: state => state.loading
}

const actions = {
  // 获取素材列表
  async fetchMaterials({ commit }, params = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/materials', { params })
      if (response.data.code === 200) {
        commit('SET_MATERIALS', response.data.data.data)
        commit('SET_TOTAL_MATERIALS', response.data.data.total)
      }
      commit('SET_LOADING', false)
      return response.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('获取素材列表失败', error)
      throw error
    }
  },

  // 获取素材详情
  async fetchMaterialDetail({ commit }, materialId) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get(`/materials/${materialId}`)
      if (response.data.code === 200) {
        commit('SET_CURRENT_MATERIAL', response.data.data)
      }
      commit('SET_LOADING', false)
      return response.data.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('获取素材详情失败', error)
      throw error
    }
  },

  // 上传素材
  async uploadMaterial({ commit }, formData) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post('/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('上传素材失败', error)
      throw error
    }
  },

  // 更新素材
  async updateMaterial({ commit }, { materialId, data }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.put(`/materials/${materialId}`, data)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('更新素材失败', error)
      throw error
    }
  },

  // 删除素材
  async deleteMaterial({ commit }, materialId) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.delete(`/materials/${materialId}`)
      commit('SET_LOADING', false)
      return response.data
    } catch (error) {
      commit('SET_LOADING', false)
      console.error('删除素材失败', error)
      throw error
    }
  }
}

const mutations = {
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_MATERIALS(state, materials) {
    state.materials = materials
  },
  SET_TOTAL_MATERIALS(state, total) {
    state.totalMaterials = total
  },
  SET_CURRENT_MATERIAL(state, material) {
    state.currentMaterial = material
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} 