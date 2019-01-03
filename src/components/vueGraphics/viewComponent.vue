<template>
    <div >
        <h3> {{title}} </h3>
        <div class="svg">
            <svg class="pnl-trends"
                :width="cWidthGeneral" 
                :height="cHeightGeneral" >
                <!-- Rectangulo de fondo (Este es el rectangulo azul) -->
                    <rect 
                        :x="cX" 
                        :y="cMargin.y"
                        :width="cAvailableWidth" 
                        :height="cAvailableHeight"
                        fill="rgba(235,235,250,0.7)" />
                <!-- -->
                <!-- Etiquetas de AxisY 
                Son las etiquetas que se muestran del lado izquierdo de la grafica como indicadores de nivel.
                estan estos ocupan el espacion del margen en X.
                -->
                    <g  v-if="chartType.indexOf(3) == -1 && cShowAxisY "
                        v-for="(item , i) in cAxisY " v-bind:key="i + '_axisY'" >
                        
                        <line 
                            :x1="cX" 
                            :y1="cHeight - marginAxisY - getAxisYByValue(item.value)" 
                            :x2="cX + cAvailableWidth" 
                            :y2="cHeight - marginAxisY - getAxisYByValue(item.value)" 
                            style="stroke:rgba(0,0,0,0.5);stroke-width:0.2" />

                        <line 
                            :x1="cX" 
                            :y1="cHeight - marginAxisY - getAxisYByValue(item.value)" 
                            :x2="cX - 10" 
                            :y2="cHeight - marginAxisY - getAxisYByValue(item.value)" 
                            style="stroke:rgb(0,0,0);stroke-width:1" />
                        <vLabel 
                            :autoSize="true"
                            :text="item.Label"
                            :fontSize="8"
                            :x="cX" 
                            :orientationX="-1"
                            :orientationY="1"
                            :y="cHeight - marginAxisY - getAxisYByValue(item.value)" 
                        />
                    </g>
                <!-- -->
                <!-- Grafica de Area -->
                    <g  v-if="chartType.indexOf(1) != -1">
                        <vAreas 
                            v-for="(serie, index) in cSeries" v-bind:key="index + '_area'"
                            v-if="serie != null && serie.Show"
                            :order="index"
                            :serie="serie"
                            :categories="cCategories"
                            :maxYValue="cMaxs.y"
                            :maxXValue="cMaxs.x"
                            :x="cX + cColumnWidth * index " 
                            :y="cMargin.y"
                            :color="serie.Color2"
                            :width="cAvailableWidth" 
                            :height="cAvailableHeight"
                            v-on:onMouseEnter="onMouseEnterArea"
                            v-on:onMouseOut="onMouseOutArea"
                        />
                    </g>
                <!-- --> 
                <!-- Columns (Trends) -->
                    <g  v-if="chartType.indexOf(0) != -1">
                        <svg  
                            v-for="(category , i ) in cCategories " 
                            v-bind:key="i"
                            :y="0" >
                            <g  v-if="category.Show" >
                                <vTrends v-for="(serie , index) in cSeries " v-bind:key="index + '_columns'"
                                    v-if="serie != null && serie.Show"
                                    :order="(cSeries.length * i + index)"
                                    :category="category"
                                    :serie="serie"
                                    :value="serie[category.index]"
                                    :y="cHeight - marginAxisY"
                                    :x="5 + cX + i * cColumnSpace + index * cColumnWidth"
                                    v-on:onClick="onClick(category,serie,$vuetify)" 
                                    v-on:onMouseEnter="onMouseEnterTrends"
                                    v-on:onMouseOut="onMouseOutTrends"
                                    :width="cColumnWidth"
                                    :label="serie.Label"
                                    :color="serie.Color"
                                    :height="getAxisYByValue( serie[category.index] )" />
                                <!-- -->
                                <!-- Etiquetas de AxisX -->
                                    <line 
                                        v-if="chartType.indexOf(3) == -1 "
                                        :x1="2 + cX + i * cColumnSpace + cColumnSpace/2" 
                                        :y1="cHeight - marginAxisY" 
                                        :x2="2 + cX + i * cColumnSpace + cColumnSpace/2" 
                                        :y2="cHeight - marginAxisY + 10" 
                                        style="stroke:rgb(0,0,0);stroke-width:1" />
                                    <vLabel 
                                        v-if="(chartType.indexOf(3) == -1 || chartType.length > 1 )"
                                        :autoSize="true"
                                        :text="category.Label"
                                        :backColor="{r:255,g:255,b:255,rgb:'255,255,255'}"
                                        :fontSize="8"
                                        :orientationX="0"
                                        :orientationY="1"
                                        :x="2 + cX + i * cColumnSpace + cColumnSpace/2" 
                                        :y="cHeight - marginAxisY + 10" 
                                    />
                                </g>
                        </svg>
                    </g>
                <!-- -->
                <!-- Grafica de Histograma -->
                    <g  v-if="chartType.indexOf(2) != -1">
                        <vHistogram 
                            v-for="(serie, index) in cSeries" v-bind:key="index + '_area'"
                            v-if="serie != null && serie.Show"
                            :order="index"
                            :serie="serie"
                            :categories="cCategories"
                            :maxYValue="cMaxs.y"
                            :maxXValue="cMaxs.x"
                            :x="cX + 0 * index " 
                            :y="cMargin.y"
                            :color="serie.Color2"
                            :width="cAvailableWidth" 
                            :height="cAvailableHeight"
                            v-on:onMouseEnter="onMouseEnterArea"
                            v-on:onMouseOut="onMouseOutArea"
                        />
                    </g>
                <!-- --> 
                <!-- Grafica de Pie -->
                    <g  v-if="chartType.indexOf(3) != -1 ">
                        <vPie 
                            v-for="(serie, index) in cSeries" v-bind:key="index + '_pie'"
                            v-if="serie != null && serie.Show"
                            :order="index"
                            :serie="serie"
                            :categories="cCategories"
                            :labelFormat="labelFormat"
                            :x="cX" 
                            :y="cMargin.y + 10"
                            :isInternal="index > 0 "
                            :radiusExt="cAvailableDistanceR/2 - (cAvailableDistanceR/(3 * series.length ) ) * ( index + 0) +10 "
                            :radiusInt="cAvailableDistanceR/2 - (cAvailableDistanceR/(3 * series.length ) ) * ( index + 1) -5"
                            :colors="getGetColorsDarker( serie.Color, categories.length )"
                            v-on:onMouseEnter="onMouseEnterPie"
                            v-on:onMouseOut="onMouseOutPie"
                            :width="cAvailableWidth" 
                            :height="cAvailableHeight"
                        />
                    </g>
                <!-- --> 
                <!-- Lineas de Axis -->
                    <line 
                        v-if="chartType.indexOf(3) == -1 "
                        :x1="cX" 
                        :y1="cMargin.y" 
                        :x2="cX" 
                        :y2="cHeight -marginAxisY" 
                        style="stroke:rgb(0,0,0);stroke-width:1" />
                    <line 
                        v-if="chartType.indexOf(3) == -1 "
                        :x1="cX" 
                        :y1="cHeight - marginAxisY" 
                        :x2="cWidth - cMargin.x " 
                        :y2="cHeight - marginAxisY" 
                        style="stroke:rgb(0,0,0);stroke-width:1" />
                <!-- -->
                <!-- Lineas de Limites -->
                    <line
                        v-if="chartType.indexOf(3) == -1 " 
                        v-for="(limit, i ) in limits" v-bind:key="i + '_limitd'"
                        :x1="cX" 
                        :y1="cHeight + marginAxisY - getAxisYByValue(limit)" 
                        :x2="cX + cAvailableWidth" 
                        :y2="cHeight + marginAxisY - getAxisYByValue(limit)" 
                        style="stroke:rgba(230,0,0,1);stroke-width:1" />
                <!-- -->
                <!-- Label Information , estan ubicadas en la parte superior de la grafica. -->
                    <svg 
                        class="label-information" 
                        :x=" chartType.indexOf(3) != - 1 ? 450 : cAvailableWidth - cMaxLabelLength * 4.5 - cMargin.x " 
                        :y="cMargin.y + 5 ">
                        <rect 
                            rx="3" 
                            ry="3"
                            :width ="cMaxLabelLength * 6 + 5" 
                            :height="series.length * 17 + 10"
                            style="stroke:rgb(0,0,0);stroke-width:0.75"
                            fill="white" />
                            <g  v-for="(serie , i) in cSeries " v-bind:key="i + '_axisY'">
                                <rect 
                                    :x="10 " 
                                    :y="7.5 + ( i * 17 ) "
                                    :width ="10" 
                                    :height="10"
                                    @click="toggleSerie(i , this )"
                                    :class="{'serie-label-hidden': !serie.Show }"
                                    :fill="'rgb(' + serie.Color.rgb + ')'" />
                                <text 
                                    :x="25" 
                                    :y="7.5 + ( i * 17 ) + 10 "
                                    font-size="12"
                                    fill="black">{{serie.Label}}</text>
                            </g>
                    </svg >
                <!-- -->
                <!-- LABELS : estas etiquetas se activan cuando se posiciona sobre un elmento de la grafica.-->
                <vLabel 
                    ref="vLabel_Trends"
                    :autoSize="true"
                    :showCloser="true"
                    :text="''"
                    :limitMinY="cMargin.y"
                    :limitMinX="cX"
                    :limitMaxX="cX + cAvailableWidth"
                    :limitMaxY="cAvailableHeight"
                    :forzeLocation="false"
                    :orientationY="-1"
                    :orientationX="0"
                />
                <!-- -->
                <!-- LEGENDS : Descripcion de la tabla que se ubica debajo de la grafica en forma de grid-->
                <g v-if="cShowLegends">
                    <g v-for="(legend, i) in cLegends" v-bind:key="i + '_Legend'">
                        <g v-if='legend.Show'>
                            <vLabel 
                                :autoSize="true"
                                :y="cAvailableHeight + cMargin.y + 40 + i * 35"
                                :x="cX" 
                                :text="legend.Text "
                                :orientationY="0"
                                :orientationX="-1"
                            />
                            <line
                                :x1="5" 
                                :y1="cAvailableHeight + cMargin.y + 50 + i * 35" 
                                :x2="cX - 10" 
                                :y2="cAvailableHeight + cMargin.y + 50 + i * 35 " 
                                :stroke="'rgb('+ legend.Color.rgb +')'"
                                stroke-width="5" />
                            <line
                                :x1="1" 
                                :y1="cAvailableHeight + cMargin.y + 60 + (i-1) * 35" 
                                :x2="cWidthGeneral-4" 
                                :y2="cAvailableHeight + cMargin.y + 60 + (i-1) * 35 " 
                                :stroke="'rgb(0,0,0)'"
                                stroke-width="1" />
                                <g v-for="(value, c) in legend.Values" v-bind:key="i + '_' + c + '_LegendPoint'">
                                    
                                    <line
                                        :x1="cX + c * cColumnSpace" 
                                        :y1="cAvailableHeight + cMargin.y + 60 + (i-1) * 35" 
                                        :x2="cX + c * cColumnSpace" 
                                        :y2="cAvailableHeight + cMargin.y + 60 + i * 35 " 
                                        :stroke="'rgb(0,0,0)'"
                                        stroke-width="1" />
                                    <vLabel 
                                        :autoSize="true"
                                        :y="cAvailableHeight + cMargin.y + 45 + i * 35"
                                        :x="10 + cX + c * cColumnSpace + cColumnWidth " 
                                        :text="'$ '+ value.toFixed(2).toString()"
                                        :orientationY="0"
                                        :orientationX="0"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                <!-- -->
            </svg>
        </div>
        <h3><small>{{caption}}</small></h3>
    </div>
