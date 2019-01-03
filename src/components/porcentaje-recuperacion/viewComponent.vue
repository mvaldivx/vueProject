<template>
    <v-layout row>
        <v-tooltip left lazy  class="algo">
            <v-btn slot="activator" 
                fab 
                fixed 
                dark 
                small 
                color="primary" 
                right 
                bottom 
                style="border-radius:50%; z-index:5"  
                @click="() => e31 || obtenerPorcentajeDeRecuperacion()" 
                @click.native="e31 = !e31"
            >
                <v-icon v-if="e31" dark>keyboard_arrow_down</v-icon>
                <v-icon v-else dark>pie_chart</v-icon>
            </v-btn>
            <span v-if="e31">Esconder barra de porcentajes</span>
            <span v-else>Ver mi porcentaje de recuperación</span>
        </v-tooltip>

        <v-bottom-nav 
            fixed
            :height="60" 
            :value="e31" 
            :active.sync="e3" 
            class="bottom-nav"
        >
            <v-btn class="white--text">{{datosRecuperacion.CantidadRecuperacion | toMXN}}</v-btn>
            <div>
                <v-progress-circular
                    v-bind:size="53"
                    v-bind:width="9"
                    v-bind:rotate="-90"
                    v-bind:value="progresscircular.value"
                    :color="colorProgress"
                >
                    {{ progresscircular.value }}%
                </v-progress-circular>
            </div>
            <v-btn><v-icon color="white">arrow_forward</v-icon></v-btn>
            <v-btn flat color="white">
                Meta: {{ datosRecuperacion.MetaRecuperacion | toMXN }}
            </v-btn>
        </v-bottom-nav>
    </v-layout>
</template>

<script>
import Store  from './store'
export default {
  name: 'porcentaje-recuperacion',
  data() {
        return {
            //permiso:false,
            progresscircular: {
                interval : {},
                value : 0
            },
            e3: 2,
            e31: false,
            colorProgress: 'white'
        }
  },
  methods:{
      obtenerPorcentajeDeRecuperacion(){
        Store.dispatch('getPorcentajeRecuperacion',{
            Agente : this.$store.state.user.empleado//'E046008'
        })
        .then((res) =>{
        })
        
      },
      actualizarBarraRecuperacion: function () {
          this.progresscircular = this.datosRecuperacion.PorcentajeRecuperacion
      }
  },
  computed: {
      datosRecuperacion : () =>{
          return Store.state.datosRecuperacion;
      }
  },
  watch:{
      datosRecuperacion(v){
            if (v.PorcentajeRecuperacion < 50)
                this.colorProgress = 'error'
            else if (v.PorcentajeRecuperacion <= 99 )
                this.colorProgress = 'warning'
            else
                this.colorProgress = 'success'

           this.progresscircular.value = parseInt(v.PorcentajeRecuperacion, 10)
      }
  },
  beforeDestroy(){
      clearInterval(this.progresscircular.interval)
  }
}
</script>

<style>
 .bottom-nav{
     background: rgb(38, 43, 54) !important;
 }
</style>


