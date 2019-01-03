<template>
    <transition name="fade">
        <svg
            v-if="mShow"
            :y="cY"
            :x="cX">
              <polygon 
                v-if="emblemType == 1"
                v-on:mouseout="onMouseOut"
                v-on:mouseenter="onMouseEnter"
                :stroke="(cBorderColor != null && showBorder )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                :stroke-width="(cBorderColor != null && showBorder)?1:0"
                :style="(cBackColor != null )?'fill:rgba(' + cBackColor.rgb + ',0.8)':'transparent'"  
                points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" />
              <circle 
                v-if="emblemType == 2"
                v-on:mouseout="onMouseOut"
                v-on:mouseenter="onMouseEnter"
                :stroke="(cBorderColor != null && showBorder )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                :stroke-width="(cBorderColor != null && showBorder)?1:0"
                :style="(cBackColor != null )?'fill:rgba(' + cBackColor.rgb + ',0.8)':'transparent'"  
                cx="10" 
                cy="12.5" 
                r="7"/>
              <rect 
                v-if="emblemType == 3"
                v-on:mouseout="onMouseOut"
                v-on:mouseenter="onMouseEnter"
                :stroke="(cBorderColor != null && showBorder )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                :stroke-width="(cBorderColor != null && showBorder)?1:0"
                :style="(cBackColor != null )?'fill:rgba(' + cBackColor.rgb + ',0.8)':'transparent'"  
                :x="5" 
                :y="5"
                :width="10" 
                :height="10"
                />
              <path 
                v-if="emblemType == 4"
                v-on:mouseout="onMouseOut"
                v-on:mouseenter="onMouseEnter"
                xmlns="http://www.w3.org/2000/svg" 
                :stroke="(cBorderColor != null && showBorder )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                :stroke-width="(cBorderColor != null && showBorder)?1:0"
                :style="(cBackColor != null )?'fill:rgba(' + cBackColor.rgb + ',0.8)':'transparent'"  
                d="M7 10l5 5 5-5z"/>
              <path 
                v-if="emblemType == 5"
                v-on:mouseout="onMouseOut"
                v-on:mouseenter="onMouseEnter"
                xmlns="http://www.w3.org/2000/svg" 
                :stroke="(cBorderColor != null && showBorder )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                :stroke-width="(cBorderColor != null && showBorder)?1:0"
                :style="(cBackColor != null )?'fill:rgba(' + cBackColor.rgb + ',0.8)':'transparent'"  
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              <path 
                v-if="emblemType == 6"
                v-on:mouseout="onMouseOut"
                v-on:mouseenter="onMouseEnter"
                xmlns="http://www.w3.org/2000/svg" 
                :stroke="(cBorderColor != null && showBorder )?'rgb(' + cBorderColor.rgb + ')':'transparent'"
                :stroke-width="(cBorderColor != null && showBorder)?1:0"
                :style="(cBackColor != null )?'fill:rgba(' + cBackColor.rgb + ',0.8)':'transparent'"  
                d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                <g 
                  v-if="emblemType == -1"
                  v-html="customeSVG"
                  ></g>
        </svg>
    </transition>
</template>
<script type="text/babel">
    export default {
        props: {
          /** @description Nombre que se le dara al componente para ser buscado por el padre posteriomente */
          name   : { type:String , default: "vueEmblemComponent" } ,
          /** @description */
          customeSVG : { type:String, default: null },
          /** @description Color de fondo de la etiqueta */
          backColor: { type:Object , default: null},
          /** @description Color del borde de la etiqueta */
          borderColor: { type:Object , default: null},
          /** @description ancho de la componente */
          height : { type:Number , default: 20 } ,
          /** @description alto de la componente */
          width  : { type:Number , default: 20 } ,
          /** @description Indica si se muestra el componente o no */
          show   : { type:Boolean , default: true } ,
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
          showBorder: { type:Boolean , default: false},
          /** @description define el tipo de emblema o icono que se mostrara  */
          emblemType : { type: Number, default: 0 },
          order      : { type:Number , default: -1 } 
          

        },  
        data(){
            return {
              mMarginX: 0 ,
              mMarginY: 0 ,

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
            return location_x;
          },
          cY(){
            var location_y = this.mYAnimate + this.cOrientationY - this.mMarginY;
            var total_height = this.cHeight + this.mMarginY;
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
            return this.mW;
          },
          cHeight(){
            return this.mH;
          },
          cBackColor(){
            return this.mBackColor;
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
          onMouseOut: function( sender ){
            if( this.cBackColor != null ){
                sender.target.style = "fill:rgba(" + this.cBackColor.rgb + ",0.8);";
              }
              this.$forceUpdate();
          },
          onMouseEnter: function( sender ){
              if( this.cBackColor != null ){
                var cR = parseInt(this.cBackColor.r - this.cBackColor.r * 0.2);
                var cG = parseInt(this.cBackColor.g - this.cBackColor.g * 0.2);
                var cB = parseInt(this.cBackColor.b - this.cBackColor.b * 0.2);
                var color_darker = { r: cR ,g: cG , b: cB, rgb: cR + "," + cG + "," + cB };
                
                sender.target.style = "fill:rgba(" + color_darker.rgb + ",0.8);";
              }              
              this.$emit("onMouseEnter", this ,{ order: this.order , x: this.cX, y: this.cY });
              this.$forceUpdate();
          },
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

            if( isNaN( parseInt( this.mBackColor.r ))){
              var color_RGB = this.mBackColor.rgb.split(",");
              this.mBackColor.r = parseInt( color_RGB[0] );
              this.mBackColor.g = parseInt( color_RGB[1] );
              this.mBackColor.b = parseInt( color_RGB[2] );
            }
        }
    }
</script>
<style scoped>
</style>