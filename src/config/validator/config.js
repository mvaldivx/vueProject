import _                 from 'lodash'
import {Validator}       from 'vee-validate'
import messagesEs        from './es'
import customValidations from './custom'

Validator.localize('es', messagesEs);

// import each custom validation
_.forEach(customValidations,
             (func_validation, name_validation) => Validator.extend(name_validation, func_validation))

const config = {
    errorBagName: 'errors', // change if property conflicts
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'es',
    dictionary: null,
    strict: true,
    classes: false,
    classNames: {
        touched: 'touched', // the control has been blurred
        untouched: 'untouched', // the control hasn't been blurred
        valid: 'valid', // model is valid
        invalid: 'invalid', // model is invalid
        pristine: 'pristine', // control has not been interacted with
        dirty: 'dirty' // control has been interacted with
    },
    events: 'blur|input',
    inject: true,
    validity: false,
    aria: true,
    i18n: null, // the vue-i18n plugin instance,
    i18nRootKey: 'validations' // the nested key under which the validation messsages will be located
};

export default config