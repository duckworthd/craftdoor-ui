import _ from "lodash";

interface HasFieldAttr {
  field: string;
}

export function findField<T extends HasFieldAttr>(field: string, values: Array<T>): (T | null) {
  for (const value of values) {
    if (value.field == field) {
      return value;
    }
  }
  return null;
}

export function setFieldRandomly(field: string, values: Array<any>) {
  function set<T>(obj: T): T {
    const result =  _.cloneDeep(obj);
    result[field] = _.sample(values);
    return result
  }
  return set;
}