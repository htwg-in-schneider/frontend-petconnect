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
import AdminView from '@/views/AdminView.vue'
import AdminAusschreibungenView from '@/views/AdminAusschreibungenView.vue'
import AdminMeldungenView from '@/views/AdminMeldungenView.vue'
import ChatView from '@/views/ChatView.vue'
import MeineNachrichtenView from '@/views/MeineNachrichtenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0}
    
  },
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
      beforeEnter: authGuard
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
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      beforeEnter: authGuard
    },
    {
      path: '/admin/ausschreibungen',
      name: 'admin-ausschreibungen',
      component: AdminAusschreibungenView,
      beforeEnter: authGuard
    },
    {
      path: '/admin/meldungen',
      name: 'admin-meldungen',
      component: AdminMeldungenView,
      beforeEnter: authGuard
      },
    {
    path: '/chat/:userId/:ausschreibungId',
    name: 'chat',
    component: ChatView,
    beforeEnter: authGuard
    },
    {
      path: '/meine-nachrichten',
      name: 'meine-nachrichten',
      component: MeineNachrichtenView,
      beforeEnter: authGuard
    }
  ],
})

export default router
