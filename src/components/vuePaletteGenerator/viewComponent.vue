<template>
    <div>
        <!-- 
        <div v-for="( color,i ) in Colors" 
            v-bind:key="i" 
            class="color-item" 
            :style="'background-color: rgb('+ color.rgb+');'" >
        </div> -->
    </div>
</template>
<script type="text/babel">
    export default {
        name: 'vue-palette-generator',
        props: {
            /* Nombre que se le dara al componente para ser buscado por el padre posteriomente */
             name : { type:String, default: "vuePaletteGenerator" } , 

             /* Maximo minimo que puede alcanzar un color */
             max : { type:Number, default: 220 } , 
             /* Valor minimo que puede alcanzar un color */
             min : { type:Number, default: 100 } , 
             /* Cantidad de colores que se quiere generar */
             size : { type:Number, default: 5 } ,
            /* Valor que hay de diferencia entre un color y otro , si es menor a 0 el valor se calcula automatico */
             inc : { type:Number, default: -1 } ,
            /* Ciclo inicial de la rueda de colores , esta rueda tiene 6 etapas*/
             step : { type:Number, default: 0 } ,

            /* Color Inicial o base donde empieza la paleta*/
            start:  { type:Array , default: function(){ return [ 60,170,70] } }

        },  
        data(){
            return{
                mStep : this.step ,
                mStart: this.start ,
                mSize : this.size == 0? 1 : this.size ,
                Colors: []
            }
        },
        computed:{
            colorInc(){
                if( this.inc > 0 ){
                    return this.inc ;
                }
                return parseInt( 255 / this.mSize );
            }
        },  
        methods:{
            getColoryIndex( index , alpha ){
                if( this.Colors.length >= index || index < 0 ){
                    return null;
                }
                return this.Colors[ index ];
            },
            getColorHTMLByIndex( index , alpha ){
                if( this.Colors.length <= index || index < 0 ){
                    return "rgba(0,0,0," + alpha +")";
                }
                var color = this.Colors[ index ];
                return "rgba(" + color.r + "," + color.g +","+ color.b + ","+ alpha +")";
            },
            generateNewColors( newColor  , newSize ){
                this.mStart[0] = newColor.r;
                this.mStart[1] = newColor.g;
                this.mStart[2] = newColor.b;
                if(newSize != null ){
                    this.mSize = newSize ;
                }
                return this.generateColors();
            },
            generateColors(){
                this.Colors = [];
                for( var i = 0 ; i < this.mSize ; i++ ){
                    this.Colors.push( this.getNextColor() );
                }
                return this.Colors ;
            },
            getNextColor(){
                var orderLevel = [ true, false , true , false , true , false ];
                if( this.mStep < 0  || this.mStep >= orderLevel.length ){
                    this.mStep = 0;
                }
                /// R,G,B
                var indexColor = this.mStep % 3;
                var inc = ( orderLevel[ this.mStep ] )? this.colorInc : ( -1 * this.colorInc );
                if( ( inc > 0 && this.mStart[ indexColor ] + inc <= this.max ) || ( inc < 0 && this.mStart[ indexColor ] + inc >= this.min )){
                    this.mStart[ indexColor ] += inc;
                }
                else{
                    this.mStep++;
                    return this.getNextColor();
                }
                return { 
                    r: this.mStart[0] , 
                    g: this.mStart[1] , 
                    b: this.mStart[2] , 
                    rgb: this.mStart[0].toString() +","+ this.mStart[1].toString() +","+ this.mStart[2].toString() };                
            }
        },
        created(){
            this.generateColors();
            this.$emit("onCreate",this, this.Colors )
        }
    }

</script>
<style scoped>
    .color-item{
        width: 150px;
        height: 20px;  
        border: 1px solid lightgray; 
        color: white;
        text-align: center;
    }
</style>