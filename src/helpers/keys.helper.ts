import axios from "@/axios";
import { Key, KeyDetails, KeyMemberInfo, Field } from "@/interfaces/api";
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
    const memberId: Field = findById("memberId", details.info) as Field;
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
        name: 'Not yet detected.',
        value: name,
        editable: true,
      },
      {
        id: 'member_id',
        name: 'Member ID',
        value: -1,
        editable: false,
      },
    ];
    const members = _.cloneDeep(ALL_KEY_MEMBER_INFO);

    return {
      id: null,
      info: info,
      members: members,
    }
  },

  // Get KeyDetails corresponding to a Key by id.
  async details(id: number): Promise<KeyDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      for (const details of ALL_KEY_DETAILS) {
        if (details.id == id) {
          return resolve(_.cloneDeep(details));
        }
      }
      return reject(new Error(`Unable to find Key with KeyId=${id}.`));
    });
  },

  // Inserts a new Key and assign its roles and keys.
  //
  // Returned KeyDetails object is nearly identical to its argument except that
  // its id is populated.
  //
  // This function fails if the Key already exists.
  async insert(details: KeyDetails): Promise<KeyDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      if (details.id != null) {
        return reject(new Error(`Key with id=${details.id} already exists.`));
      }

      // Find the next available Key id.
      const ids: Array<number> = _.map(
        ALL_KEY_DETAILS,
        (KeyDetails: KeyDetails) => KeyDetails.id as number);
      const nextId = (_.max(ids) || 0) + 1;

      // Set id field of result.
      const result: KeyDetails = _.cloneDeep(details);
      result.id = nextId;

      const id = findById("id", result.info) as Field;
      id.value = nextId;

      // TODO(duckworthd): Set 'uuid' field to a random hex string.

      // Save new Key details in database.
      ALL_KEY_DETAILS.push(result);

      return resolve(_.cloneDeep(result));
    });
  },

  // Updates an existing Key's details.
  //
  // Returned KeyDetails object should be identical to the argument.
  async update(newDetails: KeyDetails): Promise<KeyDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      for (const details of ALL_KEY_DETAILS) {
        if (details.id == newDetails.id) {
          // TODO(duckworthd): Find a better way to update existing Key details.
          details.info = newDetails.info;
          details.members = newDetails.members;
          return resolve(_.cloneDeep(details));
        }
      }
      return reject(new Error(`Unable to find Key with id=${newDetails.id}.`));
    });
  },

  // Deletes an existing Key by id.
  //
  // Returns state of KeyDetails imediately before deletion.
  async delete(id: number): Promise<KeyDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      const removedKeyDetails = _.remove(
        ALL_KEY_DETAILS,
        (details: KeyDetails) => details.id == id);
      if (removedKeyDetails.length > 0) {
        return resolve(_.cloneDeep(removedKeyDetails[0]));
      }
      return reject(new Error(`Unable to find Key with id=${id}.`));
    });
  },

  // Lists all registered Keys.
  async list(): Promise<Array<Key>> {
    return ALL_KEY_DETAILS.map(this.simplify);
  },
};

export default KeyHelper;
