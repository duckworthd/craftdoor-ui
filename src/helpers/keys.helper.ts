import axios from "@/axios";
import { Key, RawKeyDetails, KeyDetails, KeyMemberInfo, Field, RawMember, RawKey } from "@/interfaces/api";
import { findById } from "@/helpers/utils";
import _ from 'lodash'


////////////////////////////////////////////////////////////////////////////////
// The following is a mock backend. Everything here can be safely deleted
// once the real API is ready.
////////////////////////////////////////////////////////////////////////////////

const ALL_KEY_MEMBER_INFO: Array<KeyMemberInfo> = [
  {id: 1, name: 'John Lennon', selected: false, editable: false},
  {id: 2, name: 'George Harrison', selected: false, editable: false},
  {id: 3, name: 'Paul McCartney', selected: false, editable: false},
  {id: 4, name: 'Ringo Starr', selected: false, editable: false},
];

// Generate a Key with randomly-assigned roles and keys.
function generateDetails(id: number, name: string, memberId: number): KeyDetails {
  // TODO(duckworthd): Merge KeyDetails.info and Key in a reasonable way.
  const info: Field[] = [
    {
      id: 'id', 
      name: 'ID', 
      value: id,
      editable: false,
    },
    {
      id: 'uuid', 
      name: 'UUID', 
      value: name,
      editable: true,
    },
    {
      id: 'member_id', 
      name: 'Member ID', 
      value: memberId,
      editable: false,
    },
  ];
  const members: KeyMemberInfo[] = _.map(
    ALL_KEY_MEMBER_INFO,
    function(member: KeyMemberInfo): KeyMemberInfo { 
        const newMember = _.cloneDeep(member);
        newMember.selected = (memberId == member.id);
        return newMember;
    });

  return {
    id: id,
    info: info,
    members: members,
  };
}

// List of all Keys. This is a mock of the database sitting on the server.
const ALL_KEY_DETAILS: Array<KeyDetails> = [
  generateDetails(1, "0x012345", 1),
  generateDetails(2, "0x543210", 2),
  generateDetails(3, "0xffffff", 3),
  generateDetails(4, "0xa092a0", 1),
];

////////////////////////////////////////////////////////////////////////////////
// End mock backend.
////////////////////////////////////////////////////////////////////////////////

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
    const info: Field[] = [
      {
        id: 'id',
        name: 'ID',
        value: 'Not yet assigned.',
        editable: false,
      },
      {
        id: 'uuid',
        name: 'UUID',
        value: '',
        editable: true,
      },
      {
        id: 'member_id',
        name: 'Member ID',
        value: -1,
        editable: false,
      },
    ];
    const members: KeyMemberInfo[] = await this.members();

    return {
      id: null,
      info: info,
      members: members,
    }
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
    // Update member.
    const update = {}  // RawMember
    for (const detail of details.info) {
      update[detail.id] = detail.value;
    }
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
