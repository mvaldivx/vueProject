<template>
  <div id="app">
    <v-app id="inspire">
      <v-card>
        <v-card-title class="headline">
          Clima por ciudad
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="clima"
            :items="items"
            :loading="isloading"
            :search-input.sync="search"
            color="blue"
            hide-no-data
            hide-selected
            item-text="Description"
            item-value="Ciudad"
            label="Ciudad"
            placeholder="Ingrese ciudad"
            prepend-icon="wb_cloudy"
            return-object
            >
          </v-autocomplete>
        </v-card-text>
        <v-divider></v-divider>
        <v-expand-transition>
          <v-list v-if="clima">
            <v-list-tile
             v-for="(field, i) in fields"
             :key="i">
             <v-list-tile-content>
               <v-list-tile-title v-text="field.value"></v-list-tile-title>
               <v-list-tile-sub-title v-text="field.key"></v-list-tile-sub-title>
             </v-list-tile-content>
            </v-list-tile>
          </v-list>
          
        </v-expand-transition>
        <v-progress-linear v-if="isloadingInfo" :indeterminate="true"></v-progress-linear>
        <v-card-text v-if="infoTmp.tmp !=''">
          <v-flex class="infoClima">
            <div class="imgClima">
              <v-img :src="infoTmp.urlwsname" aspect-ratio="1" ></v-img>
            </div>
            <div class="infoCL">
              <H4>Temperatura: {{infoTmp.tmp}}</h4>
              <h4>Min: {{infoTmp.min}}</h4>
              <h4>Max: {{infoTmp.max}}</h4>
              <h4>Humedad: {{infoTmp.humedad}}</h4> 
            </div>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!--<v-btn
          :disabled="!clima"
          @click="ObtieneInfo()"
          >Obtener Info</v-btn>-->
        </v-card-actions>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import Store from '../views/store'
import StorePosts from '../api/reddit/Store.js'
import StoreW from '../api/Weather/Store.js'
import Weather from '../api/Weather/getWeather.js'

export default {
  name: 'Index',
  props: {
  },
  data(){
    return{
      isloading:false,
      isloadingInfo:false,
      clima:null,
      search:null,
      items:[],
      descriptionLimit:60,
      infoTmp:{tmp:'',min:'',max:'', humedad:''}
      }
  },
  computed:{
    cart:{
      get: function(){
        return Store.state.cart
      },
      set: function(newValue){
        Store.commit('setCart', newValue)
      }
    },
    msg:{
      get: function(){
        return Store.state.msg
      },
      set: function(newValue){
        Store.commit('setMsg', newValue)
      }
    },
    fields:{
      get: function(){
        return StoreW.state.Ciudades
      }
      
    }
  },methods:{
    posts(){
      StorePosts.dispatch('getPosts','') 
    },
    ObtieneInfo(){

      this.isloadingInfo = true
      let woeid = 0
      if (StoreW.state.Ciudades != undefined){
        StoreW.state.Ciudades.forEach(element =>{
        if (element.title === this.clima) woeid = element.woeid
      })
      if(woeid > 0){
        Weather.getWeatherInfo(woeid).then(res=>{
        this.infoTmp.tmp = Math.round(res.consolidated_weather[0].the_temp*100)/100 + '°C'
        this.infoTmp.min = Math.round(res.consolidated_weather[0].min_temp*100)/100 + '°C'
        this.infoTmp.max = Math.round(res.consolidated_weather[0].max_temp*100)/100 + '°C'
        this.infoTmp.humedad = Math.round(res.consolidated_weather[0].humidity*100)/100 + '%'
        this.infoTmp.urlwsname  = 'https://www.metaweather.com/static/img/weather/png/' + res.consolidated_weather[0].weather_state_abbr + '.png'
        }).finally(() => (this.isloadingInfo = false))
      }else{
        this.isloadingInfo = false
      }
      
      }
      
    }
  },
  watch:{
    search(val){
      if(val === ''){
        this.infoTmp={tmp:'',min:'',max:'', humedad:''}
        return
      } 

      if(this.isloading) return

      this.isloading = true

      Weather.getWetherLoc(val).then(
        res => {
          if(res != undefined){
           res.forEach(element => {
             this.items.push(element.title)
          }); 
          }
          
      }).finally(() =>(this.isloading = false))
    },
    items(){
      this.ObtieneInfo()
    }
  },
  beforeMount(){
    this.posts()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.imgClima{
  display:inline-block;
  width:25%;
  padding-right: 10px 0 0 5px;
}
.infoClima h4{
  display:inline-block;
  padding: 5px 10px 5px 10px
}
.infoCL{
  display:inline-block;
  width:65%;
}
</style>
