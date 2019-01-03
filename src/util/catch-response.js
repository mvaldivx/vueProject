import StoreNotification from '@/components/snackbar/store'

const funciones = {
  catchError: error => {
    let mensajeError = ''
    if (error.response){
      switch (error.response.status) {
        case 401:/**"Unauthorized" */
            if (error.response.statusText == 'Unauthorized')
              mensajeError = 'Sin autorización, sin permiso para realizar esta acción.'
            else
              mensajeError = error.response.statusText
          break;
        case 400:/**Bad Request */
            if (error.response.data.Message)
              mensajeError = error.response.data.Message
            else 
              mensajeError = error.response.data
          break;
        case 500:/**Internal Server Error */
          if (error.response.data.ExceptionMessage)
            mensajeError = "Error interno con el servidor, contacte al administrador. " + error.response.data.ExceptionMessage
          else
            mensajeError = "Error interno con el servidor, contacte al administrador. " + error.response.data.Message
          break;
        default:
            mensajeError = "Error. " + error.message
          break;
      } 
    }
    else if(error.message) {
      if(error.message === "Network Error")
        mensajeError = "Error al conectarse con el servidor"
      else
        mensajeError = error.message
    }
    StoreNotification.commit('showNotification', { show: true, text: mensajeError })
  }
}

export default funciones