import 'babel-polyfill'
import 'url-search-params-polyfill'
import 'unorm'
import _                    from 'lodash'
import Vue         		    from 'vue'
import VueRouter   		    from 'vue-router'
import Vuetify     		    from 'vuetify'
import Vuex        		    from 'vuex'
import VTree 			    from 'vue-tree-halower'
import VeeValidate 		    from 'vee-validate'
import configValidator      from './validator/config'
import ServerMode		    from './server_mode'
import filters              from 'Util/filters'
import directives           from 'Util/directives'

//register vue plugins
Vue.use(VeeValidate, configValidator)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VTree)
Vue.use(VeeValidate)

//register filters
_.forEach(filters, (funcFilter, nameFilter) => Vue.filter(nameFilter, funcFilter))

//register directives
_.forEach(directives, (funcDirective, nameDirective) => Vue.directive(nameDirective, funcDirective))

const MODE = process.env.NODE_ENV

Vue.config.devtools = MODE === 'development'

export default {
    SERVER: ServerMode[MODE]
}