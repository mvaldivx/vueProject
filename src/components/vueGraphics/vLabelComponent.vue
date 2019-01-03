<template>
    <transition name="fade">
        <svg
            v-if="mShow"
            :y="cY"
            :x="cX"
            :width="cWidth + mMarginX" 
            :height="cHeight + mMarginY" >
              <rect 
                  :x="0"
                  :y="mMarginY"
                  :width="cWidth" 
                  :height="cHeight"
                  :stroke="(cBorderColor != null && showBorder )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                  :stroke-width="(cBorderColor != null && showBorder)?2:0"
                  :fill="(cBackColor != null )?'rgb(' + cBackColor.rgb + ')':'transparent'"  />
              <text 
                  :x="cXText" 
                  :y="cYText"
                  :font-size="cFontSize"
                  :fill="'rgb(' + cForeColor.rgb + ')'"
                  v-html="cText"
                  ></text>
              <g v-if="showCloser" @click="onClickClose">
                <circle 
                  :cx="cWidth-2" 
                  :cy="mMarginY+2" 
                  :r="mMarginX" 
                  :stroke="(cBorderColor != null )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                  :stroke-width="(cBorderColor != null )?1:0" 
                  :fill="(cBackColor != null )?'rgb(' + cBackColor.rgb + ')':'transparent'"
                  />
                  <line 
                    :x1="cWidth  - mMarginX + 3" 
                    :y1="6" 
                    :x2="cWidth  + mMarginX - 7" 
                    :y2="2*mMarginY-2" 
                    :stroke="(cBorderColor != null )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                    :stroke-width="(cBorderColor != null )?1:0"  
                  />
                  <line 
                    :x1="cWidth  - mMarginX + 3" 
                    :y1="2*mMarginY-2" 
                    :x2="cWidth  + mMarginX - 7" 
                    :y2="6" 
                    :stroke="(cBorderColor != null )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                    :stroke-width="(cBorderColor != null )?1:0"  
                  />
              </g>
        </svg>
    </transition>
