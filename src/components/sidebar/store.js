import Vuex from 'vuex'

const store = new Vuex.Store({
    state: {
        drawer: true,
        menuItems: null,
        title:'',
        mini : true,
        usuario : {},
        styles: {
            mini: {
                width: '80px'
            },
            full: {
                width: '300px'
            }
        }
    },

    mutations: {
        toogleDrawer: function(state) {
            state.drawer = !state.drawer
        },

        setDrawer: (state, newDrawer) => state.drawer = newDrawer,

        setMenuItems: function(state, menuItems) {
        	state.menuItems = menuItems
        },

        setPageTitle: function(state, newState){
            state.title = newState
        },

        showMiniSidebar: function(state, newState){
            state.mini = newState
        },

        setUsuario: function(state, newState) {
            state.usuario = newState
        }
    },

    actions: {
    	getMenuItems: function({commit}) {
            //return menu items
    	}
    }
});

export default store