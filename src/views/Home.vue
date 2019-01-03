<template>
  <div class="hide-overflow home" style="position:relative;">
    <v-card
      color="grey lighten-4"
      flat
      height="50px"
      tile
      >
      <v-toolbar 
      absolute
      scroll-off-screen
      scroll-target="#scrolling-techniques">
        <v-toolbar-side-icon @click.stop= "menu = !menu">
         <v-icon large color="grey">list</v-icon></v-toolbar-side-icon>
        <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-badge left class="cartS">
            <span slot="badge" v-if="getcart > 0">{{getcart}}</span>
            <v-icon
              large
              color="grey lighten-1"
            >
              shopping_cart
            </v-icon>
          </v-badge>
          <v-badge color="indigo lighten-1" class="msgS">
            <span slot="badge" v-if=" getmsg > 0">{{getmsg}}</span>
            <v-icon
              large
              color="grey"
              @click="goPage('Messages')"
            >
              mail
            </v-icon>
          </v-badge>
        </v-toolbar-items>
      </v-toolbar>
      
    </v-card>
     <v-navigation-drawer
        v-model="menu"
        temporaly
        absolute
      >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <v-icon>person</v-icon>
              </v-list-tile-avatar>
  
              <v-list-tile-content>
                <v-list-tile-title>Usuario</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>
  
        <v-list class="pt-0" dense>
          <v-divider></v-divider>
  
          <v-list-tile
            v-for="item in items"
            :key="item.title"
            @click="goPage(item.component)" 
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
  
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        </v-navigation-drawer>
        <div
        id="scrolling-techniques"
        class="scroll-y"
        style="max-height: 600px;">
        <v-content style="padding: 64px 0px 32px 300px;">
          <div class="v-content__wrapp">
            <div class="container fluid">
            <div class="layout align-center justify-center">
              <div class="flex xs10">
                <snackbar></snackbar>
                <component v-bind:is="currentPage"/>
              </div>
            </div>
          </div>
          </div>
        </v-content>
        </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Messages from '@/pages/Messages/viewComponent.vue'
import Iconos from '@/pages/Iconos/viewComponent.vue'
import Store from './store'
import StorePosts from '../api/reddit/Store.js'
import snackbar from '@/components/snackbar/viewComponent.vue'

export default {
  name: 'home',
  components: {
    HelloWorld,
    Messages,
    Iconos,
    snackbar
  },
  data(){
    return{
      currentPage:HelloWorld,
      items:[
        {id:0,icon:'home', title:'Home', component:HelloWorld},
        {id:1,icon:'mail', title:'Mail', component:Messages},
        {id:2,icon:'sentiment_satisfied_alt', title:'Iconos', component:Iconos}]
    }
  },
  props:{
    cart: {
      type: Number,
      default: 0
    },
    msg:{
      type: Number,
      default: 0
    }
  },
  methods:{
    goPage(page){
      this.currentPage = page
    },
    
  },
  computed:{
    menu:{
      get: function(){
        return Store.state.menu
      },
      set: function(newValue){
        Store.commit('setMenu', newValue)
      }
    },
    getcart(){
      return Store.state.cart
    },
    getmsg(){
      return Store.state.msg
    },
    post:{
      get: function(){
        StorePosts.dispatch('getPosts','')
       return StorePosts.state.posts.length  
      },set: function(newValue){
        StorePosts.commit('setposts', newValue)
      }
    }
  }
}
</script>
<style scoped>
.cartS, .msgS{
  top:12px;
}

</style>
