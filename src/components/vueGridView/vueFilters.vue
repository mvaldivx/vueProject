<template>
    <div class="block">        
        <span v-if="seleccionable"></span>
        <span v-else-if="type=='input'">
            <input             
            v-if="!seleccionable"
            v-model="txtSearch"
            style="border-bottom: 1px solid black  !important;" 
            class="mb-3" placeholder="Buscar" type="text"/>    
            <v-icon style="font-size: 12px;">filter_list</v-icon>
        </span>        
        
        <v-menu            
            v-if="type!='input'"
            :close-on-content-click="false"            
            v-model="drawer">
            <v-btn style="margin:0px;" small flat icon dense dark color="black" slot="activator">
                <v-icon style="font-size: 12px;">filter_list</v-icon>
            </v-btn>
            <v-card class="pa-1">
                <div>
                    <v-btn small flat icon dense dark color="black" @click.native="drawer=!drawer">
                        <v-icon style="font-size: 12px;">filter_list</v-icon>
                    </v-btn>
                </div>
                <div v-if="seleccionable"> 
                    <div>
                        <input 
                        v-model="txtSearch"
                        style="border-bottom: 1px solid black  !important;" 
                        class="mb-3" placeholder="Buscar" type="text"/>
                        <ul>                        
                            <li>
                                <label v-if="type=='checkbox'">
                                    <input ref="selectAll" type="checkbox"  v-model="selectAll"/>
                                    (Seleccionar Todos)
                                </label>
                                <label v-else>
                                    <input  type="radio" v-model="selectItems" :value="null" />
                                    Sin filtros
                                </label>
                            </li>
                        </ul>
                    </div>                    
                    <div style="height:100px; overflow:auto;">
                        <ul>
                            <li v-for="(item,key) in searchItems" :key="item.id">
                                <label :data-id="key">                            
                                    <input v-if="type=='checkbox'" type="checkbox" v-model="selectItems" :value="item"/>
                                    <input v-else type="radio" v-model="selectItems" :value="item"/>
                                    {{ ((itemText == null )?item:item[ itemText ]) }}                            
                                </label>
                            </li>
                        </ul>
                    </div>  
                </div>        
                <div v-if="type=='numero'">                   
                    <v-select
                        v-bind:items="filters"
                        v-model="filter"
                        label="Tipo de filtro"
                        single-line bottom></v-select>
                    <div>
                        <input 
                        placeholder="Filtro..."
                        class="mb-2"
                        style="border-bottom: 1px solid black  !important; display:block;"  v-model="rangoInicial"/>
                        
                        <input
                        v-if="filter=='Rango'" 
                        class="mb-2"
                        placeholder="Filtro..."
                        style="border-bottom: 1px solid black  !important;" v-model="rangoFinal"/>
                    </div>
                    <button @click="limpiar()">Limpiar</button>
                </div>
            </v-card>
        </v-menu>                
    </div>
</template>
<script>


export default {
    props:{
        /** @description  nombre del filtro o columna*/
        name : {
            type:String,
            default:null
        },

        itemText:{
            type:String,
            default:null
        },
        items:{
            type:Array,
            default:[]
        },
        /**@description input, checkbox,radio, numero() */
        type:{
            type:String,
            default:"input"
        }
    },
    created()
    {
        if(this.type =="checkbox" ||  this.type == "radio")
        {
            this.selectAll = true
            this.selectItems = this.items
        }

      },
      destroyed()
      {

      },
    data(){
        return {
            rangoInicial:null,
            rangoFinal:null,
            txtSearch:"",
            selectAll:true,            
            drawer:false,
            filter:null,
            selectItems:this.items,
            filters:['Igual','Diferente','Menor','Menor o igual','Mayor','Mayor Igual','Rango']
        }
    },
    computed:{
        searchItems(){
            if(this.txtSearch!="")
                return this.items.filter(word =>                     
                    String(word.text).indexOf(this.txtSearch) != -1
                );
            return this.items
        },
        seleccionable(){
            return this.type=="checkbox" || this.type=="radio";
        },
        selectItemsLenght(){
            this.selectItems.length
        },
    },
    methods:{
        
        /**@description Limpiamos las variables de filtro */
        limpiar(){
            this.filter="Igual"
            this.rangoInicial=null
            this.rangoFinal=null
            
        }
    },
    watch:{
        selectAll(value){
            if(value){
                this.selectItems=this.items;            
            }else{
                this.selectItems=[];
            }
            this.$emit("onChange", this ,  this.name, 2 , this.selectItems  ,"in")
        },
        txtSearch(value){
            this.$emit("onChange",this, this.name , 1,[value],"like")
        },
        selectItems(value){
            if(this.selectItems.length>0 && this.selectItems.length!=this.items.length)
                this.$refs.selectAll.indeterminate=true;            
            else{
                this.$refs.selectAll.indeterminate=false;
                this.selectAll=(this.selectItems.length==this.items.length);
            }
                
            this.$emit("onChange", this ,  this.name, 2 , this.selectItems  ,"in");
        },

        filter(value){            
            this.$emit("onChange",this ,  this.name,4,[parseFloat(this.rangoInicial),parseFloat(this.rangoFinal)],this.filter)
        },
        rangoInicial(value){
            this.$emit("onChange",this ,  this.name,4,[parseFloat(this.rangoInicial),parseFloat(this.rangoFinal)],this.filter)
        },
        rangoFinal(value){
            this.$emit("onChange",this ,  this.name,4,[parseFloat(this.rangoInicial),parseFloat(this.rangoFinal)],this.filter)
        },
    }    
}
</script>
