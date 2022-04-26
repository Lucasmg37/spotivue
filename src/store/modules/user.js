import localStorageConstants from '../../constants/localStorage'

const state = () => ({
  accessTokenUser: "",
})

const getters = {
}

const actions = {
  userInit({ commit }) {
    const accessToken = localStorage.getItem(localStorageConstants.ACCESS_TOKEN)
    if (accessToken) {
      commit('setAccessTokenUser', accessToken)
    }
    return accessToken;
  },
}

// mutations
const mutations = {
  setAccessTokenUser(state, accessToken) {
    if (accessToken) {
      localStorage.setItem(localStorageConstants.ACCESS_TOKEN, accessToken)
    }
    state.accessTokenUser = accessToken
  },

  signOut(state) {
    localStorage.removeItem(localStorageConstants.ACCESS_TOKEN)
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