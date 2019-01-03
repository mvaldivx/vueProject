import axios from 'axios'
import CatchResponse  from '@/util/catch-response.js'

class getIcons{
    static getIcons(){
        return axios.get('https://material.io/tools/icons/static/data.json').then(
            response =>{
                return response.data.categories
            }
        ).catch(e=> {
            CatchResponse.catchError(e)
        })
    }
}

export default getIcons
