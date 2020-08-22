
export interface TagInfo {
  id: string;
  data: string;
}

export interface State {
  id: string;
  is_card_available: boolean;
  tag_info: TagInfo;
}