</template>
<script type="text/babel">
    export default {
        props: {
          /** @description indica si el componente calcula su tamaño de forma automatica */
          autoSize:{ type: Boolean , default : true },
          /** @description indica si se muestra el control para ocultar la etiqueta o no */
          showCloser:{ type:Boolean , default: false},
          /** @description Si se quiere colocar un elemento personalizado, se puede enviar por este medio la configuracion */
          custome : { type: Object , default: null },
          /** @description Nombre que se le dara al componente para ser buscado por el padre posteriomente */
          name   : { type:String , default: "vueLabelComponent" } ,
          /** @description texto que mostrar la etiqueta */
          text  : { type:String , default: "#{Value}" },
          /** @description Color de fondo de la etiqueta */
          backColor: { type:Object , default: null},
          /** @description Color del borde de la etiqueta */
          borderColor: { type:Object , default: null},
          /** @description Color de la fuente de la etiqueta */
          foreColor: { type:Object , default:null},
          /** @description tamaño de la letra para la etiqueta */
          fontSize : { type: Number, default: 12 },
          /** @description ancho de la componente */
          height : { type:Number , default: 200 } ,
          /** @description alto de la componente */
          width  : { type:Number , default: 200 } ,
          /** @description Indica si se muestra el componente o no */
          show   : { type:Boolean , default: true } ,
          /** @description Limite maximo donde se puede colocar el elemento.
           * Sirve para evitar que salta de una area maxima delimitada en el eje X
           */
          limitMaxX : { type:Number , default: -1 } ,
          /** @description Limite maximo donde se puede colocar el elemento.
           * Sirve para evitar que salta de una area minima delimitada en el eje X
           */
          limitMinX : { type:Number , default: -1 } ,
          /** @description Limite maximo donde se puede colocar el elemento.
           * Sirve para evitar que salta de una area maxima delimitada en el eje Y
           */
          limitMaxY : { type:Number , default: -1 } ,
          /** @description Limite maximo donde se puede colocar el elemento.
           * Sirve para evitar que salta de una area minima delimitada en el eje Y
           */
          limitMinY : { type:Number , default: -1 } ,
          /** @description Forza al componente a tomar la posicion indicada, pasando los limites establecidos.
           * Esto sirve para evitar que los elementos se salgan del area visible o se interpongan con otros
           */
          forzeLocation : { type:Boolean , default: true } ,
          /** @description posicion que tomara en el eje X */
          x      : { type:Number , default: 0 } ,
          /** @description posicion que tomara en el eje Y */
          y      : { type:Number , default: 0 } ,
          /** @description orienta el texto segun la posicion data.
           * Si el valor es negativo, lo orienta al lado izquierdo del punto de origen.
           * Si el valor es positivo lo orienta al lado derecho del punto de origen.
           * Si el valor es cero, lo alinea al centro del punto
           */
          orientationX : { type:Number , default: 0 },
          /** @description orienta el texto segun la posicion data.
           * Si el valor es negativo, lo orienta sobre del punto de origen.
           * Si el valor es positivo lo orienta debajo derecho del punto de origen.
           * Si el valor es cero, lo alinea al centro del punto
           */
          orientationY : { type:Number , default: 0 },
          /** @description Indica si muestra el border */
          showBorder: { type:Boolean , default: false}

        },  
        data(){
            return {
              mMarginX: 8 ,
              mMarginY: 8 ,

              mShow: this.show,
              mBackColor: this.backColor,
              mBorderColor: this.borderColor,
              mForeColor: this.foreColor,
              mFontSize: this.fontSize,
              
              mY: this.y,
              mX: this.x,
              mXAnimate : this.x ,
              mYAnimate : this.y ,

              mW: this.width,
              mH: this.height,
              mText: this.text,
            };
        },
        computed:{
          cX(){
            var location_x = this.mXAnimate + this.cOrientationX - this.mMarginX;
            var total_width = this.cWidth + this.mMarginX;
            if( this.forzeLocation || 
              (((location_x + total_width) <= this.limitMaxX) && ((location_x) >= this.limitMinX)) ){
              return location_x;
            }
            if( (location_x + total_width) > this.limitMaxX ){
              return this.limitMaxX - total_width ;
            }
            if( (location_x) < this.limitMinX ){
              return this.limitMinX  ;
            }
            return location_x;
          },
          cY(){
            var location_y = this.mYAnimate + this.cOrientationY - this.mMarginY;
            var total_height = this.cHeight + this.mMarginY;
            if( this.forzeLocation || 
              (((location_y + total_height) <= this.limitMaxY) && 
              ((location_y + total_height) >= this.limitMinY)) ){
              return location_y;
            }
            if( (location_y + total_height) > this.limitMaxY ){
              return this.limitMaxY - total_height ;
            }
            if( (location_y + total_height) < this.limitMinY ){
              return this.limitMinY + total_height ;
            }
            return location_y;
          },
          cOrientationY(){
            if( this.orientationY < 0 ){
              return -this.cHeight;
            }
            if( this.orientationY > 0 ){
              return 0 ;
            }
            return -this.cHeight / 2 ;
          },
          cOrientationX(){
            if( this.orientationX < 0 ){
              return -this.cWidth;
            }
            if( this.orientationX > 0 ){
              return 0;
            }
            return -this.cWidth / 2 ;
          },
          cWidth(){
            if( this.autoSize ){
              return this.cTextWidth + 20;
            }
            return this.mW;
          },
          cHeight(){
            if( this.autoSize ){
              return this.cTextHeight + 10;
            }
            return this.mH;
          },
          cTextWidth(){
            return this.cMaxTextLength * (this.cFontSize/2 );
          },
          cTextHeight(){
              var words_line = this.mText.split("\n")
              return this.cFontSize * words_line.length;
          },
          cMaxTextLength(){
            var words_line = this.mText.split("\n");
            var max_word_length = 0;
            for(var i = 0 ; i < words_line.length ; i++ ){
              if( max_word_length < words_line[i].length ){
                max_word_length = words_line[i].length;
              }
            }
            return max_word_length;
          },
          cBackColor(){
            return this.mBackColor;
          },
          cForeColor(){
            if( this.mForeColor == null ){
              if(this.mBackColor == null){
                var foreColor = { r: 0,g: 0, b: 0 , rgb:'0,0,0'};
                return foreColor;
              }
              var cR = this.mBackColor.r;
              var cG = this.mBackColor.g;
              var cB = this.mBackColor.b;
              if(cR + cG + cB < 300 ){
                var foreColor = { r: 255,g: 255, b: 255 , rgb:'255,255,255'};
                return foreColor;
              }
              var foreColor = { r: 0,g: 0, b: 0 , rgb:'0,0,0'};
              return foreColor;
            }
            return this.mForeColor;
          },
          cBorderColor(){
            if( this.mBorderColor == null ){
              if(this.mBackColor == null){
                return null;
              }
              var cR = parseInt(this.mBackColor.r - this.mBackColor.r * 0.2);
              var cG = parseInt(this.mBackColor.g - this.mBackColor.g * 0.2);
              var cB = parseInt(this.mBackColor.b - this.mBackColor.b * 0.2);
              var borderColor = { r: cR ,g: cG , b: cB, rgb: cR + "," + cG + "," + cB };
              return borderColor;
            }
            return this.mBorderColor;
          },
          cFontSize(){
            return this.mFontSize;
          },
          cYText(){
            return ( this.cHeight - this.cTextHeight ) / 2 + this.mMarginY/2;
          },
          cXText(){
            return ( this.cWidth - this.cTextWidth ) / 2;
          },
          cText(){
            var tSPAN_str ="";
            var words_line = this.mText.split("\n");
            for( var i = 0 ; i < words_line.length ; i++ ){
              tSPAN_str += "<tspan x='"+this.cXText+"' dy='"+ (1 + this.cFontSize)+"'>"+words_line[i]+"</tspan>";
            }
            return tSPAN_str;
          }
        },  
        watch: {
            mX: function(newValue, oldValue) {
                this.animateTween( oldValue, newValue , "mXAnimate" );
            },
            mY: function(newValue, oldValue) {
                this.animateTween( oldValue, newValue , "mYAnimate" );
            }
        },
        methods:{
          onClickClose(){
            this.mShow = false;
          },
          setShow( value ){
            this.mShow = value;
          },
          setText(value ){
            this.mText = value;
          },
          setLocation( value ){
            this.mX = value.x ;
            this.mY = value.y ;
          },
          setBackColor( value ){
            this.mBackColor = value ;
          },
          /** */
          animateTween: function ( startValue, endValue , attribute ) {
              var vm = this
              function animate () {
                  if (TWEEN.update()) {
                  requestAnimationFrame(animate)
                  }
              }
              var objectEnd = {};
              var objectStart = {};
              objectStart[ attribute ] = startValue ;
              objectEnd[ attribute ] = endValue ;
              new TWEEN.Tween(objectStart )
                  .to(objectEnd, 300)
                  .onUpdate(function (object) { 
                      vm[attribute] = startValue * (1-object) + endValue * object;
                  })
                  .start()

              animate()
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