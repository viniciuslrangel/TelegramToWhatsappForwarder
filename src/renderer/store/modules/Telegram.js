import { ipcRenderer } from 'electron' // eslint-disable-line
import { STATUS } from '../../../main/telegram'

const state = {
  phone: null,
  state: STATUS.NONE
}

const mutations = {
  UPDATE_PHONE(state, phone) {
    state.phone = phone
  },
  UPDATE_STATE(state, phoneState) {
    state.state = phoneState
  }
}

const actions = {
  registerPhone({ commit }, { phone }) {
    commit('UPDATE_PHONE', phone)
    ipcRenderer.emit('CREATE_CLIENT')
  },
  updateState({ commit }, { state }) {
    commit('UPDATE_STATE', state)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

