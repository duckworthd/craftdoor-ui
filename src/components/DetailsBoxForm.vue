<template>
  <div class="details-box col-md-12 border rounded">
    <div class="details-box-title row pl-3">
      <div class="col-md-2 border-bottom mb-3">
        <h1 class="h4">{{ title }}</h1>
      </div>
    </div>
    <div class="details-box-properties row pl-3">
      <table class="table">
        <tbody>
          <tr
              v-for="field in fields" 
              :key="field.id + '-' + field.name">
            <td>
              <label v-bind:for="field.name">{{ field.name }}</label>
            </td>
            <td>
              <input type="text" 
                  v-bind:name="field.name" 
                  v-model="field.value"
                  v-on:keyup="updateFields" 
                  v-bind:readonly="!field.editable">
            </td>
          </tr>
        </tbody>
      </table>
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
export default class DetailsBoxForm extends Vue {
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

