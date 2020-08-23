import _ from "lodash";

interface HasIdAttr {
  id: string;
}

export function findById<T extends HasIdAttr>(id: string, values: Array<T>): (T | null) {
  for (const value of values) {
    if (value.id == id) {
      return value;
    }
  }
  return null;
}