<template>
  <fullscreen ref="fullscreen" :fullscreen.sync="fullscreen">
    <v-card 
      :style="fullscreen ? 'height: 100vh !important;' : ''"
      class="elevation-10"
      >
      <v-card-title class="pa-0 ma-0 elevation-15">
        <v-spacer></v-spacer>
        <v-flex lg3 md4 sm6 xs12 v-if="!fullscreen && enableSearch">
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-flex>
        <v-tooltip top>
          <v-btn
            v-if="enableFullscreen"
            :title="fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'"
            style="border-radius:20%;" 
            icon
            :fixed="fullscreen ? true : false"
            @click="toggleFullscreen" 
            slot="activator"
          >
            <v-icon v-if="!fullscreen" dark style="font-size:30px">fullscreen</v-icon>
            <v-icon v-else dark style="font-size:30px">fullscreen_exit</v-icon>
          </v-btn>
          <span>Pantalla completa</span>
        </v-tooltip>
        <v-tooltip top>
          <v-menu 
            v-if="!fullscreen && enableControlsConfig"
            absolute 
            min-width="200"
            :close-on-content-click="false"
            slot="activator"
          >
            <v-btn slot="activator" icon>
              <v-icon>tune</v-icon>
            </v-btn>
            <v-card>
              <v-card-text>
                <p class="subheading">Ajustar altura de tabla</p>
                <v-slider v-model="height" thumb-label step="2" ticks min="30" max="100"></v-slider>
              </v-card-text>
            </v-card>
          </v-menu>
          <span>Ajustes de tabla</span>
        </v-tooltip>
        <slot name="toolbar" v-if="!fullscreen"></slot>
      </v-card-title>
      <v-data-table
        :headers="headersFormat"
        :items="items"
        :class="`component-data-table elevation-18`"
        ref="componentDataTable"
        :must-sort="true"
        :pagination.sync="pagination"
        :item-key="itemKey"
        no-data-text="Sin datos disponibles"
        rows-per-page-text="Registros por página:"
        :rows-per-page-items="rowsPerPageItems"
        :style="fullscreen ? 'height: 100vh !important;' : ''"
        :hide-actions=" fullscreen ? true : false"
        :search="search"
        @update:pagination="updatePagination($event)"
      >
        <template slot="headers" slot-scope="props">
          <slot name="headers" v-bind="props">
            <tr>
              <th
                v-for="(header, key, index) in props.headers"
                :key="index"
                :class="['column sortable blue-grey lighten-4', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                <div>
                  {{ header.text}}
                  <v-icon small v-if="pagination.sortBy === header.value">arrow_upward</v-icon>
                </div>
              </th>
            </tr>
          </slot>
        </template>
        
        <template slot="items" slot-scope="props">
          <slot name="items" v-bind="props">
            <tr> 
              <td 
                v-for="(val, key, index) in props.item" 
                :key="index"
                class="text-xs-right grey lighten-2"
              > 
                {{ val }} 
              </td>
            </tr>
          </slot>
        </template>
        <template slot="footer">
          <slot name="footer"></slot>
        </template>
        <template slot="pageText" slot-scope="props">
          {{ props.pageStart }}-{{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card>
  </fullscreen>
</template>

<script>
import _                from 'lodash'
import Fullscreen       from 'vue-fullscreen/src/component.vue'
import PerfectScroll    from 'perfect-scrollbar'

export default {
  name: 'data-table',
  components : {Fullscreen},
  props : {
    /**Objeto con propiedades de sortBy y descending en caso de que se sobre escriba el slot de headers*/
    customPagination :{
      type : Object,
      default: () => {}
    },
    itemKey : {
      type : String,
      default : 'Id'
    },
    /**Arreglo de items */
    items : {
      type : Array,
      default :()=>[]
    },
    /**En caso de que no se reciban los headers se agregarán automáticamente con el nombre de las propiedades del primer item */
    headers : {
      type :Array,
      default :() =>[]
    },
    /**Array para selector de registros por página*/
    rowsPerPageItems : {
      type: Array,
      default : () => [5,10,20,50,100,{"text":"Todos","value":-1}]
    },
    /**Altura que tendrá la tabla en medidas vh para adaptar a pantalla*/
    height : {
      type:Number,
      default:83
    },
    /**Boleano para habilitar botón para pantalla completa */
    enableFullscreen:{
      type: Boolean,
      default :false
    },
    /**Boleano para habilitar control para  configuración de tabla (por el momento solo modificar altura)*/
    enableControlsConfig : {
      type:Boolean,
      default : false
    },
    /**Boleano para habilitar control para  configuración de tabla (por el momento solo modificar altura)*/
    enableSearch : {
      type:Boolean,
      default : false
    }
  },
  data(){ 
    return {
      pagination: {},
      selected: [],
      fullscreen : false,
      showMenu : false,
      x: 0,
      y: 0,
      psBody : null,
      psDivTable : null,
      arrayTds :  [],
      search : ''
    }
  },
  updated(){
    let componentTable = this.$refs.componentDataTable.$el
    componentTable.style.height = this.height + 'vh'
    let componentTableBody = this.$refs.componentDataTable.$el.querySelector('.table__overflow > table > tbody')
    componentTableBody.style.height = (this.height - 18) + 'vh'
    this.psDivTable.update()
    this.psBody.update()
    this.fixedColumns()
  },
  mounted(){
    this.psDivTable = new PerfectScroll(this.$refs.componentDataTable.$el.querySelector('.table__overflow'))
    this.psBody = new PerfectScroll(this.$refs.componentDataTable.$el.querySelector('.table__overflow > table > tBody'))
  },
  methods : {
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    showChildren(item){
      if (!item.children) {
        _.forEach(this.items, it => {
          if (it.name === item.name) {
            it.ShowChildren = !it.ShowChildren
          }
        })
      }
    },
    toggleFullscreen () {
      this.$refs['fullscreen'].toggle()
    },
    formatHeaders(arrayColumns){
      let newArrayColumns = []
      arrayColumns.forEach((a,i) => {
          newArrayColumns.push({ text : this.splitWordPascalCase(a, " "),  value : a})
      })
      return newArrayColumns
    },
    splitWordPascalCase(word, splitChar = ' ') {
        var wordRe = /($[a-z])|[A-Z][^A-Z]+/g;
        if (word.match(wordRe)) {
            return word.match(wordRe).join(splitChar)
        }else return word   
    },
    fixedColumns(){
      let vm = this
      let thElm
      let startOffset

      ([]).forEach.call(
        this.$refs.componentDataTable.$el.querySelectorAll(".table th"),
        function (th) {
          th.style.position = 'relative';

          var grip = document.createElement('div');
          grip.innerHTML = "&nbsp;";
          grip.style.top = 0;
          grip.style.right = 0;
          grip.style.bottom = 0;
          grip.style.width = '5px';
          grip.style.position = 'absolute';
          grip.style.cursor = 'col-resize';
          grip.addEventListener('mousedown', function (e) {
              thElm = th;
              startOffset = th.offsetWidth - e.pageX;
          });

          th.appendChild(grip);
        });

      document.addEventListener('mousemove', function (e) {
        if (thElm) {
          let tdsElm = vm.$refs.componentDataTable.$el.querySelectorAll(`.table td:nth-of-type(${thElm.cellIndex + 1})`)
          thElm.style.width = startOffset + e.pageX + 'px';
          
          /**Se agrega width a los td con el mismo índice que el th */
          ([]).forEach.call(tdsElm, (td) =>{
            // if (td.cellIndex == thElm.cellIndex){
              td.style.width = startOffset + e.pageX + 'px'
            // }
          }) 
        }
      });

      document.addEventListener('mouseup', function (e) {
        if (typeof(thElm) !== 'undefined') {
          /**Se actualiza el arrayTds con el width*/
          vm.arrayTds[thElm.cellIndex] = startOffset + e.pageX +'px'
        }
        thElm = undefined;
      });
    },
    updatePagination(e){
      if (!e) {
        let thElms =  this.$refs.componentDataTable.$el.querySelector(".table").tHead.rows[0].cells;
        this.arrayTds = new Array();
        ([]).forEach.call(thElms,(th) =>{
            this.arrayTds.push(th.style.width)
        })
        this.$nextTick(()=>{
          ([]).forEach.call(this.arrayTds, (td,index)=>{
            ([]).forEach.call(
              this.$refs.componentDataTable.$el.querySelectorAll(`.table td:nth-of-type(${index})`),
              (td)=>{
                td.style.width = this.arrayTds[index-1]
              }
            )
          })
        })
      }
      else{
        this.$nextTick(()=>{
          /**Se setean los width de los tds al actualizar la paginación */
          ([]).forEach.call(this.arrayTds, (td,index)=>{
            ([]).forEach.call(
              this.$refs.componentDataTable.$el.querySelectorAll(`.table td:nth-of-type(${index})`),
              (td)=>{
                td.style.width = this.arrayTds[index-1]
              }
            )
          })
        })
      }
    }
  },
  computed: {
    headersFormat() {
      let myHeaders = []
      if (!this.headers.length) {
        if (this.items.length) {
          myHeaders = this.formatHeaders(Object.keys(this.items[0]))
        } else myHeaders = []
      } else myHeaders = this.headers
      this.arrayTds = new Array(myHeaders.length).fill("120px")/**Inicializamos el array que contendra las medidas de los tds */
      return myHeaders
    },
  },

  watch :{
    fullscreen(newVal){
      if (newVal) {
        let tablediv = this.$refs.componentDataTable.$el
        tablediv.classList.add('my-full-screen-table-adjust')
      }
      else{
        let tablediv = this.$refs.componentDataTable.$el
        tablediv.classList.remove('my-full-screen-table-adjust')
      }
      this.$nextTick(()=>{
        this.psBody.update()
        this.psDivTable.update()
      })
    },
    items(v, oldv){
      this.search = ''
      if (v.length && oldv.length) {
        if (!_.isEqual(Object.keys(v[0]), Object.keys(oldv[0]))) {
          let thElms =  this.$refs.componentDataTable.$el.querySelectorAll(".table th");
          ([]).forEach.call(thElms,(th) =>{
              th.style.width = 120 + 'px'
          })
          this.$nextTick(()=>{
            this.updatePagination()
          })
        }
        else{
          this.$nextTick(()=>{
            this.updatePagination()
          })
        }
      }
      else if(oldv.length <= 0){
        this.$nextTick(()=>{
          this.updatePagination()
        })
      }
    },
    pagination : {
      handler(nVal, oVal){
        /**Se resetean los scrolls a la posición inicial cuando los registros por pagina cambian*/
        if (nVal.rowsPerPage < oVal.rowsPerPage && nVal.rowsPerPage != -1) {
          this.$refs.componentDataTable.$el.querySelector('.table__overflow').scrollLeft = 0
          this.$refs.componentDataTable.$el.querySelector('.table__overflow > table > tBody').scrollTop = 0
        }
      },
      deep : true
    },
    /**Si se recibe custom pagination con propiedades sortBy y descending se aplican*/
    customPagination : {
      handler(v){
        if (typeof(v.sortBy) !== 'undefined' && typeof(v.descending) !== 'undefined') {
          if (this.pagination.sortBy === v.sortBy) {
            this.pagination.descending = !this.pagination.descending 
          } else {
            this.pagination.sortBy = v.sortBy
            this.pagination.descending = false
          }
        }
      },
      deep:true
    }
  }
}
</script>

<style lang="scss">
  .my-full-screen-table-adjust{
    // height: 100vh !important;
    .table__overflow{
      height: 100vh !important;
      table{
        tbody{
          height: 90vh !important;
        }
      }
    }
  }
  .component-data-table {
    .table__overflow {
      overflow: hidden;
      position: relative;
      table {
        overflow-x: scroll;
        border-collapse: collapse;
        thead>tr>th, tbody>tr>td{
          overflow: hidden;
          text-overflow: ellipsis;
        }
        thead {
          display:table;
          width:100%;
          table-layout:fixed;
         
          tr{
            th{
              width: 120px;              
              font-weight: 450;
              padding: 0 3.5px !important;
              font-size: 13px;
              word-break: keep-all;
              word-wrap: none;
              white-space: normal;
              border-left: 1px solid rgba(0,0,0,.25) !important;
              border-right: 1px solid rgba(0,0,0,.25) !important;
            }
            &.datatable__progress{
              display: none;
            }
          }
        }
        tbody {
          position: relative;
          display:block;
          overflow:hidden;

          tr {
            display:table;
            width:100%;
            table-layout:fixed;
            td{
              white-space: nowrap;
              padding: 0 3px;
              font-size: 12px;
              font-weight: 400;
              height: 30px;
              border-top: 1px solid rgba(0,0,0,.15) !important;
              border-left: 1px solid rgba(0,0,0,.15) !important;
              border-right: 1px solid rgba(0,0,0,.15) !important;
            }
          }
        }
        tfoot {
          display:table-row;
          overflow:auto;

          tr {
            display:table;
            width:100%;
            table-layout:fixed;
            td{
              white-space: nowrap;
              padding: 0 2px;
              font-size: 12px;
              font-weight: 350;
              height: 30px;
              border-top: 1px solid rgba(0,0,0,.12) !important;
              border-left: 1px solid rgba(0,0,0,.12) !important;
              border-right: 1px solid rgba(0,0,0,.12) !important;
            }
          }
        }
      }
    }
  }
  .fullscreen{
    overflow: hidden;
  }
</style>

