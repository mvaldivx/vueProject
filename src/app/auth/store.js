import Vue      from 'vue'
import Vuex     from 'vuex'
import axios    from 'axios'
import config   from './config'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      user: null
    },

    mutations: {
      setUserSession: (state, user) => state.user = user
    },

    actions: {
        initUser:   ({commit}) => axios.get(config.URL_REQUEST_SESSION).then(({data}) => commit('setUserSession', data)),
        getLogin:   () => axios.get(config.URL_REQUEST_SESSION),
        getOrigin:  () => axios.get(config.URL_REQUEST_ORIGIN)
        .catch(err =>{
          alert(err)
        })        
    }
})

export default store