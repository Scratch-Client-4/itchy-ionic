import {
  createRouter,
  createWebHistory
} from '@ionic/vue-router';
import Tabs from '../views/Tabs.vue'

const routes = [{
    path: '/',
    redirect: '/tabs/explore'
  },
  {
    path: '/user/:name',
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [{
        path: '',
        redirect: '/tabs/explore'
      },
      {
        path: 'explore',
        component: () => import('@/views/ExplorePage.vue')
      },
      {
        path: 'search',
        component: () => import('@/views/SearchPage.vue')
      },
      {
        path: 'messages',
        component: () => import('@/views/MessagesPage.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/SettingsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router