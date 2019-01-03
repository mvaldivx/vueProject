import _                from 'lodash'
import axios            from 'axios'
import Bluebird         from 'bluebird'

let configAxios = {
    'FORM': {
        'headers': { 'Content-Type': 'application/x-www-form-urlencoded'}
    },
    'BLOB': {
        'responseType': 'blob' 
    },
    'JSON': {
        'headers': { 'Content-Type': 'application/json;charset=utf-8'}
    },
    'FORMDATA' : {
        'headers': { 'Content-Type': 'multipart/form-data'}
    }
}

const VERBS_HTTP = 'put post get delete'
    .split(' ')

const encodeFuncs = {
    urlSearch: params => {
        let newParams = new URLSearchParams()
        for (var key in params)
            newParams.append(key, params[key])
        return newParams
    },

    getByUrl: params => ({
        'params': params
    }),

    formData: params => {
        let formData = new FormData()
        _.forEach(params, (value, key) => formData.append(key, value))
        return formData
    },
    raw: params => params
}

const factoryClaim = (method, storeAuth, SERVER) => {
    let defaultEncodeFunc = _.includes('get delete'.split(' '), method) ? encodeFuncs.getByUrl : encodeFuncs.urlSearch
    return (controller, action, data, config = configAxios.FORM, encodeFunc = defaultEncodeFunc) => {
        axios.defaults.headers.common['Authorization'] = storeAuth.state.user.token
        return Bluebird.resolve(axios[ method ](`${SERVER}/${controller}/${action}`, encodeFunc(data), config))       
    }
}

const createClientClaim = (storeAuth, SERVER) => {
  let claim = {}
  VERBS_HTTP.forEach(verb => claim[verb] = factoryClaim(verb, storeAuth, SERVER))
  claim['config'] = configAxios
  claim['encode'] = encodeFuncs
  return claim
}

export default {
  createClientClaim
}