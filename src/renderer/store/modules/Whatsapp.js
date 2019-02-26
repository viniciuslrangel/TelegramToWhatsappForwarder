const state = {
  logged: false,
  activeList: []
}

const mutations = {
  SET_LOGGED(state, logged) {
    state.logged = logged
  },
  SET_ACTIVE(state, activeList) {
    state.activeList = activeList
  }
}

const actions = {
  setLogged({ commit }, logged) {
    commit('SET_LOGGED', logged)
  },
  setActive({ commit }, activeList) {
    commit('SET_ACTIVE', activeList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

