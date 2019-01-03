import _                    from 'lodash'
import regexps              from 'Util/regexps'

const telsPermit = [8, 10]

const customValidations = {
    'cp_valid': {
        getMessage: () => 'El codigo postal es invalido',
        validate: () => true
    },
    'cliente': {
    	getMessage: () => 'La clave de cliente es invalida',
        validate: val => regexps.cuentaCliente.test(val)
    },
    'integer': {
        getMessage: () => 'El campo debe ser numérico',
        validate: val => regexps.onlyIntegerWithNegatives.test(val)
    },
    'telefono': {
        getMessage: field => `El campo ${field} solo permite teléfonos de ${_.join(telsPermit, ' o ')} dígitos`,
        validate: val => _.indexOf(telsPermit, val.length) !== -1
    }
}

export default customValidations