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


// MemberInfo
export interface MemberInfo {
  field: string;
  name: string;
  value: number | string | boolean;
  editable: boolean;
}

export interface MemberRoleInfo {
  id: number;
  name: string;
  selected: boolean;
}

export interface MemberKeyInfo {
  id: number;
  name: string;
  selected: boolean;
}


export interface MemberDetails {
  info: MemberInfo[];
  roles: MemberRoleInfo[];
  keys: MemberKeyInfo[];
}