const state = {
  logged: false,
  phoneList: [],
  activeList: [],
  errList: []
}

const mutations = {
  SET_LOGGED(state, logged) {
    state.logged = logged
  },
  SET_ACTIVE(state, activeList) {
    state.activeList = activeList
  },
  SET_PHONE_LIST(state, phoneList) {
    state.phoneList = phoneList
  },
  SET_ERROR_USERS(state, errList) {
    state.errList = errList
  }
}

const actions = {
  setLogged({ commit }, logged) {
    commit('SET_LOGGED', logged)
  },
  setActive({ commit }, activeList) {
    commit('SET_ACTIVE', activeList)
  },
  setPhoneList({ commit }, phoneList) {
    commit('SET_PHONE_LIST', phoneList)
  },
  changeLastUserErrors({ commit }, errList) {
    commit('SET_ERROR_USERS', errList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

