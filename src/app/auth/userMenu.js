import store from './store'

const findValPropInMenu = (prop, val, menu) => {
  for(let i = 0, l = menu.length; i < l; i++) {
    let findIt = false
    if(menu[i].items)
      findIt = findValPropInMenu(prop, val, menu[i].items)
    else if(menu[i][prop] === val)
      return menu[i]
    if(findIt)
        return findIt
  }
}

const getActions = () => store.state.user ? store.state.user.acciones : []

const itemHasPermission = (itemMenu) => !_.isUndefined(getItemPermission(itemMenu))

const getItemPermission = (itemMenu) => _.find(getActions(),
                                               accion => !_.has(itemMenu, 'permission') ||
                                               accion.nombre === itemMenu.permission)
export default {
  findValPropInMenu,
  itemHasPermission,
  getItemPermission
}