import { STATUS } from '../../../main/telegram'

const state = {
  phone: null,
  state: STATUS.NONE,
  additional: null,
  phoneList: [],
  activeList: [],
  enableAll: false
}

const mutations = {
  UPDATE_PHONE(state, phone) {
    state.phone = phone
  },
  UPDATE_STATE(state, { phoneState, payload }) {
    state.state = phoneState
    state.additional = payload
  },
  CLEAR_ADDITIONAL(state) {
    state.additional = null
  },
  SET_PHONE_LIST(state, phoneList) {
    state.phoneList = phoneList
  },
  SET_ACTIVE_PHONES(state, activeList) {
    if (activeList === true) {
      state.enableAll = true
    } else if (activeList === false) {
      state.enableAll = false
    } else {
      state.activeList = activeList
    }
  }
}

const actions = {
  registerPhone({ commit }, { phone }) {
    commit('UPDATE_PHONE', phone)
  },
  updateState({ commit }, { state, payload }) {
    commit('UPDATE_STATE', { phoneState: state, payload })
  },
  clearAdditional({ commit }) {
    commit('CLEAR_ADDITIONAL')
  },
  setPhoneList({ commit }, phoneList) {
    commit('SET_PHONE_LIST', phoneList)
  },
  setActivePhones({ commit }, activeList) {
    commit('SET_ACTIVE_PHONES', activeList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

