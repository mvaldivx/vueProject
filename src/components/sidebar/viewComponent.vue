<template>
    <div id="sidebar">
        <v-layout>
            <v-navigation-drawer
                stateless 
                hide-overlay
                :value="drawer"
                :mini-variant="mini"
                :dark="true" 
                class="drawer-sidebar"
                :class="{'sidebar-mode-mini': mini}"
                v-fancy-scroll="configFancyScroll"
                :app="true"
            >
                <v-btn
                    class="btn-closer-sidebar"
                    small fixed right icon fab
                    title="Esconder menú" 
                    @click="hideSidebar"
                >
                    <v-icon>close</v-icon>
                </v-btn>
                <v-list class="pa-1">
                    <v-list-tile avatar tag="div">
                        <v-list-tile-avatar>
                            <v-icon x-large>account_circle</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content class="content-title" :class="{ 'vertical-text': mini }">
                            <v-list-tile-title>{{usuario}}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn 
                                icon 
                                v-on:click.stop="mini = !mini" 
                                @click="hideMiniSidebar()"
                                title="Mostrar solo íconos"
                            >
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>

                <v-list>
                    <template v-for="item in Menu" v-if="itemHasPermission(item)">
                        <!-- first level in case item has childs -->
                        <v-list-group v-if="item.items"
                            :key="item.title"
                            :append-icon="mini ? 'arrow_drop_down':'keyboard_arrow_down'"
                            class="parent-item first-level-group"
                        >
                            <v-tooltip right slot="prependIcon">
                                <v-icon slot="activator">{{item.icon}}</v-icon>
                                <span>{{item.title}}</span>
                            </v-tooltip>
                            <v-list-tile slot="activator" :to="item.path">
                                <v-list-tile-content >
                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <template v-for="subItem in item.items"
                                      v-if="itemHasPermission(subItem)"
                            >
                                <!-- second level in case item has childs -->
                                <v-list-group v-if="subItem.items"
                                              :key="subItem.title"
                                              :append-icon="'keyboard_arrow_down'"
                                              class="parent-item second-level-group"
                                              no-action
                                              sub-group
                                >
                                    <v-tooltip right slot="prependIcon">
                                        <v-icon slot="activator">{{subItem.icon}}</v-icon>
                                        <span>{{subItem.title}}</span>
                                    </v-tooltip>
                                    <v-list-tile slot="activator" :to="subItem.path">
                                        <v-list-tile-content >
                                                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                    
                                    <!-- third level in case only exist one item -->
                                    <template v-for="subSubItem in subItem.items"
                                              v-if="itemHasPermission(subSubItem)"
                                    >
                                        <v-list-tile :key="subSubItem.title"
                                                     :to="subSubItem.path"
                                                     class="third-level-single"
                                        >
                                            <v-list-tile-content>
                                                <v-list-tile-title>
                                                    {{ subSubItem.title }}
                                                </v-list-tile-title>
                                            </v-list-tile-content>
                                            <v-tooltip right>
                                                <v-list-tile-action slot="activator">
                                                    <v-icon>{{ subSubItem.icon }}</v-icon>
                                                </v-list-tile-action>
                                                <span>{{subSubItem.title}}</span>
                                            </v-tooltip>
                                        </v-list-tile>
                                    </template>
                                </v-list-group>
                                
                                <!-- second level in case only exist one item -->
                                <v-list-tile v-else 
                                             :key="subItem.title"
                                             :to="subItem.path"
                                             class="second-level-single"
                                >
                                    <v-tooltip right>
                                        <v-list-tile-action slot="activator">
                                            <v-icon>{{ subItem.icon }}</v-icon>
                                        </v-list-tile-action>
                                        <span>{{subItem.title}}</span>
                                    </v-tooltip>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            {{ subItem.title }}
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </template>
                        </v-list-group>
                        <!-- first level in case only exist one item -->
                        <v-list-tile v-else 
                                     :key="item.title" 
                                     :to="item.path"
                                     class="first-level-single"
                        >
                            <v-tooltip right>
                                <v-list-tile-action slot="activator">
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-list-tile-action>
                                <span>{{item.title}}</span>
                            </v-tooltip>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.title }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-navigation-drawer>
        </v-layout>
    </div>
</template>

<script>
    import Axios            from 'axios'
    import Store            from './store'
    import Menu             from 'User/menu'
    import authUserMenu     from 'App/auth/userMenu'

    export default {
        name: 'sidebar',

        data: function() {
            return {
                right: null,
                configFancyScroll: {config:{suppressScrollX: true}}
            }
        },

        methods: {
            showSidebar: () => Store.commit('showMiniSidebar', false),

            hideMiniSidebar: () => Store.commit('showMiniSidebar', true),

            hideSidebar: () => Store.commit('toogleDrawer'),

            itemHasPermission: (item) => authUserMenu.itemHasPermission(item)
        },

        computed: {
            prefSizeScreen() {
                return this.$vuetify.breakpoint.name
            },

            usuario:function(){
                if(this.$store.state.user!=null)
                    return this.$store.state.user.nombres +" "+this.$store.state.user.apellidos  
                return ""
            },

            drawer: () => Store.state.drawer,

            Menu: () => Menu,

            mini: {
                get: () => Store.state.mini,
                set: val => Store.commit('showMiniSidebar', val)
            }
        },

        watch: {
            prefSizeScreen: (newVal, oldVal) =>
                Store.commit('setDrawer', !_.includes('xs sm'.split(' '), newVal))
        }
    }
</script>

<style lang="scss">
.btn-closer-sidebar {
    width:20px !important;
    height:25px !important;
    right: 0px;
    position: absolute !important;
}

.drawer-sidebar {
    &.sidebar-mode-mini {
        .list__group {
            .list__group__header__append-icon {
                position: absolute;
                left: -13px;
            }
        }

        .third-level-single {
            .list__tile {
                padding-left: 30px;
            }
        }
    }

    background-color: #2d323e !important;
    padding-bottom: 0;
    z-index: 9;
    .content-title {
        transition: all 0.4s ease;
        &.vertical-text {
            opacity: 1;
            display: inline-block;
            min-width: initial;
            transform: rotate(90deg) translate(248px, 195px);
            width: 454px;
            position: absolute;
        }
    }

    .second-level-group {
        .list__group__header {
            &--active {
                &,
                &:hover {
                    border: 1px solid rgba(0, 100, 200, 1);
                    i {
                        color: rgba(0, 100, 200, 1) !important;
                    }
                }
            }
        }
    }

    .parent-item {
        &.second-level {
            .list__tile {
                padding-left: 15px;
            }
        }

        .list__group__items {
            background-color: rgba(250, 250, 250, .8);
            .list__tile--active {
                border: 1px solid rgba(0, 100, 250, .9);
               i,
               .list__tile__title {
                    color: rgba(0, 100, 250, 1);
               }
            }

            .icon, .list__tile__title {
                color: black;
            }
        }
    }
}
</style>