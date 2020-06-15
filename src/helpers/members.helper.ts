import axios from "@/axios";
import { Member, MemberRole, MemberDetails, MemberRoleInfo, MemberKeyInfo, MemberInfo } from "@/interfaces/api";
import { findField, setFieldRandomly } from "@/helpers/utils";
import _ from 'lodash'


////////////////////////////////////////////////////////////////////////////////
// The following is a mock backend. Everything here can be safely deleted
// once the real API is ready.
////////////////////////////////////////////////////////////////////////////////

const ALL_MEMBER_ROLE_INFO: Array<MemberRoleInfo> = [
  {id: 1, name: 'Instructor', selected: false},
  {id: 2, name: 'Member', selected: false},
  {id: 3, name: 'Metal Shop', selected: false},
  {id: 4, name: 'Owner', selected: false},
  {id: 5, name: 'Visitor', selected: false},
];
const ALL_MEMBER_KEY_INFO: Array<MemberKeyInfo> = [
  {id: 1, name: '0x12ab34cd', selected: false},
  {id: 1, name: '0xffa18d2a', selected: false},
];

// Generate a member with randomly-assigned roles and keys.
function generateMemberDetails(id: number, name: string, last_seen: string): MemberDetails {
  // TODO(duckworthd): Merge MemberDetails.info and Member in a reasonable way.
  const info: MemberInfo[] = [
    {
      field: 'id', 
      name: 'ID', 
      value: id,
      editable: false
    },
    {
      field: 'name', 
      name: 'Name', 
      value: name,
      editable: true
    },
    {
      field: 'last_seen', 
      name: 'Last Seen', 
      value: last_seen,
      editable: false
    },
  ];
  const roles: MemberRoleInfo[] = _.map(
    ALL_MEMBER_ROLE_INFO,
    setFieldRandomly('selected', [true, false]));
  const keys: MemberKeyInfo[] = _.map(
    ALL_MEMBER_KEY_INFO,
    setFieldRandomly('selected', [true, false]));

  return {
    id: id,
    info: info,
    roles: roles,
    keys: keys
  };
}

// List of all members. This is a mock of the database sitting on the server.
const ALL_MEMBER_DETAILS: Array<MemberDetails> = [
  generateMemberDetails(1, "John Lennon", "Jan 1, 1970"),
  generateMemberDetails(2, "George Harrison", "Jan 2, 1970"),
  generateMemberDetails(3, "Paul McCartney", "Jan 3, 1970"),
  generateMemberDetails(4, "Ringo Starr", "Jan 4, 1970"),
];
////////////////////////////////////////////////////////////////////////////////
// End mock backend.
////////////////////////////////////////////////////////////////////////////////

