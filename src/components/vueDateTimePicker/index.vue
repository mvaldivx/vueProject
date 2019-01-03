<template>
 <v-menu
    class="pa-0 ma-0"
    ref="menuDisplay"
    lazy
    :close-on-content-click="false"
    v-model="mShowPicker"
    transition="scale-transition"
    offset-y
    full-width
    :nudge-right="40"
    min-width="230px"
    :return-value.sync="mValue"
  >
    <v-text-field
      slot="activator"
      :label="Label"
      v-model="mValue"
      prepend-icon="event"
      readonly
      v-validate="'required'" 
      :data-vv-name="Label" 
      :error-messages="errors.collect(Label)"
    ></v-text-field>
    <v-date-picker 
      :min="cMinDate"
      :max="cMaxDate"
      v-model="mValue" 
      :allowed-dates="getAllowedDates"
      :event-color="'green'"
      :events="functionEvents"

      no-title 
      scrollable locale="es-es" actions>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="mShowPicker = false">Cancel</v-btn>
      <v-btn flat color="primary" @click="onChange(mValue)">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
  export default {
      props: {
          /** @description Nombre que se le dara al componente para ser buscado por el padre posteriomente */
          name : { type:String, default: "vueDateTimePicker" } , 

          /** @description Id del elemento */
          Id:  { type:Number, default: -1 },

          /** @description Titulo de la tabla */
          Label:  { type:String, default: "" },

          /** @description */
          Value: { type: Object, default: null },

          /** @description Dia minimo que el usuario puede seleccionar*/
          MinDate: { type: String, default: null },

          /** @description Dia maximo que el usuairo puede seleccionar */
          MaxDate: { type: String, default: null },

          /** @description Arreglo de dias habiles que puede selecionar el usuaio */
          allowedDates:{ type: Array , default: null }
      }, 
      computed:{
        cMinDate(){
          return this.mMinDate;
        },
        cMaxDate(){
          return this.mMaxDate;
        }
      },
      watch: {
        mValue: function (newVal , oldVal ) {
          if(newVal == null && oldVal != null ){
            this.mValue = oldVal;
            this.$refs.menuDisplay.save( this.mValue );
            this.$emit("onChange",this, this.mValue )
            return;
          }
          this.mValue = newVal;
          this.$refs.menuDisplay.save( this.mValue );
          this.$emit("onChange",this, this.mValue )
          return;    
        },
      }, 
      mounted () {
      },
      created(){
      },
      data () {
        return {
          /** @description Modelo que almacena el valor de la fecha */
          mShowPicker : false,
          mValue : this.Value,
          mMinDate : this.MinDate ,
          mMaxDate : this.MaxDate ,
          
          
        }
      },
      methods:{
        functionEvents (val) {
          var day = new Date( val );
         if(parseInt(val.split('-')[2],10)==this.allowedDates[0] || parseInt(val.split('-')[2],10)==this.allowedDates[1])
          {
            return true;
          }
          return false;
        },
        getAllowedDates( val ){
          
          var day = new Date( val );
          if(parseInt(val.split('-')[2],10)==this.allowedDates[0] || parseInt(val.split('-')[2],10)==this.allowedDates[1])
          {
            return true;
          }
          return false;          
          
        },
        getDate(){
          return this.mValue;
        },
        setMinDate( value ){
          this.mMinDate = value;
          this.$forceUpdate();
        },
        setMaxDate( value ){
          this.mMaxDate = value;
          this.$forceUpdate();
        },
        onChange( value ){
            this.mValue = value;
            this.$refs.menuDisplay.save( this.mValue );
            this.$emit("onChange",this, this.mValue )
        }
      }
    }
</script>
<style>
</style>