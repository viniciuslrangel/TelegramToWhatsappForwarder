import Vue from 'vue'
import Router from 'vue-router'

import { STATUS } from '../../main/telegram'

Vue.use(Router)

const routes = new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
    },
    {
      path: '/loading',
      name: 'loading',
      component: require('@/components/Loading').default
    },
    {
      path: '/signin/telegram',
      name: 'signin-telegram',
      component: require('@/components/LoginTelegram').default
    },
    {
      path: '/error/telegram',
      name: 'error-telegram',
      component: require('@/components/Error').default
    },
    {
      path: '*',
      redirect: '/',
    },
  ]
})

routes.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`Going from ${from.fullPath} to ${to.fullPath}`)
  }
  next()
})

export default routes

export function setupRouterManager() {
  this.$store.subscribe((mutation) => {
    if (mutation.type === 'Telegram/UPDATE_STATE') {
      let r
      switch (mutation.payload) {
        case STATUS.WAITING_LOGIN:
        case STATUS.WAITING_CODE:
          r = 'signin-telegram'
          break
        case STATUS.ERROR:
          r = 'error-telegram'
          break
        default:
          r = 'loading'
      }
      this.$router.replace({ name: r })
    }
  })
}

