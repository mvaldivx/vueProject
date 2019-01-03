<template>
    <transition name="fade">
        <svg class="pnl-area"
            v-if="show"
            :y="cY"
            :x="cX"
            :width="cWidth" 
            :height="cHeight" >
                <polyline  
                    :points="cPolygonPath"
                    :style="'fill:none'"
                    :stroke="'rgb(' + mColor.rgb + ')'" 
                    :stroke-width="1"
                />
                <g  v-for="(point, i) in cPoints" v-bind:key="i + '_areaPoint'" >
                    <vEmblem 
                        :orientationX="0"
                        :orientationY="-1"
                        :emblemType="2"
                        :order="i" 
                        @click="onClick"
                        v-on:onMouseEnter="onMouseEnterEmblem" 
                        :backColor="cLabelStatic[i].color"
                        :x="cLabelStatic[i].xText" 
                        :y="cLabelStatic[i].yText" 
                        />
                    <g v-if="showPoints" >
                        <vLabel 
                            :autoSize="true"
                            :text="cLabelStatic[i].Text"
                            :fontSize="8"
                            :orientationX="0"
                            :orientationY="-1"
                            :x="cLabelStatic[i].xText" 
                            :y="cLabelStatic[i].yText - 5" 
                            />
                        <line 
                            :x1="cLabelStatic[i].xText - cPointSpace/5" 
                            :y1="cLabelStatic[i].yText - 10 " 
                            :x2="cLabelStatic[i].xText + cPointSpace/5" 
                            :y2="cLabelStatic[i].yText - 10" 
                            stroke-width="1" 
                            stroke="black"/>
                        <line 
                            :x1="cLabelStatic[i].xText" 
                            :y1="cLabelStatic[i].yText - 10 " 
                            :x2="cLabelStatic[i].xText" 
                            :y2="cLabelStatic[i].yText - 3" 
                            stroke-width="1" 
                            stroke="black"/> 
                    </g>
                </g>
        </svg>
    </transition>
