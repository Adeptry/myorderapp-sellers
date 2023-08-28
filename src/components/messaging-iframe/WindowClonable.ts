export type WindowClonable =
  | null
  | string
  | number
  | boolean
  | Date
  | RegExp
  | ArrayBuffer
  | DataView
  | WindowTypedArray
  | Error
  | ClonableArray
  | WindowClonableMap
  | WindowClonableSet
  | WindowClonableObject;

export interface WindowClonableObject {
  [key: string]: WindowClonable;
}

export interface ClonableArray extends Array<WindowClonable> {}

export type WindowTypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

export interface WindowClonableMap
  extends Map<WindowClonable, WindowClonable> {}

export interface WindowClonableSet extends Set<WindowClonable> {}

export function toWindowClonable(obj: any): WindowClonable {
  if (obj === null) return null;

  switch (typeof obj) {
    case "string":
    case "number":
    case "boolean":
      return obj;
    case "object":
      if (Array.isArray(obj)) {
        return obj.map(toWindowClonable) as ClonableArray;
      }
      if (obj instanceof Date) return obj;
      if (obj instanceof RegExp) return obj;
      if (obj instanceof Error) return obj;
      if (obj instanceof ArrayBuffer) return obj;
      if (obj instanceof DataView) return obj;
      if (ArrayBuffer.isView(obj)) return obj as WindowTypedArray;

      const cleanObj: WindowClonableObject = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cleanObj[key] = toWindowClonable(obj[key]);
        }
      }
      return cleanObj;

    default:
      return null;
  }
}
