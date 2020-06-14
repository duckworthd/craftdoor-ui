<template>
  <div class="people-view container">
    <div class="control-menu row">
      <!-- Spacing -->
      <div class="col-md-8"></div>

      <!-- Buttons at the very top of the view. -->
      <div class="col-md-4">
        <button type="button"
            v-on:click="newPerson">
          New Person
        </button>
        <button type="button" 
            v-on:click="syncSelectedMemberWithServer">
          Update Person
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
            v-on:selected="updateSelectedMemberPanel">
        </options-list>
      </div>

      <!-- Right-hand side details view for a person. -->
      <div class="details-panel col-md-9">
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
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
  searchQuery = "" as string;

  // List of all members.
  members = [] as Member[];

  // Details of currently selected member shown on RHS.
  selectedMemberDetails = {} as MemberDetails

  // Creates a new, empty person.
  newPerson() {
    // TODO(duckworth): Move logic for constructing a new, empty MemberDetails somewhere else.
    this.selectedMemberDetails = {
      info: [
        {
          field: 'id', 
          name: 'ID', 
          value: 'Not yet assigned', 
          editable: false
        },
        {
          field: 'name', 
          name: 'Name', 
          value: '', 
          editable: true
        },
        {
          field: 'last_seen', 
          name: 'Last Seen', 
          value: "Never", 
          editable: false
        },
      ],
      roles: [
        {id: 1, name: 'Instructor', selected: false},
        {id: 2, name: 'Member', selected: false},
        {id: 3, name: 'Metal Shop', selected: false},
        {id: 4, name: 'Owner', selected: false},
        {id: 5, name: 'Visitor', selected: false},
      ],
      keys: [
        {id: 1, name: '0x12ab34cd', selected: false},
        {id: 1, name: '0xffa18d2a', selected: false},
      ]
    };
  }

  // Update contents of selected member panel.
  async updateSelectedMemberPanel(member: Member) {
    // TODO(duckworthd): Fetch selectedMemberDetails from server.
    this.selectedMemberDetails.info = [
        {
          field: 'id', 
          name: 'ID', 
          value: member.id, 
          editable: false
        },
        {
          field: 'name', 
          name: 'Name', 
          value: member.name, 
          editable: true
        },
        {
          field: 'last_seen', 
          name: 'Last Seen', 
          value: "Jan 1, 1970", 
          editable: false
        },
    ];
  }

  // Update all properties of selectedMemberDetails with the server.
  async syncSelectedMemberWithServer(member: Member) {
    console.log('syncSelectedMemberWithServer()');
    console.log(JSON.stringify(this.selectedMemberDetails, null, '\t'));

    // TODO(duckworthd): If the MemberDetails represents a new person, add that
    // person to the system and update the 

    // TODO(duckworthd): Ask server to update selected member's info.
    // TODO(duckworthd): Reload member list from server.
    this.members = _.cloneDeep(this.members);
    let selectedMemberId = 0;
    for (const detail of this.selectedMemberDetails.info) {
      if (detail.field != 'id') {
        continue;
      }
      selectedMemberId = detail.value as number;
    }
    for (const member of this.members) {
      if (member.id != selectedMemberId) {
        continue;
      }
      for (const detail of this.selectedMemberDetails.info) {
        // TODO(duckworthd): Figure out how to make Typescript OK with this.
        member[detail.field] = detail.value;
      }
    }
  }

  // Reload list of active members.
  async reloadMembers() {
    // TODO(duckworthd): Fetch list of available members from server.
    this.members = [
      {id: 1, name: 'George Harrison'},
      {id: 2, name: 'John Lennon'},
      {id: 3, name: 'Paul McCartney'},
      {id: 4, name: 'Ringo Starr'},
    ]
  }

  // Reload member selected from 'members'.
  async reloadSelectedMember() {
    // TODO(duckworthd): Fetch selected member's details from server.
    this.selectedMemberDetails = {
      info: [
        {
          field: 'id', 
          name: 'ID', 
          value: 2, 
          editable: false
        },
        {
          field: 'name', 
          name: 'Name', 
          value: 'John Lennon', 
          editable: true
        },
        {
          field: 'last_seen', 
          name: 'Last Seen', 
          value: "Jan 1, 1970", 
          editable: false
        },
      ],
      roles: [
        {id: 1, name: 'Instructor', selected: false},
        {id: 2, name: 'Member', selected: true},
        {id: 3, name: 'Metal Shop', selected: true},
        {id: 4, name: 'Owner', selected: false},
        {id: 5, name: 'Visitor', selected: false},
      ],
      keys: [
        {id: 1, name: '0x12ab34cd', selected: true},
        {id: 1, name: '0xffa18d2a', selected: true},
      ]
    };
  }

  // Called by Vue on initialization.
  async mounted() {
    await Promise.all([this.reloadMembers(), this.reloadSelectedMember()]);
    console.log('People view mounted.')
  }
}
</script>

<style scoped lang="scss">

</style>