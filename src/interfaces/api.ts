export interface Member {
  id: number;
  name: string;
}

export interface Key {
  id: number;
  uuid: string;
  member_id: number;
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

  // Keys available to this member. Includes keys this member does not
  // own.
  keys: MemberKeyInfo[];
}