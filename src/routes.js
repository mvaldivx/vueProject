import HelloWorld from './components/HelloWorld.vue'
import Messages from './pages/Messages/viewcomponent.vue'
import Home from './views/Home.vue'

const routes = [
    { path: '/component', component: HelloWorld },
    { path: '/pages/Messages', component: Messages },
    { path: '/views', component: Home }
]

export default routes