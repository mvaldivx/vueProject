<template>
    <transition name="fade">
        <svg class="pnl-pie"
            style="fill: rgba(0,0,0,0.3);"
            v-if="show"
            :y="y"
            :x="x"
            :width="width" 
            :height="height" >
            <circle 
                :cx="cZeroX" 
                :cy="cZeroY" 
                :r="radiusExt" 
                stroke="lightgray" 
                stroke-width="1" 
                fill="transparent" 
                />
            <circle 
                :cx="cZeroX" 
                :cy="cZeroY" 
                :r="radiusInt" 
                stroke="lightgray" 
                stroke-width="1" 
                fill="transparent" 
                />
                <g v-for="(point, i) in cPoints" v-bind:key="i + 'histogramPoint'" >
                    <path :d="point.path" 
                        v-on:mouseout="onMouseOut"
                        v-on:mouseenter="onMouseEnter"
                        @click="onClick(i)" 
                        :data-index="i"
                        :fill="'rgb(' + point.color.rgb + ')'" 
                        fill-opacity="0.7" />
                        <g v-if="!mDrawInside">
                            <line 
                                v-if="!isInternal && showPoints"
                                :x1="cLabelStatic[i].x1" 
                                :y1="cLabelStatic[i].y1" 
                                :x2="cLabelStatic[i].x2" 
                                :y2="cLabelStatic[i].y2"
                                stroke-width="1" 
                                stroke="black"/>
                            <line 
                                v-if="!isInternal && showPoints"
                                :x1="cLabelStatic[i].x2" 
                                :y1="cLabelStatic[i].y2" 
                                :x2="cLabelStatic[i].x3" 
                                :y2="cLabelStatic[i].y3"
                                stroke-width="1" 
                                stroke="black"/>
                            <vLabel 
                                v-if="!isInternal && showPoints"
                                :autoSize="true"
                                :text="cLabelStatic[i].Text"
                                :fontSize="8"
                                :orientationX="cLabelStatic[i].orientationX"
                                :limitMinY="y"
                                :limitMinX="x"
                                :limitMaxX="x + width"
                                :limitMaxY="height"
                                :forzeLocation="false"
                                :x="cLabelStatic[i].xText" 
                                :y="cLabelStatic[i].yText" 
                                />
                        </g>
                        <g v-if="mDrawInside">
                            <vLabel 
                                v-if="showPoints"
                                :autoSize="true"
                                :text="cLabelStatic[i].Fragment.toFixed(2)+'%'"
                                :fontSize="8"
                                :orientationX="0"
                                :orientationY="0"
                                :x="cLabelStatic[i].xIS" 
                                :y="cLabelStatic[i].yIS" 
                                />
                        </g>
                </g>
        </svg>
    </transition>
