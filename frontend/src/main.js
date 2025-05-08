import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

// 配置axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '/api'
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      store.dispatch('auth/logout')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

// 如果启用了模拟API，则导入模拟数据
if (window.enableMockApi) {
  console.log('已启用API模拟功能')
  import('./mock/api-mock').then(() => {
    console.log('API模拟加载完成')
  })
}

// 初始化应用
app.use(store)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$axios = axios

app.mount('#app') 