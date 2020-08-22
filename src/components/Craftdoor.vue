<template>
  <div class="craftdoor">
    <div class="control-menu row">
      <!-- Spacing -->
      <div class="col-md-8"></div>

      <!-- Buttons at the very top of the view. -->
      <div class="col-md-4">
        <button type="button"
            v-on:click="createNewEntity">
          New
        </button>
        <button type="button" 
            v-on:click="syncSelectedEntity">
          Update
        </button>
        <button type="button" 
            v-on:click="deleteSelectedEntity">
          Delete
        </button>
      </div>
    </div>

    <div class="row">
      <!-- Left-hand side menu for choosing a person. -->
      <div class="options-panel col-md-3">
        <searchable-options-list 
            v-bind:options="entities"
            v-bind:selected.sync="selectedEntity"
          ></searchable-options-list>
      </div>

      <!-- Right-hand side details view. Caller controls contents of this. -->
      <div class="details-panel col-md-9">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SearchableOptionsList from "@/components/SearchableOptionsList.vue";

export interface Entity {
  id: number;
}

export interface EntityDetails {
  id: number | null;
}

export interface EntityApi {
  // Stateless.
  details(entityId: number): Promise<EntityDetails>;
  list(): Promise<Array<Entity>>;
  empty(): Promise<EntityDetails>;

  // Stateful.
  insert(entityDetails: EntityDetails): Promise<EntityDetails>;
  update(entityDetails: EntityDetails): Promise<EntityDetails>;
  delete(entityId: number): Promise<EntityDetails>;

  // Utilities.
  simplify(entityDetails: EntityDetails): Entity;
}

@Component({
  components: { 
    SearchableOptionsList, 
  },
  props: {
    api: Object,
  }
})
export default class CraftdoorVue extends Vue {
  // List of all entities.
  entities: Entity[] = [];

  // Details of currently selected entity shown on RHS.
  selectedEntity: Entity | null = null;
  selectedEntityDetails: EntityDetails | null = null;

  // Interface to backend.
  api!: EntityApi

  // Creates a new, empty person.
  async createNewEntity() {
    console.log('createNewEntity()');
    this.selectedEntity = null;
    this.selectedEntityDetails = await this.api.empty();
    this.$emit('update:selected-entity-details', this.selectedEntityDetails);
  }

  // Update all properties of selectedEntityDetails with the server.
  async syncSelectedEntity() {
    // TODO(duckworthd): This method assumes that this.selectedEntityDetails
    // contains the new state for the selected entity. This will only be the
    // case if changes made if the field is a prop. It currently isn't but
    // seems to work anyways.
    console.log('syncSelectedEntity()');
    console.log(JSON.stringify(this.selectedEntityDetails));

    if (this.selectedEntityDetails == null) {
      // TODO(duckworthd): Show an error message if this happens.
      return;
    }

    if (this.selectedEntityDetails.id == null) {
      console.log('This is a new entity.');
      return (this.api
          .insert(this.selectedEntityDetails)
          .then((entityDetails: EntityDetails) => this.setSelectedEntityById(entityDetails.id))
          .then(this.reloadEntities)
          .then(this.reloadSelectedEntityDetails));
    }

    console.log('This is an existing entity.');
    return (this.api
        .update(this.selectedEntityDetails)
        .then(this.reloadEntities)
        .then(this.reloadSelectedEntityDetails));
  }

  // Deletes the currently selected entity.
  async deleteSelectedEntity() {
    console.log('deleteSelectedEntity()');
    console.log(JSON.stringify(this.selectedEntity));
    if (this.selectedEntity == null || this.selectedEntity.id == null) {
      // TODO(duckworthd): Show an error message if this happens.
      return;
    }

    // TODO(duckworthd): Set selected entity to null after successful deletion.
    return (this.api
        .delete(this.selectedEntity.id as number)
        .then((entityDetails: EntityDetails) => this.setSelectedEntityById(null))
        .then(this.reloadEntities)
        .then(this.reloadSelectedEntityDetails));
  }

  // Sets selectedEntity based on its id.
  async setSelectedEntityById(id: number | null) {
    if (id == null) {
      this.selectedEntity = null;
      return;
    }

    // TODO(duckworthd): Simplify logic for finding the name of a entity.
    const details = await this.api.details(id);
    this.selectedEntity = this.api.simplify(details);
  }

  // Reload list of active entities.
  async reloadEntities() {
    console.log('reloadEntities()');
    this.entities = await this.api.list();
    console.log(`reloadEntities(): ${this.entities.length} loaded.`);
  }

  // Reload entity selected from 'entities'.
  @Watch('selectedEntity')
  async reloadSelectedEntityDetails() {
    console.log('reloadSelectedEntityDetails()');
    if (this.selectedEntity == null) {
      // No entity has been selected yet.
      console.log('Selected entity is null.');
      this.selectedEntityDetails = null;
    } else if (this.selectedEntity.id == null) {
      // This is a new entity that doesn't yet have an id.
      console.log('Selected entity has no ID.');
      this.selectedEntityDetails = null;
    } else {
      // This is an existing entity.
      console.log('Fetching entity details from server.');
      this.selectedEntityDetails = await this.api.details(this.selectedEntity.id);
    }
    this.$emit('update:selected-entity-details', this.selectedEntityDetails);
  }

  // Called by Vue on initialization.
  async mounted() {
    console.log('CraftdoorVue mounted()')
    await this.reloadEntities();
  }
}
</script>

<style scoped lang="scss">
</style>