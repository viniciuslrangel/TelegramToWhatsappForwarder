// import { ipcRenderer } from 'electron' // eslint-disable-line

import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VuetheMask from 'vue-the-mask'

import App from './App'
import router, { setupRouterManager } from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(Element)
Vue.use(VuetheMask)
router.replace({ name: 'loading' })

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  created() {
    setupRouterManager.bind(this)()
    // ipcRenderer.send('READY')
  }
}).$mount('#app')
