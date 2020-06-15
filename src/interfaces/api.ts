export interface Door {
  id: number;
  name: string;
}

export interface Member {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface MemberRole {
  member_id: number;
  role_id: number;
  expires_at: Date;
}

export interface DoorRole {
  door_id: number;
  role_id: number;
  daytime_begin_seconds: number;
  daytime_end_seconds: number;
}

export interface Key {
  id: number;
  member_id: number;
  secret: string;
  access_key: string;
}


// A single field about a member. For example, 'id' or 'name'.
export interface MemberInfo {
  // Name of field. e.g. 'id' or 'name'.
  field: string;

  // Human-readable name of field. e.g. "ID" or "Name".
  name: string;

  // Value of field. 
  value: number | string | boolean;

  // Can this field be edited by the UI?
  editable: boolean;
}

// Role a member may or may not have.
export interface MemberRoleInfo {
  // Unique ID for role.
  id: number;

  // Name of role.
  name: string;

  // True if current member is assigned to this role.
  selected: boolean;
}

// Key a member may or may not own.
export interface MemberKeyInfo {
  // Unique ID of key.
  id: number;

  // Name of key.
  name: string;

  // True if current member owns this key.
  selected: boolean;
}

// All details about a member.
export interface MemberDetails {
  // Unique ID for member. May be null if this is a new member that has
  // not yet been registered with the backend.
  id: number | null;

  // Information about this member. e.g. id, name, ...
  info: MemberInfo[];

  // Roles available to this member. Includes roles this member is not
  // yet assigned to.
  roles: MemberRoleInfo[];

  // Keys available to this member. Includes keys this member does not
  // own.
  keys: MemberKeyInfo[];
}

export interface RoleInfo {
  field: string;
  name: string;
  value: number | string | boolean;
  editable: boolean;
}

export interface RoleDoorInfo {
  id: number;
  name: string;
  selected: boolean;
}

export interface RolePersonInfo {
  id: number;
  name: string;
  selected: boolean;
}

export interface RoleDetails {
  id: number | null;
  info: RoleInfo[];
  doors: RoleDoorInfo[];
  people: RolePersonInfo[];
}