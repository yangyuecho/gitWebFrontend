import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '@/views/Re.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/RepoListView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/UserView.vue')
    }
  ]
})

export default router
