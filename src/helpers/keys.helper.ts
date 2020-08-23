import axios from "@/axios";
import { Key, RawKeyDetails, KeyDetails, KeyMemberInfo, Field, RawMember, RawKey } from "@/interfaces/api";
import { findById } from "@/helpers/utils";
import _ from 'lodash'


const KeyHelper = {
  // Converts a KeyDetails object to a Keys object.
  //
  // TODO(duckworthd): Find a way to remove this function. One should be able to access
  // KeyDetails.name as a property.
  simplify(details: KeyDetails): Key {
    const uuid: Field = findById("uuid", details.info) as Field;
    return {
      id: details.id as number,
      name: uuid.value as string,
    };
  },

  // Creates a new, empty placeholder Key.
  //
  // This Key does not yet exist on the server.
  async empty(): Promise<KeyDetails> {
    const url = `${CONFIG.API_ENDPOINT}/keys/new`;
    const update = {
      member_id: -1
    };
    return axios.post(url, update).then(response => {
      const key: RawKey = response.data;
      return this.details(key.id);
    });
  },

  // Get KeyDetails corresponding to a Key by id.
  async details(id: number): Promise<KeyDetails> {
    const url = `${CONFIG.API_ENDPOINT}/keys/${id}`;
    const details = axios.get(url)
    const allMembers = this.members();
    return Promise.all([details, allMembers]).then(results => {
      const key: RawKeyDetails = results[0].data;
      const allMembers: KeyMemberInfo[] = results[1];

      const id: number = key.key.id;
      const info: Field[] = this.toFields(key.key);

      // Show keys assigned to member first.
      const toKeyMemberInfo = _.partial(this.toKeyMemberInfo, key.key.member_id)
      const members: KeyMemberInfo[] = _.map(allMembers, toKeyMemberInfo);
      console.log(`members: ${JSON.stringify(members)}`);

      return {
        id: id,
        info: info,
        members: members,
      }
    });
  },

  // Inserts a new Key and assign its roles and keys.
  //
  // Returned KeyDetails object is nearly identical to its argument except that
  // its id is populated.
  //
  // This function fails if the Key already exists.
  async insert(details: KeyDetails): Promise<KeyDetails> {
    // Create new member.
    const update = {}  // RawMember, but without 'id'.
    for (const detail of details.info) {
      if (detail.id == "id") { // auto-assigned.
        continue;
      }
      if (detail.id == "member_id") { // token value.
        detail.value = -1;
      }
      update[detail.id] = detail.value;
    }
    // TODO(duckworthd): Don't depend on the user to set the UUID by hand.
    const url = `${CONFIG.API_ENDPOINT}/keys`;
    return axios.post(url, update);
  },

  // Updates an existing Key's details.
  //
  // Returned KeyDetails object should be identical to the argument.
  async update(details: KeyDetails): Promise<KeyDetails> {
    const update = {}  // RawKey
    for (const detail of details.info) {
      if (detail.id == "name") {
        // TODO(duckworthd): This is an ugly hack. The frontend expects a "name"
        // field, but the backend expects "uuid". Find a better way to translate
        // between frontend and backend representations.
        continue;
      }
      update[detail.id] = detail.value;
    }
    console.log(`update: ${JSON.stringify(update)}`);
    const url = `${CONFIG.API_ENDPOINT}/keys/${details.id}`;
    return axios.put(url, update);
  },

  // Deletes an existing Key by id.
  //
  // Returns state of KeyDetails imediately before deletion.
  async delete(id: number): Promise<KeyDetails> {
    const url = `${CONFIG.API_ENDPOINT}/keys/${id}`;
    return axios.delete(url).then(response => {
      // TODO(duckworthd): Fill in with actual details.
      return {
        id: id,
        info: [],
        members: []
      }
    });
  },

  // Lists all registered Keys.
  async list(): Promise<Array<Key>> {
    const url = `${CONFIG.API_ENDPOINT}/keys`;
    const toKey = (key: RawKey): Key => {
      return { id: key.id, name: key.uuid };
    }
    return axios.get(url).then(response => {
      return _.map(response.data, toKey);
    });
  },

  // Convert a raw member to a Field[].
  toFields(key: RawKey): Array<Field> {
    return [
      {id: "id", name: "ID", value: key.id, editable: false},
      {id: "name", name: "Name", value: key.uuid, editable: true},
      {id: "uuid", name: "UUID", value: key.uuid, editable: true},
      {id: "member_id", name: "Member ID", value: key.member_id, editable: false},
    ]
  },

  // Convert a raw key to a MemberKeyInfo object.
  toKeyMemberInfo(memberID: number, member: RawMember): KeyMemberInfo {
    return {
      id: member.id,
      name: member.name,
      selected: (memberID == member.id),
      editable: false,
    }
  },

  // Get all available members.
  members(): Promise<Array<KeyMemberInfo>> {
    const url = `${CONFIG.API_ENDPOINT}/members`;
    const toMember = (member: RawMember) => {
        const result = this.toKeyMemberInfo(0, member);
        result.selected = false;
        return result;
    };

    return axios.get(url).then(response => {
      return _.map(response.data, toMember);
    });
  },
};

export default KeyHelper;
