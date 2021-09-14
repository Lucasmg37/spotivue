
const state = () => ({
  accessTokenUser: "",
})

const getters = {
}

const actions = {
  userInit({ commit }) {
    const accessToken = localStorage.getItem('@SPOTIVUE:at')
    commit('setAccessTokenUser', accessToken)
    return accessToken;
  },
}

// mutations
const mutations = {
  setAccessTokenUser(state, accessToken) {
    if (accessToken) {
      localStorage.setItem('@SPOTIVUE:at', accessToken)
    }
    state.accessTokenUser = accessToken
  },

  signOut(state) {
    localStorage.clear()
    state.accessTokenUser = null
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}