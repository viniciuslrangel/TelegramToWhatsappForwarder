import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState({
      storageName: 'TelegramToWhatsappForwarder',
      whitelist: [
        'Telegram/UPDATE_PHONE',
        'Telegram/SET_ACTIVE_PHONES',
        'Whatsapp/SET_ACTIVE'
      ]
    }),
    createSharedMutations(),
  ],
  strict: process.env.NODE_ENV !== 'production',
})