</template>
<script type="text/babel">
    import vLabel       from './vLabelComponent.vue'
    import vEmblem       from './vEmblemComponent.vue'
    export default {
        components:{ 'vLabel' : vLabel, 'vEmblem' : vEmblem },
        props: {
            /* Nombre que se le dara al componente para ser buscado por el padre posteriomente */
             name   : { type:String , default: "vueAreaComponent" } ,
             /** @description formato con el cual se muestra el label del componente.
              * */
             labelFormat  : { type:String , default: null },
             /** @description ancho de la grafica */
             height : { type:Number , default: 200 } ,
             /** @description alto de la grafica */
             width  : { type:Number , default: 200 } ,
             /** @description Indica si se muestra el componente o no */
             show   : { type:Boolean , default: true } ,
            /** @description indica si se muestran las etiquetas estaticas de la grafica*/
             showPoints : { type: Boolean , default: false },
             /** @description indica si las etiquetas estaticas se dibujan dentro de area de la grafica */
             drawInside : { type: Boolean , default: false },
             /**
             * @description Valor maximo que pueden tomar la grafica en el eje Y.}
             * Si el valor negativo , el valor maximo se calcula en automatico con los datos de las series.
             */
            maxYValue : { type:Number , default: -1},
            /**
             * @description Valor maximo que pueden tomar la grafica en el eje X
             */
            maxXValue : { type:Number , default: -1},
            /** @description define el centor de la grafica en la coordenada X */
            x      : { type:Number , default: 0 } ,
            /** @description define el centor de la grafica en la coordenada Y */
            y      : { type:Number , default: 0 } ,
            /** @description lista de datos que se graficaran */
            serie  : { type:Object , default: null } ,
            /** @description Categorias en que se divide la serie */
            categories:{ type:Array, default: null },
            color  : { type:Object , default: function(){ return { r: 50, g: 170, b: 75 , rgb: "50,170,75" }} } ,
            order      : { type:Number , default: -1 } 
        },  
        data(){
            return {
                mLabelsStatic : []            ,
                mHeight: this.height,
                mWidth : this.width,
                mSerie: this.serie,
                mCategories: this.categories, 
                mMaxs : { x: 0 , y: 250 },
                mColor  : this.color ,
                mPointIndex : -1 ,
                mY: this.y,
                mX: this.x,
                mPointX : 0 ,
                mPointY : 0,
                mDrawInside : this.drawInside
            };
        },
        computed:{
            cLabelStatic(){
                return this.mLabelsStatic;
            },
            cY(){
                return this.mY;
            },
            cX(){
                return this.mX;
            },
            cHeight(){
                return this.mHeight;
            },
            cWidth(){
                return this.mWidth;
            },
            cSerie(){
                return this.mSerie;
            },
            cCategories(){
                var categories_clean = [];
                for(var i = 0 ; i < this.mCategories.length ; i++ ){
                    if( this.mCategories[i] != null ){
                        categories_clean.push( this.mCategories[i] );
                    }
                }
                return categories_clean;
            },
            cMaxs(){
                var xM = this.maxXValue;
                var yM = this.maxYValue;
                if( yM <= 0 ){
                    for(var c = 0 ; c < this.cCategories.length ; c++ ){
                        var category = this.cCategories[c];
                       if( yM < this.cSerie[category.index] ){
                            yM = this.cSerie[category.index];
                        }
                    }
                    yM += yM * 0.1;
                }
                return  { x: xM, y: yM };
            },
            cHeight(){ return this.mHeight; },
            cWidth(){  return this.mWidth;  },
            cSerie(){  return this.mSerie;  },
            cCategories(){ return this.mCategories; },
            cPointSpace(){
                var point_space = this.cWidth / ( this.cPoints.length );
                return point_space;
            },
            cPoints(){
                var points_value =  [];
                for(var c = 0 ; c < this.cCategories.length ;  c++ ){
                    var category = this.cCategories[c];
                    points_value.push( this.getAxisYByValue( this.serie[ category.index ] ) );
                }
                return points_value;
            },
            cPolygonPath(){
                var points_value = this.cPoints;
                var point_space = this.cPointSpace;
                var path_str = "";

                this.mLabelsStatic = [];
                path_str = "0," + this.cHeight.toFixed(0) ;
                for( var i = 0 ; i < points_value.length ;i++ ){
                    var category = this.cCategories[i];
                    var point_value    = this.serie[ category.index ];
                    var point_fragment = 100 * point_value / this.cSumValues;
                    var point_text     = point_value.toFixed(2) ;
                    if(this.labelFormat != null ){
                        point_text = this.labelFormat
                                .replace("#{Serie}"    , this.cSerie.Label    )
                                .replace("#{Category}" , category.Label )
                                .replace("#{Value}"    , point_value.toFixed(2)    )
                                .replace("#{Fragment}" , point_fragment.toFixed(2) + "%" );
                    }
                    var location_x =  point_space * (i) + (point_space/2);
                    var location_y =  this.cHeight - points_value[i];
                    var label = { 
                        Show     : true,
                        Text     : point_text ,
                        Category : category.Label ,
                        Serie    : this.cSerie.Label ,
                        Fragment : point_fragment , 
                        Value    : point_value ,
                        color    : this.mColor ,
                        xText    : location_x,
                        yText    : location_y
                    };
                    this.mLabelsStatic.push( label );
                    path_str += "," + location_x.toFixed(2) + "," + location_y.toFixed(2);
                }
                path_str += "," + this.cWidth.toFixed(0) + "," + this.cHeight.toFixed(0) ;
                return  path_str ;
            },
            cSumValues(){
                var sum_values = 0;
                for(var i = 0 ; i < this.cCategories.length ; i++ ){
                    var category = this.cCategories[i];
                    var serie_value = this.cSerie[ category.index ];
                    sum_values += parseFloat(serie_value);
                }
                return sum_values;
            },
        },  
        methods:{
            onMouseEnterEmblem( sender, args ){
                var index = args.order;
                var location_y = this.mLabelsStatic[ index ].yText + this.mLabelsStatic[ index ].yText/4;
                this.$emit("onMouseEnter", this ,{ 
                    color: this.mLabelsStatic[ index ].color , 
                    order: index , 
                    x: this.mLabelsStatic[ index ].xText , 
                    y: location_y 
                });
            },
            onClick: function(){
                this.mShow = !this.mShow;
                this.$emit("onClick", this );
            },
            getAxisYByValue( value ){
                var valueY = (value / this.cMaxs.y ) * ( this.cHeight );
                return valueY;
            },
        },
        created(){
            let ckeditor = document.createElement('script');    
            ckeditor.setAttribute('src',"https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js");
            document.head.appendChild(ckeditor);
        }
    }

</script>
<style scoped>
</style>-