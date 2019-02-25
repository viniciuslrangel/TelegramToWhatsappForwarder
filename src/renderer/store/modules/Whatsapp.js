const state = {
  logged: false,
  activeList: []
}

const mutations = {
  SET_LOGGED(state, logged) {
    state.logged = logged
  },
}

const actions = {
  setLogged({ commit }, logged) {
    commit('SET_LOGGED', logged)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