</template>
<script type="text/babel">
    import vLabel       from './vLabelComponent.vue'
    export default {
        components:{ 'vLabel' : vLabel },
        props: {
            /** @description Nombre que se le dara al componente para ser buscado por el padre posteriomente */
             name : { type:String , default: "vuePieComponent" } ,
             /** @description formato con el cual se muestra el label del componente. */
             labelFormat  : { type:String , default: null },
             /** @description ancho de la grafica */
             height : { type:Number , default: 200 } ,
             /** @description alto de la grafica */
             width : { type:Number , default: 200 } ,
             /** @description Indica si se muestra el componente o no */
             show : { type:Boolean , default: true } ,
             /** @description indica si se muestran las etiquetas estaticas de la grafica*/
             showPoints : { type: Boolean , default: false },
             /** @description indica si las etiquetas estaticas se dibujan dentro del circulo */
             drawInside : { type: Boolean , default: false },
             /** @description indica si el componente esta dentro de otro.
              * Si el valor es true, las etiquetas estaticas no se pintaran, ya que se enciman con el 
              * elemento exterior a menos que la propiedad 'drawInside' sea true donde se coloca dentro del
              * mismo componente las etiquetas estaticas.
             */
             isInternal : { type:Boolean , default: false } ,
             /** @description define el centor de la grafica en la coordenada X */
             x : { type:Number , default: 0 } ,
             /** @description define el centor de la grafica en la coordenada Y */
             y : { type:Number , default: 0 } ,
             /** @description Radio exterior del componente */
             radiusExt : { type:Number , default: 100 } ,
             /** @description Radio interno del componente , si este es 0 la grafica se transforma de un circulo*/
             radiusInt : { type:Number , default: 50 } ,
             /** @description lista de datos que se graficaran */
             serie : { type:Object , default: null } ,
             /** @description Categorias en que se divide la serie */
             categories : { type:Array , default: null } ,
             /** 
              * @description Lista de colores que toma el componente para identificar un segmento de otro.
              * Si la cantidad de colores es menor a el total de los elementos, estos se vuelven a usar desde el inicio.
              * */
             colors : { type:Array  , default: function(){ return [{ r: 50, g: 170, b: 75 , rgb: "50,170,75" }]} } ,
            /** @description propiedad ligada al numero de columna que se han dibujado antes de la actual */
             order : { type:Number , default: -1 },
             /** @description indica si actica el efecto de separar el elemento o parte del componente cuando el mouse esta sobre el */
             splitCategory : { type:Boolean , default: false }
        },  
        data(){
            return { 
                mLabelsStatic : []            ,
                mColors     : this.colors     ,
                mCategories : this.categories ,
                mSerie      : this.serie      ,
                mRadiusExt  : this.radiusExt  ,
                mRadiusInt  : this.radiusInt  ,
                mDrawInside : this.drawInside ,
                mMovePoint  : -1
            };
        },
        computed:{
            cCategories(){
                return this.mCategories;
            },
            cLabelStatic(){
               // console.log(this.mLabelsStatic)
                return this.mLabelsStatic;
            },
            cSerie(){
                return this.mSerie;
            },
            cZeroX(){
                return true ? (this.width / 2): 0;
            },
            cZeroY(){
                return true ? (this.height / 2): 0;
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
            cPoints(){
                var points_value =  [];
                var index_PI = -1;
                var c = 0;
                var category_label = "";
                for(var i = 0 ; i < this.cCategories.length ; i++ ){
                    var category = this.cCategories[i];
                    var serie_value = this.cSerie[ category.index ];

                    var color = { r: 50, g: 170, b: 75 , rgb: "50,170,75" };
                    if(c >= this.colors.length ){
                        c = 0;
                    }
                    if( c < this.colors.length ){
                        color = this.colors[c];
                        c++;
                    }
                    var angle_v = this.getAngleByValue( parseFloat(serie_value));
                    if( isNaN(angle_v) ){
                        angle_v = 0;
                    }
                    if( angle_v > Math.PI ){
                        index_PI = points_value.length;
                        points_value.push( { category: category.Label , color: color , angle: Math.PI });
                        points_value.push( { category: category.Label , color: color , angle: angle_v - Math.PI });
                    }
                    else{
                        points_value.push( { category: category.Label , color: color , angle: angle_v });
                    }
                }
                
                var points_str = [];
                var lAlpha = 0;
                var pathPoint_PI = "";
                var alpha_PI = null;
                this.mLabelsStatic = [];
                
                for( var i = 0 ; i < points_value.length ; i++ ){
                    var alpha = points_value[i].angle ;
                    var color = points_value[i].color;
                    var category = points_value[i].category;
                    var zeroX_relative = this.cZeroX;
                    var zeroY_relative = this.cZeroY;
                    if( this.mMovePoint == i && this.splitCategory ){
                        var distancia = 10;
                         zeroX_relative = this.cZeroX + Math.cos( alpha/2 + lAlpha ) * distancia;
                         zeroY_relative = this.cZeroY + Math.sin( alpha/2   + lAlpha ) * distancia;
                    }
                    var p1 = { 
                            x: this.radiusExt * Math.cos( lAlpha ) + zeroX_relative,
                            y: this.radiusExt * Math.sin( lAlpha ) + zeroY_relative };
                    var p2 = { 
                            x: this.radiusExt * Math.cos( alpha + lAlpha ) + zeroX_relative,
                            y: this.radiusExt * Math.sin( alpha + lAlpha ) + zeroY_relative };
                    var p3 = { 
                            x: this.radiusInt * Math.cos( alpha + lAlpha ) + zeroX_relative,
                            y: this.radiusInt * Math.sin( alpha + lAlpha ) + zeroY_relative };
                    var p4 = { 
                            x: this.radiusInt * Math.cos( lAlpha ) + zeroX_relative,
                            y: this.radiusInt * Math.sin( lAlpha ) + zeroY_relative };
                    
                    var pathPoint = "MP1x P1y A Re Re 0 0 1 P2x P2y L P3x P3y A Ri Ri 0 0 0 P4x P4y Z";
                    pathPoint = pathPoint.replace(/P1x/g , p1.x.toFixed(2) );
                    pathPoint = pathPoint.replace(/P1y/g , p1.y.toFixed(2) );
                    pathPoint = pathPoint.replace(/P2x/g , p2.x.toFixed(2) );
                    pathPoint = pathPoint.replace(/P2y/g , p2.y.toFixed(2) );
                    pathPoint = pathPoint.replace(/P3x/g , p3.x.toFixed(2) );
                    pathPoint = pathPoint.replace(/P3y/g , p3.y.toFixed(2) );
                    pathPoint = pathPoint.replace(/P4x/g , p4.x.toFixed(2) );
                    pathPoint = pathPoint.replace(/P4y/g , p4.y.toFixed(2) );
                    pathPoint = pathPoint.replace(/Re/g , this.radiusExt.toFixed(2) );
                    pathPoint = pathPoint.replace(/Ri/g , this.radiusInt.toFixed(2) );

                    var alpha_label = alpha;
                    var alpha_value = alpha ;
                    if( alpha_PI != null ){
                        alpha_label = alpha - alpha_PI;
                        alpha_value = alpha + alpha_PI ;
                        alpha_PI = null;
                    }
                    var anterior_separado = 10;
                    var line_params = this.getLabelLineParams( alpha_label , lAlpha , anterior_separado , 20 , 20, zeroX_relative , zeroY_relative);
                    var moved = false;
                    if( this.mLabelsStatic.length > 0 ){
                        var last_label = this.mLabelsStatic[ this.mLabelsStatic.length - 1];
                        var vectA = { 
                            x: line_params.x3 - last_label.xText , 
                            y: line_params.y3  - last_label.yText };
                        var magVectA = Math.sqrt( vectA.x * vectA.x + vectA.y * vectA.y );
                        if( magVectA < 25 ){
                            var catetoI   = (line_params.x3 > zeroX_relative && line_params.y3 > zeroY_relative ) ;
                            var catetoII  = (line_params.x3 < zeroX_relative && line_params.y3 > zeroY_relative ) ;
                            var catetoIII = (line_params.x3 < zeroX_relative && line_params.y3 < zeroY_relative ) ;
                            var catetoIV  = (line_params.x3 > zeroX_relative && line_params.y3 < zeroY_relative ) ;
                            if( catetoIII || catetoI ){
                                line_params = this.getLabelLineParams( alpha_label , lAlpha , 30 , 30 , 50, zeroX_relative , zeroY_relative );
                            }
                            else if( catetoII || catetoIV ){
                                line_params = this.getLabelLineParams( alpha_label , lAlpha , 30 , 30 , 50, zeroX_relative , zeroY_relative );
                            }
                        }
                    }

                    var point_fragment = alpha_value / (2 * Math.PI);
                    var text_label = alpha_value.toFixed(2) ;
                    
                    var value_point = ( this.cSumValues * point_fragment ) ;
                    var fragment_point = ( 100  * point_fragment ) ;
                    if(this.labelFormat != null ){
                        text_label = this.labelFormat
                                .replace("#{Serie}"    , this.cSerie.Label    )
                                .replace("#{Category}" , category )
                                .replace("#{Value}"    , value_point.toFixed(2)    )
                                .replace("#{Fragment}" , fragment_point.toFixed(2) + "%" );
                    }
                    var label = { 
                        Show     : false,
                        alpha    : alpha + lAlpha ,
                        beta     : alpha_label/2 + lAlpha,
                        Text     : text_label ,
                        Category : category ,
                        Serie    : this.cSerie.Label ,
                        Fragment : fragment_point , 
                        Value    : value_point ,
                        color: color ,
                        x1: line_params.x1 ,
                        y1: line_params.y1 ,
                        x2: line_params.x2 ,
                        y2: line_params.y2 ,
                        x3: line_params.x3 ,
                        y3: line_params.y3 ,
                        xIS: line_params.xI ,
                        yIS: line_params.yI ,
                        orientationX : line_params.orientationX,
                        xText: line_params.x3,
                        moved: moved,
                        yText: line_params.y3
                    };
                    
                    
                    lAlpha += alpha ;
                    if( index_PI != i ){
                        this.mLabelsStatic.push( label );
                        if( pathPoint_PI != "" ){
                            pathPoint = pathPoint_PI + " " + pathPoint;
                            pathPoint_PI = "";
                        }
                        points_str.push( { color: color , path: pathPoint } );
                    }
                    else{
                        alpha_PI = alpha;
                        pathPoint_PI = pathPoint ;
                    }
                }
                /** @description Etiquetas que se sobre ponen unas contra otras */
                if( this.mLabelsStatic.length > 2 ){
                    var labelSize = this.mLabelsStatic.length;
                    var etiquetaAnterior = this.mLabelsStatic[ labelSize - 1 ]; 
                    for( var i = 0 ; i < this.mLabelsStatic.length ; i++ ){
                        var etiquetaActual = this.mLabelsStatic[i];
                        var etiquetaSiguiente = ( i  + 1 < this.mLabelsStatic.length)? this.mLabelsStatic[i+1] : this.mLabelsStatic[0];
                        var catetoAC = this.getCatetoByPoint({ x: etiquetaActual.x3, y: etiquetaActual.y3 });
                        var catetoAN = this.getCatetoByPoint({ x: etiquetaAnterior.x3, y: etiquetaAnterior.y3 });
                        var beta_degree = 360 - etiquetaActual.beta * 180 / Math.PI; 
                        var radianA = this.getRadianByAngle( beta_degree );

                        var diferenciaA = Math.abs( Math.abs( etiquetaActual.y3 ) - Math.abs( etiquetaAnterior.y3 ));
                        var diferenciaS = Math.abs( Math.abs( etiquetaActual.y3 ) - Math.abs( etiquetaSiguiente.y3 ));

                        if( radianA == 1 ){
                            
                            if(  diferenciaA > 20 && diferenciaS < 20 ){
                                etiquetaActual.x2 = etiquetaActual.x1 + 10;
                                etiquetaActual.y2 = etiquetaActual.y1 -5;
                                etiquetaActual.y3 = etiquetaActual.y3 + (20 - diferenciaA );
                                etiquetaActual.yText = etiquetaActual.y3;
                                 /*this.mLabelsStatic[i].x2 = etiquetaActual.x2
                                 this.mLabelsStatic[i].y2 = etiquetaActual.y2
                                 this.mLabelsStatic[i].y3 = etiquetaActual.y3
                                 this.mLabelsStatic[i].yText = etiquetaActual.yText;*/
                                
                            }
                        }
                        else if( radianA == 2 ){
                        } 
                        else if( radianA == 3 ){
                        } 
                        else{
                            if(  diferenciaA > 20 && diferenciaS < 20 ){
                                etiquetaSiguiente.y3 = etiquetaSiguiente.y3 - (20 - diferenciaA );
                                etiquetaSiguiente.yText = etiquetaSiguiente.y3;
                            }
                        }
                        etiquetaAnterior = this.mLabelsStatic[ i ]; 
                    }
                }
                return points_str;
            }
        },  
        methods:{
            getRadianByAngle( angle ){
                if( angle < 45 || angle > 315 ){
                    return 1;
                }
                else if( angle < 135 ){
                    return 2;
                    
                } 
                else if( angle < 225 ){
                    return 3;
                    
                } 
                else if( angle < 315 ){
                    return 4;
                }
            },
            getCatetoByPoint( coord ){
                var zeroX_relative = this.cZeroX;
                var zeroY_relative = this.cZeroY;
                var catetoI   = (coord.x > zeroX_relative && coord.y > zeroY_relative );
                var catetoII  = (coord.x < zeroX_relative && coord.y > zeroY_relative );
                var catetoIII = (coord.x < zeroX_relative && coord.y < zeroY_relative );
                var catetoIV  = (coord.x > zeroX_relative && coord.y < zeroY_relative );
                if( catetoI ){
                    return 1;
                }
                if( catetoII ){
                    return 2;
                }
                if( catetoIII ){
                    return 3;
                }
                return 4;
            },
            getLabelLineParams( alpha, beta, separacion, elevacionX, elevacionY, zeroXRelative , zeroYRelative){
                var line_location = {};
                // posicion (x,y) para el Interior del circulo : Entre el radio interior y el exterior
                var pIx = ( this.radiusInt + 2*(this.radiusExt-this.radiusInt)/3 ) * Math.cos( alpha/2 + beta ) + zeroXRelative;
                var pIy = ( this.radiusInt + 2*(this.radiusExt-this.radiusInt)/3 ) * Math.sin( alpha/2 + beta ) + zeroYRelative;
                // posicion (x,y) para la circunferencia +5 unidades del control
                var pCx = (  5 + this.radiusExt ) * Math.cos( alpha/2 + beta ) + zeroXRelative;
                var pCy = (  5 + this.radiusExt ) * Math.sin( alpha/2 + beta ) + zeroYRelative;
                // posicion (x,y) para la parte exterior mas haya de la circunferencia del circulo
                var pEx = ( elevacionX + this.radiusExt ) * Math.cos( alpha/2 + beta ) + zeroXRelative;
                var pEy = ( elevacionY + this.radiusExt ) * Math.sin( alpha/2 + beta ) + zeroYRelative;
                var pLx = 0;
                var pLY = pEy;
                var orientationX = 1;
                if( pCx > zeroXRelative && pCy > zeroYRelative ){
                    pLx = pEx + separacion;
                }
                else if( pCx < zeroXRelative && pCy > zeroYRelative ){
                    pLx = pEx - separacion;
                    orientationX = -1;
                }
                else if( pCx < zeroXRelative && pCy < zeroYRelative ){
                    pLx = pEx - separacion;
                    orientationX = -1;
                }
                else {
                    pLx = pEx + separacion;
                }
                return { 
                    x1: pCx , y1: pCy , 
                    x2: pEx , y2: pEy , 
                    x3: pLx , y3: pLY , 
                    xI: pIx , yI: pIy , 
                    orientationX: orientationX  };
            },
            getFontColor( color ){
                var  new_color = { r: 0 , g: 0 , b: 0 , rgb: "0,0,0" };
                if( color.r + color.g + color.b < 300 ){
                    new_color = { r: 255 , g: 255 , b: 255 , rgb: "255,255,255" };
                }
                return new_color;
            },
            onMouseOut: function( sender ){
                var index = parseInt( sender.target.getAttribute("data-index"));
                sender.target.setAttribute("fill-opacity","0.7");
                this.$emit("onMouseOut", this );
                this.$forceUpdate();
            },
            onClick: function( index ){
                this.$emit("onClick", this );
            },
            onMouseEnter: function( sender ){
                var index = parseInt( sender.target.getAttribute("data-index"));
                sender.target.setAttribute("fill-opacity","0.9");
                this.mMovePoint = index;
                this.$emit("onMouseEnter", this ,{ color: this.mLabelsStatic[ index ].color , order: index , x: this.mLabelsStatic[ index ].x3 , y: this.mLabelsStatic[ index ].y3 });
                this.$forceUpdate();
            },
            getAngleByValue( value ){
                var valueAlpha = (value / this.cSumValues ) * ( 2 * Math.PI );
                return valueAlpha;
            }
        },
        created(){
            let ckeditor = document.createElement('script');    
            ckeditor.setAttribute('src',"https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js");
            document.head.appendChild(ckeditor);
        }
    }
</script>
<style scoped>
</style>