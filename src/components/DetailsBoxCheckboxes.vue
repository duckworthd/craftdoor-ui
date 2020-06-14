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
              v-on:click="updateFields">
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
  name: string;
  value: any;
  editable: boolean;
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
