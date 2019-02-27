const state = {
  logged: false,
  phoneList: [],
  activeList: []
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

