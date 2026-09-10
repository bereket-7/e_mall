import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import ProductList from '../views/ProductList.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminProducts from '../views/admin/AdminProducts.vue'
import AdminOrders from '../views/admin/AdminOrders.vue'
import AdminCustomers from '../views/admin/AdminCustomers.vue'
import AdminReports from '../views/admin/AdminReports.vue'
import AdminCoupons from '../views/admin/AdminCoupons.vue'
import AdminReviews from '../views/admin/AdminReviews.vue'
import Wishlist from '../views/Wishlist.vue'
import OrderHistory from '../views/OrderHistory.vue'
import OrderTracking from '../views/OrderTracking.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
import StaticPage from '../views/StaticPage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/:category', name: 'CategoryProducts', component: ProductList },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/wishlist', name: 'Wishlist', component: Wishlist },
  { path: '/orders', name: 'OrderHistory', component: OrderHistory, meta: { requiresAuth: true } },
  {
    path: '/track/:orderId',
    name: 'OrderTracking',
    component: OrderTracking,
    meta: { requiresAuth: true }
  },
  { path: '/shipping', name: 'Shipping', component: StaticPage, props: { page: 'shipping' } },
  { path: '/returns', name: 'Returns', component: StaticPage, props: { page: 'returns' } },
  { path: '/privacy', name: 'Privacy', component: StaticPage, props: { page: 'privacy' } },
  { path: '/terms', name: 'Terms', component: StaticPage, props: { page: 'terms' } },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' }
  },
  {
    path: '/admin/customers',
    name: 'AdminCustomers',
    component: AdminCustomers,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' }
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: AdminReports,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' }
  },
  {
    path: '/admin/coupons',
    name: 'AdminCoupons',
    component: AdminCoupons,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' }
  },
  {
    path: '/admin/reviews',
    name: 'AdminReviews',
    component: AdminReviews,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.initialized) {
    await authStore.initializeAuth()
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (to.matched.some((record) => record.meta.requiresAdmin) && !authStore.isAdmin) {
      next('/')
      return
    }
  }
  next()
})

export default router
