import Vue from 'vue'
import Vuex from 'vuex'
import getnews from './getNews.js'
import storePrin from '../../views/store.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        posts:[],
        waiting:true
      },
      mutations: {
        setposts(state, newState){
          state.posts = newState
        },
        setNews(state,newstate){
          state.news = newstate
        },
        setWaiting(state, newstate){
          state.waiting = newstate
        }
      },
      actions:{
        getPosts(params){
            return getnews.getNewsByDt(params).then(data=>{
              storePrin.commit('setMsg', data.num)
              this.commit('setposts',data.posts)
            })
        }
      }
})
export default store