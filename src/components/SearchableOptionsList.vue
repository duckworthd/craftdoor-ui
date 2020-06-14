<!-- A list of options and a search bar.

This component provides a searchable table of options. Users can
use the search bar to filter the list of available options. When
the user clicks on an option, the 'selected' prop is updated.

Props:
  options: Array<Option>. List of valid options to choose form.
  selected: Option | null.  Currently selected option.

Usage:

```
<template>
  <searchable-options-list
    v-bind:options="availableOptions"
    v-bind:selected.sync="selectedOption">
  </searchable-options-list>
</template>

<script lang="ts">
  import SearchableOptionsList, { Option } from "@/components/SearchableOptionsList.vue";

  @Component({
    components: { SearchableOptionsList }
  })
  class People extends Vue {
    availableOptions: Array<Option> = [
      {id: 1, name: 'one'},
      {id: 2, name: 'two'},
      {id: 4, name: 'four'},
    ];
    selectedOption: (Option | null) = null;

    @Watch('selectedOption')
    onSelectedOption(value: Option) {
      ...
    }
  }
</script>
```

-->

<template>
  <div class="searchable-options-list text-left">
    <div class="search-bar">
      <input v-model="query" placeholder="Search">
    </div>
    <div class="options-list">
      <ul>
      <li v-for="option in filteredOptions"
          v-on:click="updateSelected(option)"
          :key="option.id">
          {{ option.name }}
      </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

// A single element in 'options'.
export interface Option {
  id: number;
  name: string;
}

@Component({
  props: {
    options: Array,
    selected: Object,
  }
})
export default class SearchableOptionsList extends Vue {
  // Current search query.
  query = "";

  // All availalbe options to be selected.
  options!: Array<Option>;

  // Currently selected object.
  selected!: Option | null;

  // Apply 'filter' to 'options'. Returns the subset that matches.
  get filteredOptions() {
    if (this.query == "") {
      return this.options;
    }

    const filter = this.query;
    const shouldKeep = function(option: any) {
      return option.name.includes(filter);
    }

    return this.options.filter(shouldKeep)
  }

  // Update 'selected' prop. Use v-bind:selected.sync="<variable>" to track its value.
  updateSelected(option: Option) {
    this.$emit('update:selected', option);
  }

}
</script>

<style scoped lang="scss">
</style>
