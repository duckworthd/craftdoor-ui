<template>
  <div class="search-bar text-left">
      <input v-model="internalQuery" 
        placeholder="Search"
        v-on:keyup="$emit('update:query', internalQuery)">
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  props: {
    query: String
  }
})
export default class SearchBar extends Vue {
  query!: string
  
  // Mirrored version of props.query. This value will be directly edited by the user.
  // Its value is accessible if one use v-bind:query.sync="<variable name>".
  internalQuery = "" as string;

  data() { 
    return {
      internalQuery: this.query
    }
  }
}
</script>

<style scoped lang="scss">
</style>
