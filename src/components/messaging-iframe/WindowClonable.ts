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
