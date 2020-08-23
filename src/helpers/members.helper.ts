import axios from "@/axios";
import { Member, MemberDetails, Field, MemberKeyInfo, RawKey, RawMember, RawMemberDetails } from "@/interfaces/api";
import { findById, setFieldRandomly } from "@/helpers/utils";
import _, { keys } from 'lodash'

const MemberHelper = {
  // Converts a MemberDetails object to a Members object.
  //
  // TODO(duckworthd): Find a way to remove this function. One should be able to access
  // MemberDetails.name as a property.
  simplify(details: MemberDetails): Member {
    const field: Field = findById("name", details.info) as Field;
    return {
      id: details.id as number,
      name: field.value as string,
    };
  },

  // Creates a new, empty placeholder member.
  //
  // This member does not yet exist on the server.
  async empty(): Promise<MemberDetails> {
    const info: Field[] = [
      {
        id: 'id', 
        name: 'ID', 
        value: 'Not yet assigned', 
        editable: false
      },
      {
        id: 'name', 
        name: 'Name', 
        value: '', 
        editable: true
      },
    ];
    const keys: MemberKeyInfo[] = await this.keys();

    return {
      id: null,
      info: info,
      keys: keys,
    }
  },

  // Get MemberDetails corresponding to a member by id.
  async details(id: number): Promise<MemberDetails> {
    const url = `${CONFIG.API_ENDPOINT}/members/${id}`;
    const member = axios.get(url)
    const allKeys = this.keys();
    return Promise.all([member, allKeys]).then(results => {
      const member: RawMemberDetails = results[0].data;
      const allKeys: MemberKeyInfo[] = results[1];

      const id: number = member.member.id;
      const info: Field[] = this.toFields(member.member);

      // Show keys assigned to member first.
      const toMemberKeyInfo = _.partial(this.toMemberKeyInfo, id)
      const oldKeys: MemberKeyInfo[] = _.map(member.keys, toMemberKeyInfo);
      const newKeys: MemberKeyInfo[] = this.filterMemberKeyInfo(allKeys, oldKeys);
      const keys: MemberKeyInfo[] = _.concat(oldKeys, newKeys);

      return {
        id: id,
        info: info,
        keys: keys,
      }
    });
  },

  // Inserts a new member and assign its roles and keys.
  //
  // Returned MemberDetails object is nearly identical to its argument except that
  // its id is populated.
  //
  // This function fails if the member already exists.
  async insert(details: MemberDetails): Promise<MemberDetails> {
    // Create new member.
    const member = {}  // RawMember, but without 'id'.
    for (const detail of details.info) {
      if (detail.id == "id") { // auto-assigned.
        continue;
      }
      member[detail.id] = detail.value;
    }
    const memberUpdateUrl = `${CONFIG.API_ENDPOINT}/members`;
    const memberUpdate = axios.post(memberUpdateUrl, member);

    return memberUpdate.then(response => {
      // Copy ID into details.
      const newDetails = _.cloneDeep(details);
      newDetails.id = response.data.id;
      const idField = findById('id', newDetails.info) as Field;
      idField.value = response.data.id;

      // Update details.
      return this.update(newDetails);
    })
  },

  // Updates an existing member's details.
  //
  // Returned MemberDetails object should be identical to the argument.
  async update(details: MemberDetails): Promise<MemberDetails> {
    // Update member.
    const member = {}  // RawMember
    for (const detail of details.info) {
      member[detail.id] = detail.value;
    }
    const memberUpdateUrl = `${CONFIG.API_ENDPOINT}/members/${details.id}`;
    const memberUpdate = axios.put(memberUpdateUrl, member);

    // Updated keys re-assigned to this member.
    const keyUpdates = [];
    for (const info of details.keys) {
      // TODO(duckworthd): If a key WAS selected and now ISN'T, then set its member_id to no one...
      if (info.selected) {
        const keyUpdateUrl = `${CONFIG.API_ENDPOINT}/keys/${info.id}`;
        const key = {
          id: info.id,
          uuid: info.name,
          member_id: details.id,
        };
        const keyUpdate = axios.put(keyUpdateUrl, key);
        keyUpdates.push(keyUpdate)
      }
    }

    // Fetch updated details after all updates resolve.
    return Promise.all(_.concat([memberUpdate], keyUpdates)).then(responses => {
      return this.details(details.id as number);
    });
  },

  // Deletes an existing member by id.
  //
  // Returns state of MemberDetails imediately before deletion.
  async delete(id: number): Promise<MemberDetails> {
    const url = `${CONFIG.API_ENDPOINT}/members/${id}`;
    return axios.delete(url).then(response => {
      // TODO(duckworthd): Fill in with actual details.
      return {
        id: id,
        info: [],
        keys: []
      }
    });
  },

  // Lists all registered members.
  async list(): Promise<Array<Member>> {
    const url = `${CONFIG.API_ENDPOINT}/members`;
    return axios.get(url).then(response => response.data);
  },
  
  // Filters out members of 'all' that are already in 'old'.
  filterMemberKeyInfo(all: MemberKeyInfo[], old: MemberKeyInfo[]): MemberKeyInfo[] {
    const visited = new Set();
    for (const key of old) {
      visited.add(key.id);
    }

    const notVisited = (info: MemberKeyInfo): boolean => {
      return !visited.has(info.id);
    }

    const remaining: MemberKeyInfo[] = _.filter(all, notVisited);
    return remaining;
  },

  // Convert a raw member to a Field[].
  toFields(member: RawMember): Array<Field> {
    return [
      {id: "id", name: "ID", value: member.id, editable: false},
      {id: "name", name: "Name", value: member.name, editable: true},
    ]
  },

  // Convert a raw key to a MemberKeyInfo object.
  toMemberKeyInfo(memberID: number, key: RawKey): MemberKeyInfo {
    return {
      id: key.id,
      name: key.uuid,
      selected: (memberID == key.member_id),
      editable: true,
    }
  },

  // Get all available keys.
  keys(): Promise<Array<MemberKeyInfo>> {
    const url = `${CONFIG.API_ENDPOINT}/keys`;
    const toKey = (key: RawKey) => {
        const result = this.toMemberKeyInfo(0, key);
        result.selected = false;
        return result;
    };

    return axios.get(url).then(response => {
      return _.map(response.data, toKey);
    });
  },

};

export default MemberHelper;
