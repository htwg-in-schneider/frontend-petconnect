import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AusschreibungenView from '../views/AusschreibungenView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/ausschreibungen',
      name: 'ausschreibungen',
      component: AusschreibungenView,
    },
  ],
})

export default router
