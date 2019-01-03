import axios from 'axios'
import CatchResponse  from '@/util/catch-response.js'
import store from './Store.js'

class getWeather{
    static getWetherLoc(loc){
        return axios.get('https://www.metaweather.com/api/location/search/?query=' + loc).then(
            response=>{
                store.commit('setCiudades', response.data)
                return response.data
            }
    ).catch(e=>{
        CatchResponse.catchError(e)
    })
    }
    static getWeatherInfo(woeid){
        return axios.get('https://www.metaweather.com/api/location/' + woeid).then(response=>{
            return response.data
        }).catch(e=>{
            CatchResponse.catchError(e)
        })
    }
}
export default getWeather