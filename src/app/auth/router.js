import storeToolbar   from 'Components/toolbar/store'
import menu 			    from 'User/menu'
import store          from './store'
import userMenu       from './userMenu'

const exit_paths = '/home /logout'
                   .split(' ')

const redirectoToPath = (path, {completeURLAPP}) => window.location = `${completeURLAPP}/#${path}`

export default {
  activePermissionsInRoutes: (to, from, next) => {
    if(_.includes(exit_paths, to.path))
      store.dispatch('getOrigin')
      .then(({data}) => redirectoToPath(to.path, data))
      .catch(error => console.log(error))
    else
      store.dispatch('initUser')
        .then(() => {
          if(store.state.user) {
            const itemMenu = userMenu.findValPropInMenu('path', to.path, menu)
            storeToolbar.commit('setTitle', itemMenu ? itemMenu.title : '')
            storeToolbar.commit('setIcon', itemMenu ? itemMenu.icon : '')
            next(userMenu.itemHasPermission(itemMenu) || to.path == "/")
          }
        })
      .catch(error => store.dispatch('getOrigin').then(({data}) => redirectoToPath('/kiosko', data))
      .catch(error => console.log(error)))
  }
}