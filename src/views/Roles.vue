<template>
  <div class="roles-view container">
    <craftdoor-vue v-bind:api="api"
        v-bind:selected-entity-details.sync="selectedEntityDetails">
      <div class="details-panel" v-if="selectedEntityDetails != null">
        <details-box-form 
              title="Info"
              v-bind:fields="selectedEntityDetails.info">
        </details-box-form>
        <details-box-checkboxes 
            title="Doors"
            v-bind:fields="selectedEntityDetails.doors">
        </details-box-checkboxes>
        <details-box-checkboxes 
            title="People" 
            v-bind:fields="selectedEntityDetails.people">
        </details-box-checkboxes>
      </div>
    </craftdoor-vue>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Role, RoleDetails } from "@/interfaces/api";
import CraftdoorVue, { EntityApi } from "@/components/Craftdoor.vue";
import DetailsBoxForm from "@/components/DetailsBoxForm.vue";
import DetailsBoxCheckboxes from "@/components/DetailsBoxCheckboxes.vue";
import RoleHelper from "@/helpers/roles.helper";

class RolesApi implements EntityApi {
  getDetails(id: number): Promise<RoleDetails> {
    return RoleHelper.getDetails(id);
  }

  list(): Promise<Array<Role>> {
    return RoleHelper.list();
  }

  newEmptyDetails(): Promise<RoleDetails> {
    return RoleHelper.newEmptyDetails();
  }

  insertDetails(details: RoleDetails): Promise<RoleDetails> {
    return RoleHelper.insertDetails(details);
  }

  updateDetails(details: RoleDetails): Promise<RoleDetails> {
    return RoleHelper.updateDetails(details);
  }

  delete(id: number): Promise<RoleDetails> {
    return RoleHelper.delete(id);
  }

  simplifyDetails(details: RoleDetails): Role {
    return RoleHelper.simplifyDetails(details);
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
  selectedEntityDetails: RoleDetails | null = null;

  // Interface to backend.
  api = new RolesApi()
}
</script>

<style scoped lang="scss">
</style>