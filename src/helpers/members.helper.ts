import axios from "@/axios";
import { Member, MemberDetails, Field, Key, MemberKeyInfo } from "@/interfaces/api";
import { findById, setFieldRandomly } from "@/helpers/utils";
import _ from 'lodash'


////////////////////////////////////////////////////////////////////////////////
// The following is a mock backend. Everything here can be safely deleted
// once the real API is ready.
////////////////////////////////////////////////////////////////////////////////

const ALL_MEMBER_KEY_INFO: Array<MemberKeyInfo> = [
  {id: 1, name: '0x12ab34cd', selected: false, editable: true},
  {id: 2, name: '0xffa18d2a', selected: false, editable: true},
];

// Generate a member with randomly-assigned roles and keys.
function generateMemberDetails(id: number, name: string): MemberDetails {
  // TODO(duckworthd): Merge MemberDetails.info and Member in a reasonable way.
  const info: Field[] = [
    {
      id: 'id', 
      name: 'ID', 
      value: id,
      editable: false
    },
    {
      id: 'name', 
      name: 'Name', 
      value: name,
      editable: true
    },
  ];
  const keys: MemberKeyInfo[] = _.map(
    ALL_MEMBER_KEY_INFO,
    setFieldRandomly('selected', [true, false]));

  return {
    id: id,
    info: info,
    keys: keys
  };
}

// List of all members. This is a mock of the database sitting on the server.
const ALL_MEMBER_DETAILS: Array<MemberDetails> = [
  generateMemberDetails(1, "John Lennon"),
  generateMemberDetails(2, "George Harrison"),
  generateMemberDetails(3, "Paul McCartney"),
  generateMemberDetails(4, "Ringo Starr"),
];

////////////////////////////////////////////////////////////////////////////////
// End mock backend.
////////////////////////////////////////////////////////////////////////////////

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
    const info = [
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
    const all_keys = _.cloneDeep(ALL_MEMBER_KEY_INFO);

    return {
      id: null,
      info: info,
      keys: all_keys,
    }
  },

  // Get MemberDetails corresponding to a member by id.
  async details(id: number): Promise<MemberDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      for (const details of ALL_MEMBER_DETAILS) {
        if (details.id == id) {
          return resolve(_.cloneDeep(details));
        }
      }
      return reject(new Error(`Unable to find member with id=${id}.`));
    });
  },

  // Inserts a new member and assign its roles and keys.
  //
  // Returned MemberDetails object is nearly identical to its argument except that
  // its id is populated.
  //
  // This function fails if the member already exists.
  async insert(details: MemberDetails): Promise<MemberDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      if (details.id != null) {
        return reject(new Error(`Member with memberId=${details.id} already exists.`));
      }

      // Find the next available member id.
      const ids: Array<number> = _.map(
        ALL_MEMBER_DETAILS,
        (memberDetails: MemberDetails) => memberDetails.id as number);
      const nextId = (_.max(ids) || 0) + 1;

      // Set id field of result.
      const result: MemberDetails = _.cloneDeep(details);
      result.id = nextId;

      const id = findById("id", result.info) as Field;
      id.value = nextId;

      // Save new member details in database.
      ALL_MEMBER_DETAILS.push(result);

      return resolve(_.cloneDeep(result));
    });
  },

  // Updates an existing member's details.
  //
  // Returned MemberDetails object should be identical to the argument.
  async update(newDetails: MemberDetails): Promise<MemberDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      for (const details of ALL_MEMBER_DETAILS) {
        if (details.id == newDetails.id) {
          // TODO(duckworthd): Find a better way to update existing member details.
          details.info = newDetails.info;
          details.keys = newDetails.keys;
          return resolve(_.cloneDeep(details));
        }
      }
      return reject(new Error(`Unable to find member with id=${newDetails.id}.`));
    });
  },

  // Deletes an existing member by id.
  //
  // Returns state of MemberDetails imediately before deletion.
  async delete(id: number): Promise<MemberDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      const removedMemberDetails = _.remove(
        ALL_MEMBER_DETAILS,
        (memberDetails: MemberDetails) => memberDetails.id == id);
      if (removedMemberDetails.length > 0) {
        return resolve(_.cloneDeep(removedMemberDetails[0]));
      }
      return reject(new Error(`Unable to find member with memberId=${id}.`));
    });
  },

  // Lists all registered members.
  async list(): Promise<Array<Member>> {
    return ALL_MEMBER_DETAILS.map(this.simplify);
  },
};

export default MemberHelper;
