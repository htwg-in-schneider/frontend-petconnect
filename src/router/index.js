import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AusschreibungenView from '../views/AusschreibungenView.vue'
import AusschreibungDetailView from '../views/AusschreibungDetailView.vue'
import CreateAusschreibungView from '../views/CreateAusschreibungView.vue'
import EditAusschreibungView from '../views/EditAusschreibungView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { authGuard } from '@auth0/auth0-vue'
import ImpressumView from '@/views/ImpressumView.vue' 
import DatenschutzView from '@/views/DatenschutzView.vue'
import MeineAusschreibungenView from '@/views/MeineAusschreibungenView.vue'

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

     {
      path: '/meine-ausschreibungen',
      name: 'meine-ausschreibungen',
      component: MeineAusschreibungenView,
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
    path: '/profile',
    name: 'profile',
    component: ProfileView
    },

    {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    beforeEnter: authGuard
  },
    {
      path: '/impressum',
      component: ImpressumView
    },

    {
      path: '/datenschutz',
      component: DatenschutzView
    }
  ],
})

export default router
