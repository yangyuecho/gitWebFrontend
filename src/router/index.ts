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
      path: '/:path',
      name: 'repoContent',
      component: () => import('@/views/RepoContentView.vue')
    },
    {
      path: '/:path/tree/:filePath',
      name: 'repoTree',
      component: () => import('@/views/RepoContentView.vue')
    },
    {
      path: '/:path/commit',
      name: 'CommitList',
      component: () => import('@/views/CommitListView.vue')
    },
    {
      path: '/:path/deferred-metadata/:filePath',
      name: 'repoFileMeta',
      component: () => import('@/views/FileContentView.vue')
    },
    {
      path: '/:path/diff',
      name: 'commitDiff',
      component: () => import('@/views/DiffContentView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/UserView.vue')
    }
  ]
})

export default router
