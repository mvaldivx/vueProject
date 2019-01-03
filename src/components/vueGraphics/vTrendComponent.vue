<template>
    <transition name="fade">
        <g v-if="show">
            <rect 
                stroke-width="2"
                :x="cXAnimate + 2" 
                :y="( cYAnimate - cHeightAnimate - 1 )"
                v-on:mouseout="onMouseOut"
                v-on:mouseenter="onMouseEnter"
                @click="onClick"
                :width="cWidthAnimate - 1" 
                :height="cHeightAnimate" 
                :style="'fill:rgba(' + cColor.rgb + ',0.7);'"
                :stroke="'rgb(' + cColor.rgb + ')'" />
        </g>
    </transition>
</template>
<script type="text/babel">
    export default {
        props: {
            /** @description propiedad ligada al numero de columna que se han dibujado antes de la actual */
             order      : { type:Number , default: -1 } ,
             /** @description valor que se grafico en la columna */
             value      : { type:Number , default: -1 } ,
             /** @description categoria a la que pertenece la columna */
             category  : { type:Object , default: null } ,
             /** @description serie del cual se tomo el valor */
             serie      : { type:Object , default: null } ,

            /* Nombre que se le dara al componente para ser buscado por el padre posteriomente */
             name   : { type:String , default: "vueTrendComponent" } ,
             label  : { type:String , default: "" },
             height : { type:Number , default: 100 } ,
             width  : { type:Number , default: 100 } ,
             showLabel  : { type:Boolean , default: false } ,
             show   : { type:Boolean , default: true } ,
             x      : { type:Number , default: 0 } ,
             y      : { type:Number , default: 0 } ,
             color  : { type:Object , default: function(){ return { r: 50, g: 170, b: 75 , rgb: "50,170,75" }} } ,
        },  
        data() {
            return { 
                mShow: this.showLabel ,
                mHeightAnimate : this.height ,
                mWidthAnimate : this.width   ,
                mXAnimate : this.x   ,
                mYAnimate : this.y ,

                mX : this.x,
                mY : this.y,

                mHeight : this.height,
                mWidth  : this.width,
                mColor  : this.color 
            };
        },
        computed:{
            cColor(){
                return this.mColor;
            },
            cWidthAnimate(){
                return this.mWidthAnimate;
            },
            cHeightAnimate(){
                return this.mHeightAnimate;
            },
            cXAnimate(){
                return this.mXAnimate;
            },
            cYAnimate(){
                return this.mYAnimate;
            }
        },  
        watch: {
            mWidth: function(newValue, oldValue) {
                this.animateTween( oldValue, newValue , "mWidthAnimate");
            },
            mHeight: function(newValue, oldValue) {
                this.animateTween( oldValue, newValue , "mHeightAnimate" );
            },
            mX: function(newValue, oldValue) {
                this.animateTween( oldValue, newValue , "mXAnimate" );
            },
            mY: function(newValue, oldValue) {
                this.animateTween( oldValue, newValue , "mYAnimate" );
            }
        },
        methods:{
            getLocation(){
                return { x: this.mXAnimate , y: this.mYAnimate }
            },
            /** */
            onMouseOver: function(){
            },
            onMouseOut: function( sender ){
                sender.target.style = "fill:rgba(" + this.mColor.rgb + ",0.7);";
                this.$emit("onMouseOut", this );
                this.$forceUpdate();
            },
            onClick: function(){
                this.mShow = !this.mShow;
                this.$emit("onClick", this );
            },
            onMouseEnter: function( sender ){
                sender.target.style = "fill:rgba(" + this.mColor.rgb + ",0.9);";
                this.$emit("onMouseEnter", this );
                this.$forceUpdate();
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
                    .to(objectEnd, 500)
                    .onUpdate(function (object) {
                        vm[attribute] = endValue * object;
                    })
                    .start()

                animate()
            }
        },
        created(){
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
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>