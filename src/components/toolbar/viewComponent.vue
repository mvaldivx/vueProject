<template>
    <v-toolbar
        :app="true" 
        color="" 
        dense 
        style="background-color: #262b36; color:#696c74;"
        class="main-toolbar"
        :style="paddingToolbar"
    >
        <v-btn  v-if="!isDrawer" 
                dark 
                icon 
                title="Ver menú" 
                v-on:click.stop="showSidebar"
        >
            <v-icon>menu</v-icon>
        </v-btn>
        <v-btn 
            v-if="isMiniSidebar && isDrawer" 
            dark
            icon
            v-on:click.stop="showMiniSidebar"
        >
            <v-icon>view_list</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-icon dark>{{icon}}</v-icon>
        <v-toolbar-title 
            class="text" 
            style="float:right; font-weight: normal; color:white;"
        >
            {{title}}
        </v-toolbar-title>
    </v-toolbar>
</template>

<script>
    import Store                    from './store'
    import StoreSidebar             from 'Components/sidebar/store'

    export default {
        name: 'toolbar',
        props: ['message'],
        data() {
            return{
                snackbar : {
                    text : '',
                    show: false,
                    color : ''
                },
                minisidebar : false
            }
        },

        methods: {
            showMiniSidebar(){
                StoreSidebar.commit('showMiniSidebar')
            },
        	showSidebar: function(){
                StoreSidebar.commit('toogleDrawer')
            },
            hideSidebar() {
                StoreSidebar.commit('toogleDrawer')
            }
        },

        computed: {
            paddingToolbar() {
                if(!this.isDrawer)
                    return {}
                return { paddingLeft: (this.isMiniSidebar ? this.stylesSidebar.mini.width 
                                                          : this.stylesSidebar.full.width) }
            },

            isDrawer(){
                return StoreSidebar.state.drawer
            },

            isMiniSidebar (){
                return StoreSidebar.state.mini
            },
            
            stylesSidebar: () => StoreSidebar.state.styles,

            progressbar: function () {
                return StoreSidebar.state.progressbar
            },
            shownotification: function () {
                return StoreSidebar.state.notification.show
            },
            textnotification: function () {
                return StoreSidebar.state.notification.text
            },
            title: function () {
                return Store.state.title.toUpperCase()
            },
            icon: function () {
                return Store.state.icon
            },
        }
    }
</script>

<style lang="scss">
 .progress-linear{
     margin: 0rem 0;
     z-index: 100;
     position: fixed;
 }

 .app-wrapper {
     &.md {
         .main-toolbar {
             .pull-button-sidebar {
                 transform: translateX(80px);
             }
         }
     }
 }
</style>