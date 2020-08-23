export interface Member {
  id: number;
  name: string;
}

export interface Key {
  id: number;
  name: string;
}


// A single named field. For example, 'id' or 'name'.
export interface Field {
  // Name of field. e.g. 'id' or 'name'.
  id: string;

  // Human-readable name of field. e.g. "ID" or "Name".
  name: string;

  // Value of field. 
  value: number | string | boolean;

  // Can this field be edited by the UI?
  editable: boolean;
}

// Key a member may or may not own.
export interface MemberKeyInfo {
  // Unique ID of key.
  id: number;

  // Name of key.
  name: string;

  // True if current member owns this key.
  selected: boolean;

  // Can this field be edited by the UI?
  editable: boolean;
}

// All details about a member.
export interface MemberDetails {
  // Unique ID for member. May be null if this is a new member that has
  // not yet been registered with the backend.
  id: number | null;

  // Information about this member. e.g. id, name, ...
  info: Field[];

  // Keys available to this member. Includes keys this member does not
  // own.
  keys: MemberKeyInfo[];
}

export interface KeyMemberInfo {
  id: number;
  name: string;
  selected: boolean;
  editable: boolean;
}

export interface KeyDetails {
  id: number | null;
  info: Field[];
  members: KeyMemberInfo[];
}

// Key as returned by /keys
export interface RawKey {
  id: number;
  uuid: string;
  member_id: number;
}

// Key as returned by /members
export interface RawMember {
  id: number;
  name: string;
}

// Key as returned by /members
export interface RawMemberDetails {
  member: RawMember;
  keys: RawKey[];
}