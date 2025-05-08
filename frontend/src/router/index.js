import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// 路由懒加载
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/login/Login.vue')
const Register = () => import('../views/register/Register.vue')
const Dashboard = () => import('../views/merchant/Dashboard.vue')
const TaskManagement = () => import('../views/merchant/TaskManagement.vue')
const MaterialManagement = () => import('../views/merchant/MaterialManagement.vue')
const TaskList = () => import('../views/TaskList.vue')
const TaskDetail = () => import('../views/TaskDetail.vue')
const Forbidden = () => import('../views/Forbidden.vue')

// 管理员路由
const AdminLayout = () => import('../components/admin/AdminLayout.vue')
const AdminDashboard = () => import('../views/admin/Dashboard.vue')
const MerchantList = () => import('../views/admin/users/MerchantList.vue')
const AdminTaskList = () => import('../views/admin/tasks/TaskList.vue')
const MaterialList = () => import('../views/admin/materials/MaterialList.vue')
const SystemSettings = () => import('../views/admin/settings/SystemSettings.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '抖音团长平台 - 首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册' }
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList,
    meta: { title: '任务列表' }
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: TaskDetail,
    meta: { title: '任务详情' }
  },
  {
    path: '/merchant',
    name: 'MerchantDashboard',
    component: Dashboard,
    meta: { title: '商家控制台', requiresAuth: true, role: 'merchant' }
  },
  {
    path: '/merchant/tasks',
    name: 'MerchantTasks',
    component: TaskManagement,
    meta: { title: '任务管理', requiresAuth: true, role: 'merchant' }
  },
  {
    path: '/merchant/materials',
    name: 'MerchantMaterials',
    component: MaterialManagement,
    meta: { title: '素材管理', requiresAuth: true, role: 'merchant' }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: { title: '无权限访问' }
  },
  // 管理员路由
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: { name: 'AdminDashboard' }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { title: '管理控制台', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'merchants',
        name: 'MerchantList',
        component: MerchantList,
        meta: { title: '商家管理', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'tasks',
        name: 'AdminTaskList',
        component: AdminTaskList,
        meta: { title: '任务管理', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'materials',
        name: 'MaterialList',
        component: MaterialList,
        meta: { title: '素材管理', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: SystemSettings,
        meta: { title: '系统设置', requiresAuth: true, role: 'admin' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '抖音团长平台'
  
  // 检查用户是否需要登录
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    // 支持多角色
    if (to.meta.role) {
      const userRole = store.getters['auth/userRole']
      const roles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
      if (!roles.includes(userRole)) {
        next('/403')
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router 