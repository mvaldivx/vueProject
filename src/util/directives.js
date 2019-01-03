import _                from 'lodash'
import PerfectScrollbar from 'perfect-scrollbar'
import authStore        from '../app/auth/store'

const directives = {
  'fancy-scroll': {
    inserted: (el, binding, {context}) => {
      let applys = [{
        el: el,
        config: _.has(binding.value, 'config') ? binding.value.config : {}
      }]

      if(_.has(binding.value, 'apply'))
        applys = _.map(binding.value.apply, apply => ({
          el: el.querySelector(apply.el),
          config: apply.config || {}
        }))

      context.__fancyScrolls = _.map(applys, child => {
        child.el.style.overflow = 'hidden'
        return new PerfectScrollbar(child.el, child.config)
      })

      context.__updateScrolls = function() {
        _.has(this, '__fancyScrolls') &&
        _.forEach(this.__fancyScrolls, fs => fs.update())
      }
    }
  },

  'auth': {
    bind: (el, binding, vnode) => {
      const indexOnParent = _.indexOf(el.parentNode.childNodes, el)
      const parentNode    = el.parentNode
      let permisos = binding.value.permissions
      let acciones = []
      if (authStore.state.user) {
         acciones = authStore.state.user.acciones
      }
      
      acciones = acciones.filter((accion)=>{
        return permisos.indexOf(accion.nombre) != -1
      })

      el.remove()
      if (acciones.length >= 1){
        if (indexOnParent === parentNode.childNodes.length - 1)
          parentNode.appendChild(el)
        else
          parentNode.insertBefore(el, parentNode.childNodes[indexOnParent])
      }
    }
  }
}

export default directives