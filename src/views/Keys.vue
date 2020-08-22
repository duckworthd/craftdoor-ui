<template>
  <div class="key-view container">
    <craftdoor-vue v-bind:api="api"
        v-bind:selected-entity-details.sync="selectedEntityDetails">
      <div class="details-panel" v-if="selectedEntityDetails != null">
        <details-box-form 
              title="Info"
              v-bind:fields.sync="selectedEntityDetails.info">
        </details-box-form>
        <details-box-checkboxes 
            title="Members"
            v-bind:fields.sync="selectedEntityDetails.members">
        </details-box-checkboxes>
      </div>
    </craftdoor-vue>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Key, KeyDetails } from "@/interfaces/api";
import CraftdoorVue, { EntityApi } from "@/components/Craftdoor.vue";
import DetailsBoxForm from "@/components/DetailsBoxForm.vue";
import DetailsBoxCheckboxes from "@/components/DetailsBoxCheckboxes.vue";
import KeyHelper from "@/helpers/keys.helper";

class KeysApi implements EntityApi {
  details(id: number): Promise<KeyDetails> {
    return KeyHelper.details(id);
  }

  list(): Promise<Array<Key>> {
    return KeyHelper.list();
  }

  empty(): Promise<KeyDetails> {
    return KeyHelper.empty();
  }

  insert(details: KeyDetails): Promise<KeyDetails> {
    return KeyHelper.insert(details);
  }

  update(details: KeyDetails): Promise<KeyDetails> {
    return KeyHelper.update(details);
  }

  delete(id: number): Promise<KeyDetails> {
    return KeyHelper.delete(id);
  }

  simplify(details: KeyDetails): Key {
    return KeyHelper.simplify(details);
  }
}

@Component({
  components: { 
    CraftdoorVue,
    DetailsBoxForm, 
    DetailsBoxCheckboxes,
  }
})
export default class PeopleVue extends Vue {
  // Details of currently selected entity shown on RHS.
  selectedEntityDetails: KeyDetails | null = null;

  // Interface to backend.
  api = new KeysApi()
}
</script>

<style scoped lang="scss">
</style>