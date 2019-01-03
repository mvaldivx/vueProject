import claim from '../claim'

class configBuckets{
    static ObtenerFechaActual(params){
        return claim.get('TableroBucket','Obtenerfecha',params)
    }
}

export default configBuckets