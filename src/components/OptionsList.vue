<template>
  <div class="options-list">
    <ul class="text-left">
      <li
          v-for="option in filteredOptions"
          v-on:click="updateSelected(option)"
          :key="option.id">
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

interface Option {
  id: number;
  name: string;
}

// Properties that users can bind to.
const OptionsListProps = Vue.extend({
  props: {
    filter: String,
    options: Array,
    selected: Object,
  }
})

@Component
export default class OptionsList extends OptionsListProps {

  // Apply 'filter' to 'options'. Returns the subset that matches.
  get filteredOptions() {
    if (this.filter == "") {
      return this.options;
    }

    const filter = this.filter;
    const shouldKeep = function(option: any) {
      return option.name.includes(filter);
    }

    return this.options.filter(shouldKeep)
  }

  updateSelected(option: any) {
    this.$emit('update:selected', option);
  }
}
</script>

<style scoped lang="scss">
</style>
