import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cart:0,
    msg:0,
    menu:null
  },
  mutations: {
    setCart(state, newState){
      state.cart = newState
    },
    setMsg(state, newState){
      state.msg = newState
    },
    setMenu(state, newstate){
      state.menu = newstate
    }
  },
  actions: {

  }
})
export default store