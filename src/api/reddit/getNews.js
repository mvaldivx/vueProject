import axios from 'axios'
import CatchResponse  from '@/util/catch-response.js'
import Store from './Store.js'
import storePrin from '../../views/store.js'

class getNews{
    static getNewsByDt(){
        return axios.get('http://www.reddit.com/r/subreddit/new.json?sort=new').then(
            response =>{
                if(Store.state.waiting === true){
                    let x = [];
                    let y = [];
                    x = response.data.data.children;
                    for(let i = 0; i < x.length;i++){
                        //alert(JSON.stringify(x[0]))
                        x[i].open = false
                        y.push(x[i])
                    }
                    Store.commit('setWaiting', false)
                    return {posts:y, num:y.length}
                }else{
                    return {posts:Store.state.posts, num:storePrin.state.msg}
                }
                
            
            }
        ).catch(e=> {
            CatchResponse.catchError(e)
        })
    }
}

export default getNews