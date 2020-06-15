<template>
  <div class="people-view container">
    <craftdoor-vue v-bind:api="api"
        v-bind:selected-entity-details.sync="selectedEntityDetails">
      <div class="details-panel" v-if="selectedEntityDetails != null">
        <details-box-form 
              title="Info"
              v-bind:fields="selectedEntityDetails.info">
        </details-box-form>
        <details-box-checkboxes 
            title="Roles" 
            v-bind:fields="selectedEntityDetails.roles">
        </details-box-checkboxes>
        <details-box-checkboxes 
            title="Keys"
            v-bind:fields="selectedEntityDetails.keys">
        </details-box-checkboxes>
      </div>
    </craftdoor-vue>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Member, MemberDetails } from "@/interfaces/api";
import CraftdoorVue, { EntityApi } from "@/components/Craftdoor.vue";
import DetailsBoxForm from "@/components/DetailsBoxForm.vue";
import DetailsBoxCheckboxes from "@/components/DetailsBoxCheckboxes.vue";
import MemberHelper from "@/helpers/members.helper";

class MembersApi implements EntityApi {
  getDetails(memberId: number): Promise<MemberDetails> {
    return MemberHelper.getMemberDetails(memberId);
  }

  list(): Promise<Array<Member>> {
    return MemberHelper.listMembers();
  }

  newEmptyDetails(): Promise<MemberDetails> {
    return MemberHelper.newEmptyMemberDetails();
  }

  insertDetails(memberDetails: MemberDetails): Promise<MemberDetails> {
    return MemberHelper.insertMemberDetails(memberDetails);
  }

  updateDetails(memberDetails: MemberDetails): Promise<MemberDetails> {
    return MemberHelper.updateMemberDetails(memberDetails);
  }

  delete(memberId: number): Promise<MemberDetails> {
    return MemberHelper.deleteMember(memberId);
  }

  simplifyDetails(memberDetails: MemberDetails): Member {
    return MemberHelper.simplifyMemberDetails(memberDetails);
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
  selectedEntityDetails: MemberDetails | null = null;

  // Interface to backend.
  api = new MembersApi()
}
</script>

<style scoped lang="scss">
</style>