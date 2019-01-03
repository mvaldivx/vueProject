import Vuex                 from 'vuex'
import RecuperacionAgente   from 'Api/telefonica/general/RecuperacionAgente'
import CatchResponse        from 'Util/catch-response.js'
import StoreProgressbar     from 'Components/progressbar/store'

const store = new Vuex.Store({
    state: {
        datosRecuperacion: {}
    },
    mutations: {
        setPorcentajeRecuperacion: function (state, newState) {
            state.datosRecuperacion = newState
        }
    },
    actions: {
        getPorcentajeRecuperacion: function ({ commit }, params) {
            StoreProgressbar.commit('showProgressbar', true)
            RecuperacionAgente.ObtenerRecuperacionAgente(params).then(response => {
                commit('setPorcentajeRecuperacion', response.data)
            })
            .catch(error => {
                CatchResponse.catchError(error)
            })
            .then(() => {
                StoreProgressbar.commit('showProgressbar', false)
            })
        }
    }
})
export default store