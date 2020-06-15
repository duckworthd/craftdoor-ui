import axios from "@/axios";
import { Role, RoleInfo, RoleDetails, RoleDoorInfo, RolePersonInfo } from "@/interfaces/api";
import { findField, setFieldRandomly } from "@/helpers/utils";
import _ from "lodash";

////////////////////////////////////////////////////////////////////////////////
// The following is a mock backend. Everything here can be safely deleted
// once the real API is ready.
//
// TODO(duckworthd): This file is incredibly redundant with members.helper.ts.
// Find a way to minimize the redundancy.
////////////////////////////////////////////////////////////////////////////////

const ALL_ROLE_DOOR_INFO: Array<RoleDoorInfo> = [
  {id: 1, name: 'Front Door', selected: false},
  {id: 2, name: 'Cafe', selected: false},
  {id: 3, name: 'Coworking Space', selected: false},
  {id: 4, name: 'Metal Shop', selected: false},
];
const ALL_ROLE_PERSON_INFO: Array<RolePersonInfo> = [
  {id: 1, name: 'John Lennon', selected: false},
  {id: 2, name: 'George Harrison', selected: false},
  {id: 3, name: 'Paul McCartney', selected: false},
  {id: 4, name: 'Ringo Starr', selected: false},
];

function generateDetails(id: number, name: string): RoleDetails {
  const info: RoleInfo[] = [
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
  ];
  const doors: RoleDoorInfo[] = _.map(
    ALL_ROLE_DOOR_INFO,
    setFieldRandomly('selected', [true, false]));
  const people: RolePersonInfo[] = _.map(
    ALL_ROLE_PERSON_INFO,
    setFieldRandomly('selected', [true, false]));

  return {
    id: id,
    info: info,
    doors: doors,
    people: people,
  };
}

// List of all members. This is a mock of the database sitting on the server.
const ALL_ROLE_DETAILS: Array<RoleDetails> = [
  generateDetails(1, "Instructor"),
  generateDetails(2, "Member"),
  generateDetails(3, "Metal Shop"),
  generateDetails(4, "Owner"),
  generateDetails(5, "Visitor"),
];
////////////////////////////////////////////////////////////////////////////////
// End mock backend.
////////////////////////////////////////////////////////////////////////////////


const RoleHelper = {
  simplifyDetails(details: RoleDetails): Role {
    const field: RoleInfo = findField("name", details.info) as RoleInfo;
    return {
      id: details.id as number,
      name: field.value as string,
    };
  },

  async newEmptyDetails(): Promise<RoleDetails> {
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
    ];
    const allDoors = this.listAllRoleDoorInfo();
    const allPeople = this.listAllRolePersonInfo();

    return {
      id: null,
      info: info,
      doors: await allDoors,
      people: await allPeople,
    }
  },

  async getDetails(id: number): Promise<RoleDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      for (const details of ALL_ROLE_DETAILS) {
        if (details.id == id) {
          return resolve(_.cloneDeep(details));
        }
      }
      return reject(new Error(`Unable to find role with id=${id}.`));
    });
  },

  async insertDetails(newDetails: RoleDetails): Promise<RoleDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      if (newDetails.id != null) {
        return reject(new Error(`role with id=${newDetails.id} already exists.`));
      }

      // Find the next available member id.
      const ids: Array<number> = _.map(
        ALL_ROLE_DETAILS,
        (details: RoleDetails) => details.id as number);
      const nextId = (_.max(ids) || 0) + 1;

      // Set id field of result.
      const result: RoleDetails = _.cloneDeep(newDetails);
      result.id = nextId;

      const info = findField("id", result.info) as RoleInfo;
      info.value = nextId;

      // Save new member details in database.
      ALL_ROLE_DETAILS.push(result);

      return resolve(_.cloneDeep(result));
    });
  },

  async updateDetails(newDetails: RoleDetails): Promise<RoleDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      for (const details of ALL_ROLE_DETAILS) {
        if (details.id == newDetails.id) {
          // TODO(duckworthd): Find a better way to update existing member details.
          details.info = newDetails.info;
          details.people = newDetails.people;
          details.doors = newDetails.doors;
          return resolve(_.cloneDeep(details));
        }
      }
      return reject(new Error(`Unable to find role with id=${newDetails.id}.`));
    });
  },

  async delete(id: number): Promise<RoleDetails> {
    // TODO(duckworthd): Replace with actual API call.
    return new Promise((resolve, reject) => {
      const removedDetails = _.remove(
        ALL_ROLE_DETAILS,
        (details: RoleDetails) => details.id == id);
      if (removedDetails.length > 0) {
        return resolve(_.cloneDeep(removedDetails[0]));
      }
      return reject(new Error(`Unable to find role with id=${id}.`));
    });
  },

  async listAllRoleDoorInfo(): Promise<Array<RoleDoorInfo>> {
    // TODO(duckworthd): Replace with actual API call.
    return Promise.resolve(_.cloneDeep(ALL_ROLE_DOOR_INFO));
  },

  // Lists all valid keys a Member can take on.
  async listAllRolePersonInfo(): Promise<Array<RolePersonInfo>> {
    // TODO(duckworthd): Replace with actual API call.
    return Promise.resolve(_.cloneDeep(ALL_ROLE_PERSON_INFO));
  },

  // Lists all registered members.
  async list(): Promise<Array<Role>> {
    return ALL_ROLE_DETAILS.map(
      (details: RoleDetails): Role => {
        const id = details.id as number;
        const info = findField("name", details.info) as RoleInfo;
        const name = info.value as string;
        return { id: id, name: name }
      }
    );
  },

  async create(t: Role): Promise<Role> {
    const url = `${CONFIG.API_ENDPOINT}/roles`;
    return await axios.post(url, t);
  },
  // async list(): Promise<Role[]> {
  //   const url = `${CONFIG.API_ENDPOINT}/roles`;
  //   return await axios.get(url);
  // },
  async listOfMember(memberID: number): Promise<Role[]> {
    const url = `${CONFIG.API_ENDPOINT}/members/${memberID}/roles`;
    return await axios.get(url);
  },
  async listOfDoor(doorID: number): Promise<Role[]> {
    const url = `${CONFIG.API_ENDPOINT}/doors/${doorID}/roles`;
    return await axios.get(url);
  },
  async update(t: Role) {
    const url = `${CONFIG.API_ENDPOINT}/roles/${t.id}`;
    return await axios.put(url, t);
  },
  // async delete(id: number): Promise<Role> {
  //   const url = `${CONFIG.API_ENDPOINT}/roles/${id}`;
  //   return await axios.delete(url);
  // }
};

export default RoleHelper;
