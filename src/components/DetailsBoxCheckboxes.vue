<!-- A box with title and checkbox options.

Provides a box with a list of checkboxes, one per field. Each field
has an 'selected' boolean attribute which indicates whether or not
the checkbox should be checked.

'fields' prop is synchronized with v-bind:fields.sync="<variable>".

Props:
  title: Title of box.
  fields: List of checkbox items.

-->
<template>
  <div class="details-box col-md-12 mt-3 mb-3 pt-3 pb-3 border rounded">
    <div class="details-box-title row pl-3 mb-3">
      <div class="col-md-2 border-bottom">
        <h1 class="h4">{{ title }}</h1>
      </div>
    </div>
    <div class="details-box-properties row pl-3">
      <div class="details-box-details text-left">
        <div class="details-box-property col-md-12 form-check" 
            v-for="field in fields" 
            :key="title + '-' + field.id + '-' + field.name">
          <input class="form-check-input" 
              type="checkbox" 
              v-bind:name="field.id"
              v-model="field.selected"
              v-on:click="updateFields"
              :disabled="!field.editable">
          <label class="form-check-label"
              v-bind:for="field.id">
            {{ field.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

export interface Field {
  // Unique identifier for this field. Must be unique across all elements of
  // 'fields'.
  id: number;

  // Human-readable name for this checkbox.
  name: string;

  // Whether or not this box is checked.
  selected: boolean;
}

@Component({
  props: {
    title: String,
    fields: Array
  }
})
export default class DetailsBoxCheckboxes extends Vue {
  title!: string
  fields!: Array<Field>

  // Update 'v-bind:fields.sync=<variable>'.
  updateFields() {
    this.$emit('update:fields', this.fields);
  }
}
</script>

<style scoped lang="scss">
</style>
