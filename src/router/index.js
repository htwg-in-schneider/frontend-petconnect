import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AusschreibungenView from '../views/AusschreibungenView.vue'
import AusschreibungDetailView from '../views/AusschreibungDetailView.vue'

const router = createRouter({
  history: createWebHistory('/frontend-petconnect/'),

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

    {
      path: '/ausschreibung/:id',
      name: 'ausschreibung-detail',
      component: AusschreibungDetailView,
    },
  ],
})

export default router
