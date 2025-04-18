import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth, initAuth } from '../stores/auth'

// Define routes
const routes: Array<RouteRecordRaw> = [
  // Auth routes
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false, hideNavigation: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresAuth: false, hideNavigation: true }
  },
  // App routes (require authentication)
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/ProductsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../views/SalesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/ReportsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true }
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Initialize authentication
let authInitialized = false

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Initialize auth if not already done
  if (!authInitialized) {
    await initAuth()
    authInitialized = true
  }

  const { isAuthenticated } = useAuth()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !isAuthenticated.value) {
    // Redirect to login if authentication is required but user is not authenticated
    next({ name: 'Login' })
  } else if (to.path === '/login' && isAuthenticated.value) {
    // Redirect to home if user is already authenticated and tries to access login
    next({ name: 'Home' })
  } else {
    // Otherwise proceed as normal
    next()
  }
})

export default router