const MemberHelper = {
  // Converts a MemberDetails object to a Members object.
  //
  // TODO(duckworthd): Find a way to remove this function. One should be able to access
  // MemberDetails.name as a property.
  simplifyMemberDetails(memberDetails: MemberDetails): Member {
    const field: MemberInfo = findField("name", memberDetails.info) as MemberInfo;
    return {
      id: memberDetails.id as number,
      name: field.value as string,
    };
  },

  // Creates a new, empty placeholder member.
  //
  // This member does not yet exist on the server.
  async newEmptyMemberDetails(): Promise<MemberDetails> {
    const info = [
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
        value: 'Never',
        editable: false
      },
    ];
    const all_roles = this.listAllMemberRoleInfo();
    const all_keys = this.listAllMemberKeyInfo();

    return {
      id: null,
      info: info,
      roles: await all_roles,
      keys: await all_keys,
    }
  },

  // Get MemberDetails corresponding to a member by id.
  async getMemberDetails(memberId: number): Promise<MemberDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      for (const memberDetails of ALL_MEMBER_DETAILS) {
        if (memberDetails.id == memberId) {
          return resolve(_.cloneDeep(memberDetails));
        }
      }
      return reject(new Error(`Unable to find member with memberId=${memberId}.`));
    });
  },

  // Inserts a new member and assign its roles and keys.
  //
  // Returned MemberDetails object is nearly identical to its argument except that
  // its id is populated.
  //
  // This function fails if the member already exists.
  async insertMemberDetails(newMemberDetails: MemberDetails): Promise<MemberDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      if (newMemberDetails.id != null) {
        return reject(new Error(`Member with memberId=${newMemberDetails.id} already exists.`));
      }

      // Find the next available member id.
      const memberIds: Array<number> = _.map(
        ALL_MEMBER_DETAILS,
        (memberDetails: MemberDetails) => memberDetails.id as number);
      const nextMemberId = (_.max(memberIds) || 0) + 1;

      // Set id field of result.
      const result: MemberDetails = _.cloneDeep(newMemberDetails);
      result.id = nextMemberId;

      const memberInfo = findField("id", result.info) as MemberInfo;
      memberInfo.value = nextMemberId;

      // Save new member details in database.
      ALL_MEMBER_DETAILS.push(result);

      return resolve(_.cloneDeep(result));
    });
  },

  // Updates an existing member's details.
  //
  // Returned MemberDetails object should be identical to the argument.
  async updateMemberDetails(newMemberDetails: MemberDetails): Promise<MemberDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      for (const memberDetails of ALL_MEMBER_DETAILS) {
        if (memberDetails.id == newMemberDetails.id) {
          // TODO(duckworthd): Find a better way to update existing member details.
          memberDetails.info = newMemberDetails.info;
          memberDetails.keys = newMemberDetails.keys;
          memberDetails.roles = newMemberDetails.roles;
          return resolve(_.cloneDeep(memberDetails));
        }
      }
      return reject(new Error(`Unable to find member with memberId=${newMemberDetails.id}.`));
    });
  },

  // Deletes an existing member by id.
  //
  // Returns state of MemberDetails imediately before deletion.
  async deleteMember(memberId: number): Promise<MemberDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      const removedMemberDetails = _.remove(
        ALL_MEMBER_DETAILS,
        (memberDetails: MemberDetails) => memberDetails.id == memberId);
      if (removedMemberDetails.length > 0) {
        return resolve(_.cloneDeep(removedMemberDetails[0]));
      }
      return reject(new Error(`Unable to find member with memberId=${memberId}.`));
    });
  },

  // Lists all valid roles a Member can take on.
  async listAllMemberRoleInfo(): Promise<Array<MemberRoleInfo>> {
    // TODO(duckworthd): Replace with actual API call.
    return Promise.resolve(_.cloneDeep(ALL_MEMBER_ROLE_INFO));
  },

  // Lists all valid keys a Member can take on.
  async listAllMemberKeyInfo(): Promise<Array<MemberKeyInfo>> {
    // TODO(duckworthd): Replace with actual API call.
    return Promise.resolve(_.cloneDeep(ALL_MEMBER_KEY_INFO));
  },

  // Lists all registered members.
  async listMembers(): Promise<Array<Member>> {
    return ALL_MEMBER_DETAILS.map(
      (memberDetails: MemberDetails): Member => {
        const memberId = memberDetails.id as number;
        const memberInfo = findField("name", memberDetails.info) as MemberInfo;
        const memberName = memberInfo.value as string;
        return { id: memberId, name: memberName }
      }
    );
  },

  async create(t: Member): Promise<Member> {
    const url = `${CONFIG.API_ENDPOINT}/members`;
    return await axios.post(url, t);
  },
  async addRole(t: MemberRole): Promise<any> {
    const url = `${CONFIG.API_ENDPOINT}/members/${t.member_id}/roles/${t.role_id}`;
    return await axios.post(url, t);
  },
  async list(): Promise<Member[]> {
    const url = `${CONFIG.API_ENDPOINT}/members`;
    return await axios.get(url);
  },
  async update(t: Member) {
    const url = `${CONFIG.API_ENDPOINT}/members/${t.id}`;
    return await axios.put(url, t);
  },
  async delete(id: number): Promise<Member> {
    const url = `${CONFIG.API_ENDPOINT}/members/${id}`;
    return await axios.delete(url);
  }
};

export default MemberHelper;
