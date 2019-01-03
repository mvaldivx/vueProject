<template>
    <v-snackbar 
        auto-height
        v-model="show" 
        :timeout="timeout"
        :top="x == 'top'" 
        :bottom="x == 'bottom'" 
        :right="y == 'right'"
        :left="y == 'left'"
        :multi-line="mode === 'multi-line'"
        :vertical="mode === 'vertical'"
        :color="color"
    > 
        {{ text }}
        <v-btn flat :color="colorBtnClose" @click.native="show = false">Close</v-btn>
    </v-snackbar>
</template>

<script>
import Store from './store'

export default {
    name: 'snackbar', 
    
    computed: {
        show:  {
            get: function () {
                return Store.state.show;    
            },
            set: function(newValue){
                Store.commit('setShow', newValue)
            }  
        },
        text() {
            return Store.state.text
        },
        timeout(){
            return Store.state.timeout
        },
        mode() {
            return Store.state.mode
        },
        x() {
            return Store.state.x
        },
        y() {
            return Store.state.y
        },
        color() {
            return Store.state.color
        },
        colorBtnClose() {
            return Store.state.colorBtnClose
        }
    }
}
</script>
