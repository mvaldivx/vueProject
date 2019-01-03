import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        Ciudades:[]
      },
      mutations:{
        setCiudades(state, newstate){
            state.Ciudades = newstate
        }
      }
})
export default store
