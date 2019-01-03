<template>
  <v-progress-linear 
    v-bind:active="progressbar" 
    :indeterminate="progressbar" 
    :color ="'grey lighten-2'"
  ></v-progress-linear>
</template>
<script>
import Store from './store'

export default {
  name: 'progressbar',

  computed : {
    progressbar: function () {
        return Store.state.progressbar
    },
  }
}
</script>

<style>
 .progress-linear{
     margin: 0rem 0;
     z-index: 100;
     position: fixed;
 }
</style>