</template>
<script type="text/babel">
    import vTrends      from './vTrendComponent.vue'
    import vAreas       from './vAreaComponent.vue'
    import vHistogram   from './vHistogramComponent.vue'
    import vPie         from './vPieComponent.vue'
    import vLabel       from './vLabelComponent.vue'
    export default {
        name: 'vue-graphics',
        components:{
            'vTrends'    : vTrends    ,
            'vAreas'     : vAreas     ,
            'vHistogram' : vHistogram ,
            'vPie'       : vPie       ,
            'vLabel'     : vLabel 
        },
        props: {
            /** @description texto que se muestra sobre la grafica */
            title : { type:String , default: "" } ,
            /** @description texto que se muestra debajo de la grafica  */
            caption : { type:String , default: "" } ,
            /** 
              * @description Indicadores paralelos al eje X que recorren toda la grafica.
              * Toman su posicion de acuerdo a su valor y no a sus coordanada.
              */
            limits : { type:Array , default: function(){ return [ 100 , 250 ] }},
            /** 
             * @description alto del component 
             * */
            height : { type:Number , default: 400 } ,
            /** 
             * @description largo del component 
             * */
            width  : { type:Number , default: 800 } ,
            /** 
              * @description hace referencia al espacio que existe entre el inicio del grafico y el margen del lienzo en el eje Y
              */
            marginAxisY  : { type:Number , default: 30  } ,
            /** 
              * @description hace referencia al espacio que existe entre el inicio del grafico y el margen del lienzo en el eje X
              */
            marginAxisX  : { type:Number , default: 215  } ,
            /** 
              * @description Indica si se mostraran los indicadores laterales, de forma automatica o se enviados por el usuario.
              * Si el valor es negativo, indica que los 'axisY' se colocaran conforme los asigno el usuario.
              * si el valor es mayor a 0 , los 'axisY' se calculan de forma automatica y equitativa.
              *  */
            axisYAuto : { type:Number , default: -1},
            /**
              * @description Son las etiquetas o indicadores que se muestran en la seccion lateral izquierda de la grafica.
              * Estos toman su posicion en 'Y' de acuerdo al valor dado y no a la coordanada o posicion ordinaria como fueron creados.
              */
            axisY : { type:Array  , default: function(){ 
                    var tmpAxisY = [];
                    for( var i = 0 ;  i < 6 ; i++ ){
                        tmpAxisY.push({ value: ( (i + 1 ) * 250 )/ 6 , Label:"Level " + (i + 1 ).toString() });
                    }
                    return tmpAxisY;
                }
             },
            /** @description arreglo que define el tipo de grafica, este puede tener varias graficas en el mismo componente 
              * 0 = Grafico de Barras
              * 1 = Grafico de Area
              * 2 = Grafico de Linea
              * 3 = Grafico de Pie o Dona
             */
            chartType :{ type:Array , default: function(){ return [4] }},
            /** @description contiene los valores o las series que se graficaran*/
            series     : { type:Array  , default: function(){ 
                 var tmpSeries = [];
                 for( var sI = 0 ; sI < 4 ;  sI++ ){
                    var tmpSerieItem = {};
                    var cR = Math.floor(Math.random() * 220 ) + 60 ;
                    var cG = Math.floor(Math.random() * 210 ) + 50 ;
                    var cB = Math.floor(Math.random() * 200 ) + 40 ;
                    tmpSerieItem["Label"] = "Serie" + (sI).toString();
                    tmpSerieItem["Show"] = true;
                    tmpSerieItem["Color"] = { 
                        r : cR,
                        g : cG,
                        b : cB,
                        rgb: cR.toString() + "," + cG.toString() + "," + cB.toString() };
                    tmpSerieItem["Color2"] = { 
                        rgb: (cR - 50 ).toString() + "," + (cG - 50 ).toString() + "," + ( cB - 50 ).toString() 
                    };
                    for( var i = 0 ; i < 6 ; i++ ){ ;
                        // tmpSerieItem["Semana" + (i + 1 ).toString() ] = i * 150 + 50 ;
                        tmpSerieItem["Semana" + (i + 1 ).toString() ] = Math.floor(Math.random() * 200 ) + 50  ;
                    }
                    tmpSeries.push( tmpSerieItem );
                 }
                 return tmpSeries; 
             }}, 
            /** @description Categorias que se grafican */
            categories : { type:Array  , default: function(){ 
                 var tmpCategories = [];
                 for( var i = 0 ; i < 6 ; i++ ){
                     var tmpCategoryItem = {};
                     tmpCategoryItem.Show = i % 5 == 0;
                     tmpCategoryItem.index = "Semana" + (i + 1 ).toString();
                     tmpCategoryItem.Label = "Mes " + (i + 1 ).toString();

                     tmpCategories.push( tmpCategoryItem );
                 }
                 return tmpCategories; 
             }},
            /** @description etiquetas que se muestran para dar informacion adicional a los datos de las series por categoria */
            labels     : { type:Array , default: null },
            /** @description define el formato de la etiqueta para personalizar de forma estandar los datos que se mostraran */
            labelFormat: { type:String , default: null },
            /** @description indica si muestra la etiqueta al momento de colocar el puntero sobre alguna serie o valor */
            showLabel : { type:Boolean, default: false },
            /** @description etiquetas o legendas sobre cada serie, esta contiene informacion basica y puede ser siempre persistente */
            legends    : { type:Array , default: null },
            /** @description define el formato de las legendas para personalizar de forma estandar los datos que se mostraran */
            legendFormat: { type:String , default: null },
            /** @description indica si muestra las legendas al momento de colocar el puntero sobre alguna serie o valor */
            showLegends : { type:Boolean, default: true },
            /**
             * @description Valor maximo que pueden tomar la grafica en el eje Y.}
             * Si el valor negativo , el valor maximo se calcula en automatico con los datos de las series.
             */
            maxYValue : { type:Number , default: -1},
            /**
             * @description Valor maximo que pueden tomar la grafica en el eje X
             */
             minYValue : { type:Number , default: 200},
            /**
             * @description Valor maximo que pueden tomar la grafica en el eje X
             */
            maxXValue : { type:Number , default: -1},
            /** @description Radio maximo que tomara la grafica de PIE.
             * Si el valor es menor o igual a 0 , este tomara el tamaño disponible.
             */
            minXValue : { type:Number , default: 200},
            /** @description Radio maximo que tomara la grafica de PIE.
             * Si el valor es menor o igual a 0 , este tomara el tamaño disponible.
             */
            maxRadius : { type:Number , default: -1},
            /** @description indica si muestra las etiquetas estaticas en la grafica.
             * En caso de tener varias graficas, solo muestra las etiquetas de la ultima grafica.
             * estas etiquetas tienen fondo transparente 
             */
            showPointLabel : { type:Boolean, default: false },
            /** @description si estan activas las etiquetas estaticas , esta variable indica la posicion donde se colocan dichas etiquetas
             * Pueden estar ubicadas dentro la serie o grafica, cuando el valor es true.
             * Cuando el valor es negativo, las etiquetas se colocan sobre o fuera de la serie
             */
            drawInside : { type:Boolean, default: false }
        },  
        data(){
            return { 
                    mHeight: this.height,
                    mWidth:  this.width,
                    mShowLabel: this.mShowLabel,
                    mShowAxisY : true,
                    mSpaceBetweenColumns: 1.2 ,
                    /** @description es el espacio que se deja para colocar las etiquetas de legendas , que se ubican en la parte inferior de la grafica*/
                    mMarginLegendY : 100,
                    /** @description margen , espacio que existe entre la grafica y el border exterior del componente */
                    mMargin :{ x: 10 , y: 10 },
                    mMins : { x: 0 , y: 0 },
                    /** @description lista de series que se graficaran */
                    mSeries: this.series,
                    /** @description lista de categorias que se graficaran */
                    mCategories: this.categories,
                    /** @description Contiene la lista de etiquetas que se genera en la tabla o se agregan */
                    mLabels : this.labels ,
                    /** @description Contiene las legendas, a diferencia de las etiquetas, estos se pintan en forma de tabla */
                    mLegends : this.legends ,
                    mShowLegends: this.showLegends
                };
        },
        watch: {
        }, 
        computed:{
            cShowAxisY(){
                return this.mShowAxisY;
            },
            cShowLegends(){
                if( this.mShowLegends && (this.chartType.indexOf(3) == -1 || this.chartType.length > 1)){
                    return true;
                }
                return false;
            },
            cHeightGeneral(){
                return this.mHeight;
            },
            cWidthGeneral(){
                return this.mWidth;
            },
            cHeight(){
                if( this.cShowLegends ){
                    return this.cHeightGeneral - this.mMarginLegendY;
                }
                return this.cHeightGeneral ;
            },
            cWidth(){
                return this.cWidthGeneral;
            },
            cMargin(){
                return this.mMargin;
            },
            cSeries(){
                var series_clean = [];
                for(var i = 0 ; i < this.mSeries.length ; i++ ){
                    if( this.mSeries[i] != null ){
                        series_clean.push( this.mSeries[i] );
                    }
                }
                return series_clean;
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
            cLegends(){
                return this.mLegends;
            },
            cMaxLabelLength(){
               // console.log(this.mSeries)
                var series_label_length = 13;
                if(this.mSeries.length > 1)
                {
                    for(var c = 0 ; c < this.mSeries.length ; c++ ){
                        if( series_label_length < this.mSeries[c].Label.length){
                            series_label_length = this.mSeries[c].Label.length;
                        }
                    }
                }
                
                return series_label_length * 1.5;
            },
            cMaxs(){
              
                var xM = this.maxXValue; 
                var yM = this.maxYValue;
                var yT = 0;
                if( yM <= 0 ){
                    for(var c = 0 ; c < this.cCategories.length ; c++ ){
                        var category = this.cCategories[c];
                        for(var s = 0 ; s < this.cSeries.length ;  s++ ){
                            
                            var serie = this.cSeries[s];
                            if( yM < serie[category.index] ){
                                yM = serie[category.index];
                            }
                            yT = yT+serie[category.index]
                        }
                    }
                    yM += yM * 0.1;
                }
                //alert(yM);
                // this.cMins();
                //console.log(yT)
                return  { x: xM, y: yM,t:yT };
            },
            cMins()
            {
                
                //var serie = this.cSeries[0];
                var xM = this.minXValue; 
                var yM = this.minYValue;
                //alert(ym);
                //alert(xm);
                //alert(serie);
                for(var c = 0 ; c < this.cCategories.length ; c++ ){
                        var category = this.cCategories[c];
                        for(var s = 0 ; s < this.cSeries.length ;  s++ ){
                            var serie = this.cSeries[s];
                            if( yM > serie[category.index] ){
                                yM = serie[category.index];
                            }
                        }
                    }
                    yM+=yM*0.1;
                   // alert(yM)
                    return  { x: xM, y: yM };
            },
            cAxisY(){
                
                if( this.axisYAuto > 0 ){
                    var tmpAxisY = [];

                    //if(this.cMins.y >= 0){
                        for( var i = 0 ;  i < this.axisYAuto ; i++ ){
                        var axisY_value = ( (i + 1 ) * this.cMaxs.y )/ this.axisYAuto ;
                        tmpAxisY.push({ 
                            value: axisY_value , 
                            Label: axisY_value.toFixed(2) });
                    }
                    //}
                    
                  /* if(this.cMins.y < 0){
                       var Mitad = this.axisYAuto / 2;
                       for( var i = 0 ;  i < Mitad ; i++ ){
                        var axisY_value = ( (i + 1 ) * this.cMins.y )/ Mitad ; 
                        tmpAxisY.push({ 
                            value: axisY_value , 
                            Label: axisY_value.toFixed(2) });
                       }

                            for( var i = 0 ;  i < Mitad ; i++ ){
                        var axisY_value = ( (i + 1 ) * this.cMaxs.y )/ Mitad ;
                        tmpAxisY.push({ 
                            value: axisY_value , 
                            Label: axisY_value.toFixed(2) });
                    }
                    }*/
                    
                    return tmpAxisY;
                }
                return this.axisY;
            },
            cAvailableDistance(){
                return (this.cAvailableWidth < this.cAvailableHeight)?this.cAvailableWidth : this.cAvailableHeight;
            },
            cAvailableDistanceR(){
                if( this.maxRadius > 0 ){
                    return this.maxRadius;
                }
                return this.cAvailableDistance;
            },
            cY(){

            },
            cX(){
                if( (this.chartType.indexOf(3) == -1 || this.chartType.length > 1)){
                    return this.marginAxisX;
                }
                return this.cMargin.x;
            },
            cAvailableWidth(){
                if( (this.chartType.indexOf(3) == -1 || this.chartType.length > 1)){
                    return this.cWidth - this.cMargin.x - this.marginAxisX ;
                }
                return this.cWidth - this.cMargin.x * 2  ;
            },
            cAvailableHeight(){
                return this.cHeight - this.marginAxisY - this.cMargin.y;
            },
            cColumnWidth(){
                if( this.cSeries != null && this.cSeries.length > 0 && this.cCategories != null  && this.cCategories.length > 0 ){
                    var tmpValue = ( this.cAvailableWidth ) / ( this.mSpaceBetweenColumns * this.cSeries.length * this.cCategories.length );
                    return tmpValue;
                }
                return 10;
            },
            cColumnSpace(){
                if( this.cSeries != null && this.cSeries.length > 0 && this.cCategories != null  && this.cCategories.length > 0 ){
                    var tmpValue = this.mSpaceBetweenColumns * this.cSeries.length * this.cColumnWidth ;
                    return tmpValue;
                }
                return 10;
            }
        },  
        methods:{
            /** @description da formato a las series para asignar su ubicacion antes de graficarlos y genera los labels que se mostraran */
            reload(){
                //chartType.indexOf(3) Esta es para identificar una grafica de pastel
                //if(this.chartType.indexOf(3))
                var max_value = this.cMaxs.t;
                this.mLegends = [];
                for( var s = 0 ; s < this.cSeries.length ; s++ ){
                    var serie = this.cSeries[s];
                    var legend_item = {};
                    legend_item.Text = serie.Label;
                    legend_item.Show = serie.Show;
                    legend_item.Color = serie.Color;
                    legend_item.Values = [];
                    for( var c = 0 ; c < this.cCategories.length ; c++ ){
                        var category = this.cCategories[c];
                        var serie_value = serie[ category.index ];
                        legend_item.Values.push( serie_value );
                    }
                    this.mLegends.push( legend_item );
                }
                this.mMarginLegendY = this.mLegends.length * 35;

                this.mLabels = [];
                for( var c = 0 ; c < this.cCategories.length ; c++ ){
                    var category = this.cCategories[c];
                    for( var s = 0 ; s < this.cSeries.length ; s++ ){
                        var serie = this.cSeries[s];
                        
                        var serie_value = serie[category.index];
                       // alert("Valor :"+serie_value+" Label: "+serie.Label +" Categoria: "+category.index)
                        var location_y = 2/3 * this.getAxisYByValue( serie_value );
                        var location_x = 5 + this.marginAxisX + c * this.cColumnSpace + s * this.cColumnWidth ;
                        var label_text = "";
                        if( this.labelFormat != null ){
                            label_text = this.labelFormat
                                .replace("#{Value}"     ,"$ "+ serie_value.toFixed(2))
                                .replace("#{Serie}"     , serie.Label )
                                .replace("#{Category}"  , category.Label )
                                .replace("#{Fragment}"  , (100 * serie_value/max_value).toFixed(2) + "%" );
                                //console.log(serie.Label +' '+ serie_value +' '+ category.Label +' '+ (100 * serie_value/max_value).toFixed(2))
                        }
                        else{
                            label_text = serie.Label;
                            
                        }
                        var label_format = {
                            Text: label_text , 
                            Color: serie.Color,
                            FontSize: 10,
                            y : this.cHeight - this.marginAxisY - location_y ,
                            x : location_x
                        };
                        
                        if(max_value!=0 )
                         {  
                              this.mLabels.push( label_format );
                         }
                    }
                }
                this.$forceUpdate();
            },
            CambiarAncho(ancho )
            {
                this.mWidth = ancho;
                this.reload()
            },
            setSource( categories, series ){
                for(var c = 0 ; c < this.mCategories.length ; c++ ){
                    var category = this.mCategories[c];
                    if( category == null ){
                        continue;
                    }
                    this.mCategories[c].Show = false;
                }
                for(var s = 0 ; s < this.mSeries.length ; s++ ){
                    var serie = this.mSeries[s];
                    if( serie == null ){
                        continue;
                    }
                    this.mSeries[s].Show = false;
                }
                var sender = this;
                var tmp_show_legend = this.mShowLegends;
                this.mShowLegends = false;
                this.mShowAxisY = false;
                setTimeout(function(){
                    sender.mCategories = categories;
                    sender.mSeries = series;
                    sender.mShowLegends = tmp_show_legend;
                    sender.mShowAxisY = true;
                    sender.reload();
                }, 200);
            },
            setCategories( categories ){
                this.mCategories = categories;
            },
            toggleSerie( serieIndex , sender ){
                this.cSeries[serieIndex].Show = !this.cSeries[serieIndex].Show;
                this.$forceUpdate();
            },
            getAxisYByValue( value ){
                var valueY = (value / this.cMaxs.y ) * ( this.cAvailableHeight ); 
                return valueY;
            },
            getGetColorsDarker( color , size ){
                var colors = [];
                for(var i = 0 ; i < size ; i++ ){
                    var cR = parseInt(color.r - i * ( color.r / size ) * 0.7);
                    var cG = parseInt(color.g - i * ( color.g / size ) * 0.7);
                    var cB = parseInt(color.b - i * ( color.b / size ) * 0.7);
                    var dark_color = { 
                        r: cR,
                        g: cG,
                        b: cB,
                        rgb: cR.toString() + "," + cG.toString() + "," + cB.toString() 
                    };
                    colors.push( dark_color );
                }
                return colors ;
            },
            setShowLegend( value ){
                this.mShowLegends = value;
                var categories_show = [];
                for(var c = 0 ; c < this.mCategories.length ; c++ ){
                    var category = this.mCategories[c];
                    if( category == null ){
                        continue;
                    }
                    categories_show.push( this.mCategories[c].Show );
                    this.mCategories[c].Show = false;
                }
                var series_show = [];
                for(var s = 0 ; s < this.mSeries.length ; s++ ){
                    var serie = this.mSeries[s];
                    if( serie == null ){
                        continue;
                    }
                    series_show.push( this.mSeries[s].Show );
                    this.mSeries[s].Show = false;
                }
                var sender = this;
                var tmp_show_legend = this.mShowLegends;
                this.mShowLegends = false;
                setTimeout(function(){
                    for(var c = 0 ; c < sender.mCategories.length ; c++ ){
                        var category = sender.mCategories[c];
                        if( category == null ){
                            continue;
                        }
                        sender.mCategories[c].Show = categories_show[c];
                    }
                    for(var s = 0 ; s < sender.mSeries.length ; s++ ){
                        var serie = sender.mSeries[s];
                        if( serie == null ){
                            continue;
                        }
                        sender.mSeries[s].Show = series_show[s];
                    }
                    sender.mShowLegends = tmp_show_legend;
                    sender.reload();
                }, 200);
                
            },
            onClick( category , serie, vuetify ){
                this.$emit("onClick",this, category , serie, vuetify )
            },
            onMouseEnterTrends( sender ){
                
                var label_active =  this.mLabels[ sender.order ];
                var location_x = label_active.x + this.cColumnWidth/2;
                this.$refs.vLabel_Trends.setShow(true);
                this.$refs.vLabel_Trends.setLocation(  { x: location_x , y: label_active.y } );
                this.$refs.vLabel_Trends.setText(       label_active.Text );
                this.$refs.vLabel_Trends.setBackColor(  label_active.Color );
            },
            onMouseOutTrends( sender ){
                //this.$refs.vLabel_Trends.setShow(false);
            },
            ocultarLabels()
            {
                 this.$refs.vLabel_Trends.setShow(false);
            },
            onMouseEnterPie( sender , args ){
                var order_fixed = args.order + this.cCategories.length * sender.order ;
                var label_active =  this.mLabels[ order_fixed ];
                this.$refs.vLabel_Trends.setShow(true);
                this.$refs.vLabel_Trends.setLocation(  { x:args.x, y: args.y } );
                this.$refs.vLabel_Trends.setText(       label_active.Text );
                this.$refs.vLabel_Trends.setBackColor(  args.color );
            },
            onMouseOutPie( sender ){
                //this.$refs.vLabel_Trends.setShow(false);
            },
            onMouseEnterArea( sender , args ){
                var order_fixed = (args.order*2) +  sender.order ;
                var label_active =  this.mLabels[ order_fixed ];
                this.$refs.vLabel_Trends.setShow(true);
                this.$refs.vLabel_Trends.setLocation(  { x: this.cX + args.x, y: args.y } );
                this.$refs.vLabel_Trends.setText(       label_active.Text );
                this.$refs.vLabel_Trends.setBackColor(  args.color );
            },
            onMouseOutArea( sender ){

               // this.$refs.vLabel_Trends.setShow(false);
            }
        },
        created(){
            let ckeditor = document.createElement('script');    
            ckeditor.setAttribute('src',"https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js");
            document.head.appendChild(ckeditor);
            this.reload();
        }
    }

</script>
<style scoped>
    .pnl-trends{
        border: 1px solid lightgray; 
    }
    div.trend{
        border: 1px solid lightgray;
        padding: 5px 0px;
        border-radius: 5px;
        background: white;
        width: 100%;
        position: relative;
    }
    div.trend .svg{
        margin: auto;
    }
    div.trend *{
        text-align: center;
    }
    .serie-label-hidden{
        fill-opacity: 0.3;
    }
    .label-information{
        opacity: 0.3;
    }
    .label-information:hover{
        opacity: 1;
    }
</style>