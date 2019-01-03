<template>
  <div id="app">
    <v-app id="inspire">
      <div class="text-xs-center">
       <v-expansion-panel>
            <v-expansion-panel-content v-for="(item) in post" :key="item.data.name">
              <div slot="header"  
                @click="readMsg(item.data.name)"
                avatar>
                <v-list-tile-avatar >
                  <v-icon v-if="item.open">drafts</v-icon>
                  <v-icon v-else>mail</v-icon>
                </v-list-tile-avatar>
                {{item.data.title}}
              </div>    
              <v-card-text class="bodyMsg">
                <v-text-field disabled label="De: " :value="item.data.author_fullname + '@' + item.data.domain"></v-text-field>
                Mensaje: <br>
                {{item.data.selftext}}
                <div  class="btnReply">
                  <v-btn @click.stop="Responder(item.data.author_fullname + '@' + item.data.domain)"  depressed small ><v-icon>reply</v-icon></v-btn>
                </div>
              </v-card-text>            
            </v-expansion-panel-content>
            <v-dialog v-model="dialog" max-width="600px">
                    
                  <v-card>
                    <v-card-title>
                      <span class="headline">Responder</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-md>
                          <div>
                            <v-text-field label="Para: " :value="to"></v-text-field>
                          </div>
                          <div>
                            <v-text-field label="Asunto: "></v-text-field>
                          </div>
                          <div>
                            <v-textarea label="Mensaje: "></v-textarea>
                          </div>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat @click="dialog = !dialog">Cancelar</v-btn>
                      <v-btn flat @click="dialog = !dialog">Enviar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
          </v-expansion-panel>

       <!-- <v-data-table
          :headers="headersTab"
          :items="post"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props" >
            <td>{{props.item.data.selftext}}</td>
            <td class="text-xs-right">{{props.item.data.author_fullname}}</td>
            <td class="text-xs-right">{{props.item.data.title}}</td>
            <td class="text-xs-right">{{props.item.data.subreddit_type}}</td>
          </template>
        </v-data-table>
        -->
      </div>
    </v-app>
  </div>
</template>

<script>
import configBuckets  from '@/api/TableroBucket/tableroBucket'
import CatchResponse  from '@/util/catch-response.js'
import StorePosts from '../../api/reddit/Store.js'
import storePrin from '../../views/store.js'

export default {
  name: 'Messages',
  props: {
  },
  data(){
    return{
      headersTab:[
        {text:'Text', value:'text'},
        {text:'Author', value:'Author'},
        {text:'Title', value:'Title'},
        {text:'Type', value:'Type'}
      ],
      items:[],
      dialog:false,
      to:''
    }
  },
  computed:{
    post:{
      get: function(){
        return StorePosts.state.posts
      },set: function(newValue){
        StorePosts.commit('setposts', newValue)
      }
    }
  },
  methods:{
     getFechaActual() {
      return configBuckets.ObtenerFechaActual().then(({ data }) => {
        alert(data)
        //commit('setFechaACtual', data)
         //return this.dispatch('getCalendario',{ejercicio:data.Periodo.Ejercicio})
      })
      .catch(error => {
       // return Store.state.calendario=[]
        CatchResponse.catchError(error)
      })
    },
    posts(){
      StorePosts.dispatch('getPosts','')
      this.items =  StorePosts.state.posts  
    },
    readMsg(itemName){
      let aux= []
      for(let i = 0; i < this.post.length;i++){
        aux.push(this.post[i])
        if(this.post[i].data.name === itemName && this.post[i].open === false){
          aux[i].open = true
          storePrin.commit('setMsg', storePrin.state.msg-=1)
        }
      }
      this.post = aux
    },
    Responder(to){
     this.dialog = !this.dialog
     this.to = to
    }
    
  },
  beforeMount(){
    this.posts()
  }
}
</script>

<style scoped>
.btnReply{
  padding-left:75%;
  display:block;
}
.bodyMsg{
  margin: 30px;
  width: 95%
}
.bodyMsg .v-text-field{
   width: 60%; 
  }
</style>
