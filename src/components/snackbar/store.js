import Vuex from 'vuex'

const store = new Vuex.Store({
  state : {
    timeout: 6000,
    show: false,
    text: '',
    color: 'black',
    mode: 'multi-line',
    x: 'right',
    y: 'top',
    colorBtnClose : 'pink',
    defaultNotification: {
      timeout : 6000,
      show: false,
      text: '',
      color: 'black',
      mode: '',
      x: 'right',
      y: 'top',
      colorBtnClose: 'pink'
    },
  },
  mutations : {
    showNotification: function (state, newState) {
      Object.keys(state).forEach(key => {
        if (newState.hasOwnProperty(key)) {
          state[key] = newState[key]
        }
        else {
          if (state.defaultNotification.hasOwnProperty(key)) {
            state[key] = state.defaultNotification[key]
          }
        }
      });
    },
    setShow(state, newState) {
      state.show = newState
    }
  },
})

export default store