<template>
  <div class="people-view container">
    <div class="control-menu row">
      <!-- Spacing -->
      <div class="col-md-8"></div>

      <!-- Buttons at the very top of the view. -->
      <div class="col-md-4">
        <button type="button"
            v-on:click="createNewMember">
          New
        </button>
        <button type="button" 
            v-on:click="syncSelectedMember">
          Update
        </button>
        <button type="button" 
            v-on:click="deleteSelectedMember">
          Delete
        </button>
      </div>
    </div>

    <div class="row">
      <!-- Left-hand side menu for choosing a person. -->
      <div class="options-panel col-md-3">
        <search-bar 
          v-bind:query.sync="searchQuery"
          ></search-bar>
        <options-list
            v-bind:filter="searchQuery"
            v-bind:options="members"
            v-bind:selected.sync="selectedMember">
        </options-list>
      </div>

      <!-- Right-hand side details view for a person. -->
      <div class="details-panel col-md-9">
        <div class="details-panel" v-if="selectedMemberDetails != null">
          <details-box-form 
              title="Info"
              v-bind:fields.sync="selectedMemberDetails.info">
          </details-box-form>
          <details-box-checkboxes 
              title="Roles" 
              v-bind:fields.sync="selectedMemberDetails.roles">
          </details-box-checkboxes>
          <details-box-checkboxes 
              title="Keys"
              v-bind:fields.sync="selectedMemberDetails.keys">
          </details-box-checkboxes>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Member, MemberDetails } from "@/interfaces/api";
import DetailsBoxForm from "@/components/DetailsBoxForm.vue";
import DetailsBoxCheckboxes from "@/components/DetailsBoxCheckboxes.vue";
import OptionsList from "@/components/OptionsList.vue";
import SearchBar from "@/components/SearchBar.vue";
import MemberHelper from "@/helpers/members.helper";
import _ from 'lodash';

@Component({
  components: { 
    SearchBar, 
    OptionsList, 
    DetailsBoxForm, 
    DetailsBoxCheckboxes,
  }
})
export default class People extends Vue {
  // Search Filter
  //
  // TODO(duckworthd): Bundle search and members list into a single component.
  searchQuery = "";

  // List of all members.
  members: Member[] = [];

  // Details of currently selected member shown on RHS.
  selectedMember: Member | null = null;
  selectedMemberDetails: MemberDetails | null = null;

  // Creates a new, empty person.
  async createNewMember() {
    console.log('newMember()');
    this.selectedMember = null;
    this.selectedMemberDetails = await MemberHelper.newEmptyMemberDetails();
  }

  // Update all properties of selectedMemberDetails with the server.
  async syncSelectedMember() {
    console.log('syncSelectedMember()');
    console.log(JSON.stringify(this.selectedMemberDetails));

    if (this.selectedMemberDetails == null) {
      // TODO(duckworthd): Show an error message if this happens.
      return;
    }

    if (this.selectedMemberDetails.id == null) {
      console.log('This is a new member.');
      return (MemberHelper
          .insertMemberDetails(this.selectedMemberDetails)
          .then(memberDetails => this.setSelectedMemberById(memberDetails.id))
          .then(this.reloadMembers)
          .then(this.reloadSelectedMemberDetails));
    }

    console.log('This is an existing member.');
    return (MemberHelper
        .updateMemberDetails(this.selectedMemberDetails)
        .then(this.reloadMembers)
        .then(this.reloadSelectedMemberDetails));
  }

  async deleteSelectedMember() {
    console.log('deleteSelectedMember()');
    console.log(JSON.stringify(this.selectedMember));
    if (this.selectedMember == null) {
      // TODO(duckworthd): Show an error message if this happens.
      return;
    }

    // TODO(duckworthd): Set selected member to null after successful deletion.
    return (MemberHelper
        .deleteMember(this.selectedMember.id)
        .then(value => this.setSelectedMemberById(null))
        .then(this.reloadMembers)
        .then(this.reloadSelectedMemberDetails));
  }

  async setSelectedMemberById(memberId: number | null) {
    if (memberId == null) {
      this.selectedMember = null;
      return;
    }

    // TODO(duckworthd): Simplify logic for finding the name of a member.
    const memberDetails = await MemberHelper.getMemberDetails(memberId);
    const memberName = MemberHelper.nameFromMemberDetails(memberDetails);
    this.selectedMember = {
      id: memberId,
      name: memberName,
    };
  }

  // Reload list of active members.
  async reloadMembers() {
    console.log('reloadMembers()');
    this.members = await MemberHelper.listMembers();
  }

  // Reload member selected from 'members'.
  @Watch('selectedMember')
  async reloadSelectedMemberDetails() {
    console.log('reloadSelectedMemberDetails()');

    // No member has been selected yet.
    if (this.selectedMember == null) {
      this.selectedMemberDetails = null;
      return;
    }

    // This is a new member that doesn't yet have an id.
    if (this.selectedMember.id == null) {
      this.selectedMemberDetails = null;
      return;
    }

    this.selectedMemberDetails = await MemberHelper.getMemberDetails(this.selectedMember.id);
  }

  // Called by Vue on initialization.
  async mounted() {
    console.log('mounted()')
    await this.reloadMembers();
  }
}
</script>

<style scoped lang="scss">

</style>