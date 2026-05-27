import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AusschreibungenView from '../views/AusschreibungenView.vue'
import AusschreibungDetailView from '../views/AusschreibungDetailView.vue'
import CreateAusschreibungView from '../views/CreateAusschreibungView.vue'
import EditAusschreibungView from '../views/EditAusschreibungView.vue'
import RegistrierenView from '@/views/RegistrierenView.vue'

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

    {
      path: '/ausschreibung/create',
      name: 'ausschreibung-create',
      component: CreateAusschreibungView,
    },

    {
      path: '/ausschreibung/edit/:id',
      name: 'ausschreibung-edit',
      component: EditAusschreibungView,
    },
    {
      path: '/registrieren',
      name: 'registrieren',
      component: RegistrierenView
    },
  ],
})

export default router
