import Vue                    from 'vue'
import DataTable              from './data-table/viewComponent'
import FileInput              from './file-input/viewComponent'
import Progressbar            from './progressbar/viewComponent'
import Sidebar                from './sidebar/viewComponent'
import Snackbar               from './snackbar/viewComponent'
import Toolbar                from './toolbar/viewComponent'
import VueGraphics            from './vueGraphics/viewComponent'
import VueGridview            from './vueGridView/viewComponent'
import VuePalleteGenerator    from './vuePaletteGenerator/viewComponent'

/**
 * Registry as global components
 */
Vue.component(DataTable.name,           DataTable)
Vue.component(FileInput.name,           FileInput)
Vue.component(Progressbar.name,         Progressbar)
Vue.component(Sidebar.name,             Sidebar)
Vue.component(Snackbar.name,            Snackbar)
Vue.component(Toolbar.name,             Toolbar)
Vue.component(VueGraphics.name,         VueGraphics)
Vue.component(VueGridview.name,         VueGridview)
Vue.component(VuePalleteGenerator.name, VuePalleteGenerator)