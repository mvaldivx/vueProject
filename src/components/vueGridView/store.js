import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    selectItems:[],
    estadoFiltro: false
  },
  mutations: {
    setSelectItems(state,newState){
      state.selectItems=newState
    },
    CambiarEstadoFiltros(state,newState){
      state.estadoFiltro  = newState
    }
  },

  actions: {
  }
})

export default store