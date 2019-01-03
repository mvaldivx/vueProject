<template>
    <div id="app">
        <v-app id="inspire">
            <div>
                <v-card-title >
                    <v-spacer></v-spacer>
                    <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details>
                    </v-text-field>
                    </v-card-title>
                <v-card class="cardIcons" v-for="(item, i) in headersIcons" :key="i">
                    <v-card-title >
                        Material design Icons: {{item}}
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-data-table
                     :headers="headersTab"
                     :items="iconos[i]"
                     :search="search"
                    >
                        <template slot="items" slot-scope="props">
                            <td>{{props.item.id}}</td>
                            <td><v-icon>{{props.item.id}}</v-icon></td>
                        </template>
                        <v-alert slot="no-results" :value ="true" color="error" icon="warning">
                            Sin resultados
                        </v-alert>
                    </v-data-table>
                </v-card>
            </div>
        </v-app>
    </div>
</template>

<script>
import getIcons from '@/api/MaterialIcons/getIcons.js'

export default {
    data(){
        return{
            search:'',
            headersTab:[
                {text:'Nombre', align: 'left', value:'id'},
                {text:'Icono', align: 'left', value:'icono'}],
            iconos:[],
            headersIcons:[]
        }
    },
    computed:{

    },
    methods:{
        getIcons(){
            getIcons.getIcons().then(res =>{
                for(let i = 0; i < res.length; i++){
                    this.headersIcons.push(res[i].name)
                    this.iconos.push(res[i].icons)
                }
            })
        }
    },
    beforeMount(){
        this.getIcons();
    }
}

</script>

<style>
.cardIcons{
    width:32%;
    display:inline-block !important;
    margin:5px;
}
.cardIcons .v-table__overflow{
overflow-x: hidden !important;
}
</style>
