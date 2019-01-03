import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    progressbar: false,
  },

  mutations: {
    showProgressbar: function (state, newState) {
      state.progressbar = newState
    },
  },
});

export default store