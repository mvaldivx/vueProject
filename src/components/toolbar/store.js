import Vuex from 'vuex'

const store = new Vuex.Store({
	state: {
		title: '',
		icon : ''
	},

	mutations: {
		setTitle: (state, newTitle) => state.title = newTitle,
		setIcon : (state, newIcon) => state.icon = newIcon
	}
})

export default store